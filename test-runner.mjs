import { spawnSync } from 'child_process';
import { globSync } from 'glob';

const files = globSync('**/*.test.{js,mjs}', { ignore: 'node_modules/**' });

if (files.length === 0) {
  console.log("No tests found.");
  process.exit(0);
}

const args = [
  '--experimental-loader',
  './loader.mjs',
  '--test',
  '--experimental-test-module-mocks',
  ...files
];

const result = spawnSync('node', args, { stdio: 'inherit' });

process.exit(result.status);
