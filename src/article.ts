import { z } from 'zod';

const annotatedText = z.object({
  text: z.string(),
});

const annotation = z.object({
  type: z.string(),
  index: z.number(),
  length: z.number(),
});

const blockQuote = z.object({
  type: z.literal('BLOCK_QUOTE'),
  text: z.string(),
  annotations: z.array(annotation),
});

const bookInfo = z.object({
  type: z.literal('BOOK_INFO'),
  text: z.string(),
  annotations: z.array(annotation),
});

const crosshead = z.object({
  type: z.literal('CROSSHEAD'),
  text: z.string(),
});

const divider = z.object({
  type: z.literal('DIVIDER'),
});

const orderedList = z.object({
  type: z.literal('ORDERED_LIST'),
  items: z.array(annotatedText),
});

const paragraph = z.object({
  type: z.literal('PARAGRAPH'),
  text: z.string(),
  annotations: z.array(annotation),
});

const pullQuote = z.object({
  type: z.literal('PULL_QUOTE'),
  text: z.string(),
  annotations: z.array(annotation),
});

const unorderedList = z.object({
  type: z.literal('UNORDERED_LIST'),
  items: z.array(annotatedText),
});

const anyComponent = z.object({
  type: z.string(),
});

const articleComponent = z.union([
  blockQuote,
  bookInfo,
  crosshead,
  divider,
  orderedList,
  paragraph,
  pullQuote,
  unorderedList,
  anyComponent,
]);

const infobox = z.object({
  type: z.literal('INFOBOX'),
  components: z.array(articleComponent),
});

const allArticleComponents = z.union([
  blockQuote,
  bookInfo,
  crosshead,
  divider,
  orderedList,
  paragraph,
  pullQuote,
  unorderedList,
  infobox,
  anyComponent,
]);

export type ArticleComponent = z.infer<typeof allArticleComponents>;

const section = z.object({
  name: z.string(),
});

export const Article = z.object({
  headline: z.string(),
  flyTitle: z.string(),
  rubric: z.string(),
  dateFirstPublished: z.coerce.date(),
  section,
  body: z.array(allArticleComponents),
});

export type Article = z.infer<typeof Article>;
