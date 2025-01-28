import { Article } from './article';
import { convertArticle } from './article-converter';

export interface ForGeneratingTTSAudio {
  generateTTSFile(articleUrl: string, filename: string): Promise<void>;
}

export type Block = { type: 'TEXT'; text: string } | { type: 'PAUSE'; length: number };

export interface ForGeneratingAudio {
  generateAudio(data: Block[]): Promise<Buffer>;
}

export interface ForSavingFiles {
  writeFile(data: Buffer, filename: string): Promise<void>;
}

export interface ForFetchingArticles {
  fetchArticle(url: string): Promise<Article>;
}

export class TTSGenerator implements ForGeneratingTTSAudio {
  constructor(
    private audioGenerationService: ForGeneratingAudio,
    private fileRepository: ForSavingFiles,
    private articleRepository: ForFetchingArticles,
  ) {}

  async generateTTSFile(articleUrl: string, filename: string) {
    const article = await this.articleRepository.fetchArticle(articleUrl);

    const data = convertArticle(article);

    const audioData = await this.audioGenerationService.generateAudio(data);

    await this.fileRepository.writeFile(audioData, filename);
  }
}
