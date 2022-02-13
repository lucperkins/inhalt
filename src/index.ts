import fg from 'fast-glob';
import { readFile } from 'fs/promises';
import { join, parse, ParsedPath } from 'path';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const convert = async (input: string): Promise<string> => {
  const parsed = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(input);

  return String(parsed);
};

type File = {
  dir: string;
  path: string;
  extension: string;
  slug: string;
  raw: string;
};

interface Markdown extends File {
  html: string;
}

const makeFile = async (filepath: string): Promise<File> => {
  const path: ParsedPath = parse(filepath);
  const raw: Buffer = await readFile(filepath);
  const slug = join(path.dir, path.name);

  return {
    dir: path.dir,
    path: filepath,
    extension: path.ext,
    slug,
    raw: raw.toString(),
  };
};

class Files {
  private readonly _files: File[];

  constructor(files: File[]) {
    this._files = files;
  }

  markdown(): Promise<Markdown[]> {
    return Promise.all(
      this._files.map(async (file) => {
        const html = await convert(file.raw);
        return {
          html,
          ...file,
        };
      })
    );
  }

  get files(): File[] {
    return this._files;
  }
}

const glob = async (pattern: string | string[]): Promise<Files> => {
  const files: File[] = [];
  const stream = fg.stream(pattern, { dot: true });
  for await (const entry of stream) {
    const f = await makeFile(entry as string);
    files.push(f);
  }
  return new Files(files);
};

const files = async (directory: string): Promise<Files> => {
  const pattern = `${directory}/**/*`;
  return glob(pattern);
};

const markdown = async (pattern: string): Promise<Markdown[]> => {
  return (await glob(pattern)).markdown();
};

export { glob, files, markdown, File, Files, Markdown };
