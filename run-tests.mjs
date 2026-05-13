import { spawnSync } from 'child_process';
import { buildSync } from 'esbuild';
import { globSync } from 'glob';
import fs from 'fs';

fs.mkdirSync('dist', { recursive: true });

// Find all test files, excluding node_modules and dist
const testFiles = globSync('**/*.test.{js,jsx}', { ignore: ['node_modules/**', 'dist/**'] });

for (const file of testFiles) {
  const outFile = `dist/${file.replace(/\//g, '_').replace('.jsx', '.js')}`;
  buildSync({
    entryPoints: [file],
    bundle: true,
    outfile: outFile,
    format: 'cjs',
    platform: 'node',
    loader: { '.js': 'jsx', '.jsx': 'jsx' },
    external: ['jsdom', '@testing-library/react', 'react', 'react-dom']
  });

  console.log(`Running tests in ${file}...`);
  const res = spawnSync('node', ['--test', outFile], { stdio: 'inherit' });
  if (res.status !== 0) {
    process.exit(res.status);
  }
}
