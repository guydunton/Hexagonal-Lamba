import { Article, ArticleComponent } from './article';
import { Block } from './tts-generator';

export function convertArticle(article: Article): Block[] {
  const aiDisclaimer = 'This audio has been produced using an AI voice.';
  const sectionName = article.flyTitle;
  const headline = article.headline;
  const rubric = article.rubric;
  const lead = [aiDisclaimer, sectionName, headline, rubric]
    .map((text) => ({ type: 'TEXT', text }))
    .reduce((state, val) => {
      state.push(val as Block);
      state.push({ type: 'PAUSE', length: 1 });
      return state;
    }, [] as Block[]);

  const body = convertBody(article);

  return [...lead, ...body];
}

function convertBody(article: Article): Block[] {
  return article.body.map(processComponent).filter((block) => block !== undefined);
}

function processComponent(component: ArticleComponent): Block | undefined {
  switch (component.type) {
    case 'PARAGRAPH':
    case 'BLOCK_QUOTE':
    case 'PULL_QUOTE':
    case 'BOOK_INFO':
      return { type: 'TEXT', text: (component as any).text };
    case 'ORDERED_LIST':
    case 'UNORDERED_LIST':
      return (component as any).items.map((text: { text: string }) => ({
        type: 'TEXT',
        text: text.text,
      }));
    default:
      return undefined;
  }
}
