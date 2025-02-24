import { test, expect, vi } from 'vitest';
import { Article } from './article';
import {
  ForFetchingArticles,
  ForGeneratingAudio,
  ForSavingFiles,
  TTSGenerator,
} from './tts-generator';
import { Script } from './script';

function article(): Article {
  return {
    headline: 'Article headline',
    rubric: 'A short headline description',
    flyTitle: 'Fly Title',
    dateFirstPublished: new Date(),
    section: {
      name: 'Economist Reads',
    },
    body: [
      {
        type: 'PARAGRAPH',
        text: 'Paragraph 1.',
      },
      {
        type: 'DIVIDER',
      },
      {
        type: 'IMAGE',
      },
      {
        type: 'PARAGRAPH',
        text: 'This is a second paragraph.',
      },
    ],
  };
}

test('converts the article into an audio script', async () => {
  const articleData = article();
  const cp2Mock: ForFetchingArticles = {
    fetchArticle: vi.fn(async (_url: string) => articleData),
  };
  const generateMockFn = vi.fn(async () => Buffer.from(''));
  const generateMock: ForGeneratingAudio = {
    generateAudio: generateMockFn,
  };
  const saveMock: ForSavingFiles = {
    writeFile: vi.fn(async () => {}),
  };

  const ttsGenerator = new TTSGenerator(generateMock, saveMock, cp2Mock);
  await ttsGenerator.generateTTSFile('https://test.url', 'output.mp3');

  const expected: Script = [
    { type: 'TEXT', text: 'This story is AI narrated.' },
    { type: 'PAUSE', length: 1 },
    { type: 'TEXT', text: articleData.flyTitle + '.' },
    { type: 'PAUSE', length: 1 },
    { type: 'TEXT', text: articleData.headline + '.' },
    { type: 'PAUSE', length: 1 },
    { type: 'TEXT', text: articleData.rubric + '.' },
    { type: 'PAUSE', length: 1 },
    { type: 'TEXT', text: 'Paragraph 1.' },
    { type: 'TEXT', text: 'This is a second paragraph.' },
  ];

  expect(generateMockFn).toHaveBeenCalledWith(expected);
});
