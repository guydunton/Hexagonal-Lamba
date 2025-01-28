import axios from 'axios';
import { Block, ForGeneratingAudio } from '../tts-generator';

export enum Model {
  Turbo = 'eleven_turbo_v2_5',
  Multilingual = 'eleven_multilingual_v2',
}

enum Voice {
  Daniel = 'onwK4e9ZLuTAKqWW03F9',
  Lily = 'pFZP5JQG7iQjIQuC4Bku',
}

export class ForGeneratingAudioElevenLabs implements ForGeneratingAudio {
  constructor(private apiKey: string, private model: Model) {}

  async generateAudio(data: Block[]): Promise<Buffer> {
    const article = this.convertToApiRequest(data);
    const chunks = [];

    for (let i = 0; i < article.length; i++) {
      const paragraph = article[i];
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${Voice.Lily}/stream`,
        {
          text: paragraph,
          model_id: this.model,
          // previous_request_ids: previousRequestIds.slice(-3),
          previous_text: i == 0 ? undefined : article.at(i - 1),
          next_text: article.at(i + 1),
          pronunciation_dictionary_locators: [
            {
              pronunciation_dictionary_id: 'Bld0e6OQDX4IX7TWCmjA',
              version_id: 'eUDBGHWfROhaB9PaTTYw',
            },
          ],
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
          },
          responseType: 'stream',
        },
      );

      for await (const chunk of response.data) {
        chunks.push(chunk);
      }
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
