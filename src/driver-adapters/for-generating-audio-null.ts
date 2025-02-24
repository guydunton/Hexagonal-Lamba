import { ScriptBlock } from '../script';
import { ForGeneratingAudio } from '../tts-generator';

export class ForGeneratingAudioNull implements ForGeneratingAudio {
  async generateAudio(data: ScriptBlock[]): Promise<Buffer> {
    const text = JSON.stringify(data, null, 2);
    return Buffer.from(text);
  }
}
