import { Article } from './article';
import { convertDefaultArticle } from './article-conversion/article-converter';
import { inBriefConverter } from './article-conversion/in-brief-converter';
import { Script } from './script';

export interface ForGeneratingTTSAudio {
  generateTTSFile(articleUrl: string, filename: string): Promise<void>;
}

export interface ForFetchingArticles {
  fetchArticle(url: string): Promise<Article>;
}

export interface ForGeneratingAudio {
  generateAudio(data: Script): Promise<Buffer>;
}

export interface ForSavingFiles {
  writeFile(data: Buffer, filename: string): Promise<void>;
}

export class TTSGenerator implements ForGeneratingTTSAudio {
  constructor(
    private audioGenerationService: ForGeneratingAudio,
    private fileRepository: ForSavingFiles,
    private articleRepository: ForFetchingArticles,
  ) {}

  async generateTTSFile(articleUrl: string, filename: string) {
    const article = await this.articleRepository.fetchArticle(articleUrl);

    const data = TTSGenerator.getConverter(article)(article);

    const audioData = await this.audioGenerationService.generateAudio(data);

    await this.fileRepository.writeFile(audioData, filename);
  }

  static getConverter(article: Article): (article: Article) => Script {
    switch (article.section.name) {
      case 'In brief':
        return inBriefConverter;
      default:
        return convertDefaultArticle;
    }
  }
}
