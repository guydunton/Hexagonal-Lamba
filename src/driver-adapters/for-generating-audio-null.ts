import { Block, ForGeneratingAudio } from '../tts-generator';

export class ForGeneratingAudioNull implements ForGeneratingAudio {
  async generateAudio(data: Block[]): Promise<Buffer> {
    const text = JSON.stringify(data, null, 2);
    return Buffer.from(text);
  }
}
