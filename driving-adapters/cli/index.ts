import 'dotenv/config';
import {
  ForGeneratingAudioElevenLabs,
  Model,
} from '../../src/driver-adapters/for-generating-audio-elevenlabs';
import { ForSavingFilesDisk } from '../../src/driver-adapters/for-saving-files-disk';
import { ForFetchingArticlesCp2 } from '../../src/driver-adapters/for-fetching-articles-cp2';
import { TTSGenerator } from '../../src/tts-generator';
import { program, Option } from 'commander';
import { z } from 'zod';

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
  const audioConverter = new ForGeneratingAudioElevenLabs(
    apiKey,
    params.model === 'multilingual' ? Model.Multilingual : Model.Turbo,
  );
  const fileSaver = new ForSavingFilesDisk();

  const application = new TTSGenerator(audioConverter, fileSaver, repo);
  await application.generateTTSFile(params.url, params.output);
}

main();
