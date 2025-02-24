import { Script } from '../script';
import { ForGeneratingAudio } from '../tts-generator';

export class ForGeneratingAudioNull implements ForGeneratingAudio {
  async generateAudio(data: Script): Promise<Buffer> {
    const text = JSON.stringify(data, null, 2);
    return Buffer.from(text);
  }
}
