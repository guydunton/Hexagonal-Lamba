import { writeFile } from 'fs/promises';
import { ForSavingFiles } from '../tts-generator';

export class ForSavingFilesDisk implements ForSavingFiles {
  constructor() {}

  async writeFile(data: Buffer, filename: string): Promise<void> {
    await writeFile(filename, data);
  }
}
