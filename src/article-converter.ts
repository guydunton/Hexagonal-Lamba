import { Article, ArticleComponent } from './article';
import { Block } from './tts-generator';

export function convertDefaultArticle(article: Article): Block[] {
  const aiDisclaimer = 'This story is AI narrated.';
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

  const data = [...lead, ...body];

  for (let i = 0; i < data.length; i++) {
    const block = data[i];
    if (block.type === 'TEXT') {
      block.text = sanitiseText(block.text);
    }
  }

  return data;
}

function convertBody(article: Article): Block[] {
  return article.body.map(processComponent).filter((block) => block !== undefined);
}

function processComponent(component: ArticleComponent): Block | undefined {
  switch (component.type) {
    case 'PARAGRAPH':
    case 'BLOCK_QUOTE':
    case 'BOOK_INFO':
    case 'CROSSHEAD':
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

function sanitiseText(text: string): string {
  // Remove a ufinish if present at end
  if (text.endsWith('■')) {
    text.substring(0, text.length - 1);
  }

  // Fix currency
  text = text.replace(/(\$|£|€)?(\d+)(bn|mln|m|trn)/g, '$1$2 $3');

  const lastChar = text.at(-1);

  // Make sure last character is punctuation
  const punctuation = ['.', '?', '!'];

  if (lastChar && !punctuation.includes(lastChar)) {
    text += '.';
  }

  return text;
}
