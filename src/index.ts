import fg from "fast-glob";
import { readFile } from "fs/promises";
import { join, parse, ParsedPath } from "path";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

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
  name: string;
  dir: string;
  path: string;
  extension: string;
  raw: string;
};

interface Document extends File {
  slug: string;
  html: string;
}

const makeFile = async (filepath: string): Promise<File> => {
  const path: ParsedPath = parse(filepath);
  const raw: Buffer = await readFile(filepath);

  return {
    name: path.name,
    dir: path.dir,
    path: filepath,
    extension: path.ext,
    raw: raw.toString(),
  };
};

const makeDoc = async (f: File): Promise<Document> => {
  const html = await convert(f.raw);
  const slug = join(f.dir, f.name);
  return {
    html,
    slug,
    ...f,
  };
};

/**
 * A helper class for working with collections of {@linkcode File}s.
 */
class Files {
  private readonly _files: File[];

  constructor(files: File[]) {
    this._files = files;
  }

  documents(): Promise<Document[]> {
    return Promise.all(
      this._files.map(async (file) => {
        return makeDoc(file);
      })
    );
  }

  get slugs(): string[] {
    return this._files.map((f: File) => f.slug);
  }

  get paths(): string[] {
    return this._files.map((f: File) => f.path);
  }

  get all(): File[] {
    return this._files;
  }
}

/**
 * A helper class for working with collections of {@linkcode Document}s.
 */
class Documents {
  private readonly _documents: Document[];

  constructor(documents: Document[]) {
    this._documents = documents;
  }

  get all(): Document[] {
    return this._documents;
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

const documents = async (pattern: string | string[]): Promise<Document[]> => {
  return await (await glob(pattern)).documents();
};

export { documents, glob, Document, File, Files };
