import 'dotenv/config';
import { ForSavingFilesDisk } from '../../src/driver-adapters/for-saving-files-disk';
import { ForFetchingArticlesCp2 } from '../../src/driver-adapters/for-fetching-articles-cp2';
import { ForGeneratingAudio, TTSGenerator } from '../../src/tts-generator';
import { program, Option } from 'commander';
import { z } from 'zod';
import {
  ForGeneratingAudioElevenLabs,
  Model,
} from '../../src/driver-adapters/for-generating-audio-elevenlabs';
import { ForGeneratingAudioNull } from '../../src/driver-adapters/for-generating-audio-null';

function expectEnvVar(envVar: string): string {
  if (!process.env[envVar]) {
    throw new Error(`Missing env var ${envVar}`);
  }
  return process.env[envVar];
}

const options = z.object({
  url: z.string(),
  output: z.string().default('audio.mp3'),
  model: z.enum(['turbo', 'multilingual']),
  format: z.enum(['audio', 'text']),
});

async function main() {
  const username = expectEnvVar('CP2_USERNAME');
  const password = expectEnvVar('CP2_PASSWORD');
  const apiKey = expectEnvVar('ELEVENLABS_API_KEY');

  const cli = program
    .name('ai-narration')
    .description('Generate AI audio from an article URL')
    .addOption(
      new Option('--model <model>', 'The Elevenlabs model to use')
        .choices(['turbo', 'multilingual'])
        .default('turbo'),
    )
    .addOption(
      new Option('-f, --format <format>', 'Use to generate a TTS script')
        .choices(['audio', 'text'])
        .default('audio'),
    )
    .option('-o, --output <file>', 'Output file. Defaults to audio.mp3')
    .argument('<URL>', 'Article URL');

  cli.parse();
  const opts = cli.opts();

  const params = options.parse({ ...opts, url: cli.args[0] });

  const repo = new ForFetchingArticlesCp2(
    'https://cp2-api.p.aws.economist.com/graphql',
    username,
    password,
  );

  const audioConverter = audioGenerator(apiKey, params.format, params.model);
  const fileSaver = new ForSavingFilesDisk();

  const application = new TTSGenerator(audioConverter, fileSaver, repo);
  await application.generateTTSFile(params.url, params.output);
}

function audioGenerator(apiKey: string, format: string, model: string): ForGeneratingAudio {
  switch (format) {
    case 'text':
      return new ForGeneratingAudioNull();
    default:
      return new ForGeneratingAudioElevenLabs(
        apiKey,
        model === 'multilingual' ? Model.Multilingual : Model.Turbo,
      );
  }
}

main();
