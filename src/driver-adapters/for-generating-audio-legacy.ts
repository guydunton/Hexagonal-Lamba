import { Block, ForGeneratingAudio } from '../tts-generator';
import { ElevenLabsClient } from 'elevenlabs';

export enum Model {
  Turbo = 'eleven_turbo_v2_5',
  Multilingual = 'eleven_multilingual_v2',
}

export class ForGeneratingAudioLegacy implements ForGeneratingAudio {
  private client: ElevenLabsClient;

  constructor(apiKey: string, private model: Model) {
    this.client = new ElevenLabsClient({
      apiKey,
    });
  }

  async generateAudio(data: Block[]): Promise<Buffer> {
    const article = this.convertToApiRequest(data);
    const chunks = [];
    const allText = article.join(' ');

    const stream = await this.client.generate({
      voice: 'Lily',
      text: allText,
      model_id: this.model,
      pronunciation_dictionary_locators: [
        {
          pronunciation_dictionary_id: 'Bld0e6OQDX4IX7TWCmjA',
          version_id: 'eUDBGHWfROhaB9PaTTYw',
        },
      ],
    });

    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  convertToApiRequest(data: Block[]): string[] {
    const output: string[] = [];
    for (const block of data) {
      if (block.type === 'TEXT') {
        output.push(block.text);
      } else {
        output[output.length - 1] = `${output.at(-1)}<break time="${block.length}"/>`;
      }
    }
    return output;
  }
}
