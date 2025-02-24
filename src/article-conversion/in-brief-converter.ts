import { Article, ArticleComponent } from './article';
import { Script, ScriptBlock } from './script';

export function inBriefConverter(article: Article): Script {
  const aiDisclaimer = 'This story is AI narrated.';
  const sectionName = article.section.name;
  const headline = article.headline;
  const date = article.dateFirstPublished;
  const dateString = `${month(date.getMonth())} ${nthNumber(date.getDate())} ${date.getFullYear()}`;
  const lead = [aiDisclaimer, sectionName, headline, dateString]
    .map((text) => ({ type: 'TEXT', text }))
    .reduce((state, val) => {
      state.push(val as ScriptBlock);
      state.push({ type: 'PAUSE', length: 2 });
      return state;
    }, [] as ScriptBlock[]);

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

function convertBody(article: Article): ScriptBlock[] {
  // Drop the first component
  article.body.shift();

  // Find the quiz & remove up to the next divider
  removeQuizEnd(article);

  // Remove the "how to take part in quiz paragraph"
  article.body = article.body.filter((component) => {
    if (component.type === 'PARAGRAPH') {
      return !(component as any).text.startsWith('How to take part in the quiz');
    }
    {
      return true;
    }
  });

  return article.body
    .map(processComponent)
    .filter((block) => block !== undefined)
    .flat();
}

function processComponent(component: ArticleComponent): ScriptBlock[] | undefined {
  switch (component.type) {
    case 'PARAGRAPH':
    case 'BLOCK_QUOTE':
    case 'BOOK_INFO':
    case 'CROSSHEAD':
    case 'PULL_QUOTE':
      return [{ type: 'TEXT', text: (component as any).text }];
    case 'ORDERED_LIST':
    case 'UNORDERED_LIST':
      return (component as any).items.map((text: { text: string }) => ({
        type: 'TEXT',
        text: text.text,
      }));
    case 'INFOBOX':
      return (component as any).components
        .map(processComponent)
        .filter((block: ScriptBlock) => block !== undefined)
        .flat();
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

const nthNumber = (n: number) => {
  if (n > 3 && n < 21) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
};

const month = (n: number) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[n];
};

function removeQuizEnd(article: Article) {
  let index = undefined;
  for (let i = 0; i < article.body.length; i++) {
    const component = article.body[i];
    if (component.type === 'PARAGRAPH') {
      if (
        (component as any).text === 'See how to take part in the quiz at the bottom of this page.'
      ) {
        index = i;
        break;
      }
    }
  }

  if (index) {
    article.body.splice(index, 2);
  }
}
