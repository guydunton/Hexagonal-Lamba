import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ForSavingFiles } from '../tts-generator';

interface ForSavingFilesS3Props {
  region: string;
  bucket: string;
}

export class ForSavingFilesS3 implements ForSavingFiles {
  private s3Client: S3Client;

  private bucket: string;

  constructor(props: ForSavingFilesS3Props) {
    this.s3Client = new S3Client({
      region: props.region,
    });
    this.bucket = props.bucket;
  }

  async writeFile(data: Buffer, filename: string): Promise<void> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: filename,
        Body: data,
      }),
    );
  }
}
