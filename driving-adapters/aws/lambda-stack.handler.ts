import { Handler } from 'aws-lambda';
import { ForFetchingArticlesCp2 } from '../../src/driver-adapters/for-fetching-articles-cp2';
import {
  ForGeneratingAudioElevenLabs,
  Model,
} from '../../src/driver-adapters/for-generating-audio-elevenlabs';
import { TTSGenerator } from '../../src/tts-generator';
import { ForSavingFilesS3 } from '../../src/driver-adapters/for-saving-files-s3';

function expectEnvVar(envVar: string): string {
  if (!process.env[envVar]) {
    throw new Error(`Missing env var ${envVar}`);
  }
  return process.env[envVar];
}

export const handler: Handler = async (event) => {
  console.log('Event', event);

  if (!event.url) {
    throw new Error('Missing param "url"');
  }
  if (!event.output) {
    throw new Error('Missing param "output"');
  }

  const apiKey = expectEnvVar('ELEVENLABS_API_KEY');
  const username = expectEnvVar('CP2_USERNAME');
  const password = expectEnvVar('CP2_PASSWORD');
  const bucket = expectEnvVar('BUCKET_NAME');

  const repo = new ForFetchingArticlesCp2(
    'https://cp2-api.p.aws.economist.com/graphql',
    username,
    password,
  );
  const audioConverter = new ForGeneratingAudioElevenLabs(apiKey, Model.Turbo);
  const s3Saver = new ForSavingFilesS3({
    region: 'eu-west-1',
    bucket,
  });

  const application = new TTSGenerator(audioConverter, s3Saver, repo);
  await application.generateTTSFile(event.url, event.output);

  return {
    statusCode: 200,
    message: 'Completed',
  };
};
