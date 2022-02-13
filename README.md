# Inhalt

[![build-test](https://github.com/lucperkins/inhalt/actions/workflows/all.yml/badge.svg)](https://github.com/lucperkins/inhalt/actions/workflows/all.yml)

Inhalt is a TypeScript/JavaScript library for local content management. It's mean to be used with static generators and other tools that involve turning assets in your local directories—Markdown, JSON, YAML, and others—into HTML, tables of content, search indices, and all the other things that make blogs, documentation hubs, and other complex sites work.

## Status

Inhalt is in its _very_ early phases—as in, still basically a weekend project. Don't use it just yet but if you have requests for what you'd want to see in a library like this, please do feel free to file an issue!

## Goals

Static site generation has recently gotten _very_ interesting in the JavaScript space with the rise of blazing-fast build tools like [Vite] and [swc] and powerful, developer-friendly frameworks like [Next.js][next], [Gatsby], [Nuxt], [Astro], and [Remix].

One thing these frameworks have in common is that they require you to do your own content management. If you want to build a blog or a documentation site, you need to supply your own logic to fetch files, choose the right data from those files, convert files in formats like [Markdown] to HTML, and so on. Some of these frameworks do have good content management libraries, such as [`nuxt-content`][nuxt-content] for [Nuxt], but I don't really see anyone sharing their work or trying to build something foundational to relieve others of work.

But I look out in this space and see a lot of redundant effort. What if we could just have _one_ really good library that developers could use directly inside of these frameworks _or_ as the basis for framwork-specific libraries.

## Example

Here's an example for a [Next.js][next] project:

```tsx
import { document, files } from "inhalt";

// pages/docs/index.js
export async function getStaticProps() {
  // Fetch all Markdown files in the supplied glob
  // (not parsed, just the raw files)
  const docs = await files("docs/**/*.{md,mdx}");

  return {
    props: {
      docs
    }
  }
}

// The rendered docs TOC
export default Docs(props) {
  return (
    <>
      <h1>Docs landing page</h1>
      <ul>
        {props.docs.map(doc => (
          <li key={doc.slug}>
            <Link href={doc.path}>
              {doc.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

// pages/docs/[slug].js
export async function getStaticProps(ctx) {
  const { slug } = ctx.params;
  // Fetch a single doc (already converted to HTML)
  const doc = document(slug);

  return {
    props: {
      doc
    }
  }
}

export async function getStaticPaths() {
  // Fetch all Markdown files in the supplied glob
  // (not parsed, just the raw files)
  const docs = await files("docs/**/*.{md,mdx}");

  return docs.map(doc => {
    params: {
      slug: doc.slug
    }
  })
}

export default Doc(props) {
  const doc = props.doc;

  return (
    <div dangerouslySetInnerHtml={{ __html: doc.html }}></div>
  );
}
```

## Documentation

Docs are very much a work in progress but you can check out the [Typedoc][docs].

[astro]: https://astro.build
[docs]: https://lucperkins.github.io/inhalt
[gatsby]: https://gatsbyjs.com
[markdown]: https://www.markdownguide.org
[next]: https://nextjs.org
[nuxt]: https://nuxtjs.org
[nuxt-content]: https://content.nuxtjs.org
[remix]: https://remix.run
[swc]: https://swc.rs
[vite]: https://vitejs.dev
