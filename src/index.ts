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

  paths(): string[] {
    return this._files.map((f: File) => f.path);
  }

  all(): File[] {
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

  slugs(): string[] {
    return this._documents.map((doc) => doc.slug);
  }

  all(): Document[] {
    return this._documents;
  }
}

const files = async (pattern: string | string[]): Promise<Files> => {
  const files: File[] = await walkAndReturn(pattern, async (filepath: string): Promise<File> => {
    return await makeFile(filepath);
  });
  return new Files(files);
};

const documents = async (pattern: string | string[]): Promise<Documents> => {
  const documents: Document[] = await walkAndReturn(
    pattern,
    async (filepath: string): Promise<Document> => {
      const f = await makeFile(filepath as string);
      return makeDoc(f);
    }
  );
  return new Documents(documents);
};

const walkAndReturn = async <T>(
  pattern: string | string[],
  fn: (filepath: string) => Promise<T>
): Promise<T[]> => {
  const items: T[] = [];
  const stream: NodeJS.ReadableStream = fg.stream(pattern, { dot: true });
  for await (const entry of stream) {
    const t: T = await fn(entry as string);
    items.push(t);
  }
  return items;
};

export { documents, files, Document, Documents, File, Files };
