const { spawn } = require('child_process');
const path = require('path');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function start(name, cwd) {
  const child = spawn(npmCommand, ['run', 'dev'], {
    cwd,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
  });

  child.stdout.on('data', (chunk) => process.stdout.write(`[${name}] ${chunk}`));
  child.stderr.on('data', (chunk) => process.stderr.write(`[${name}] ${chunk}`));

  child.on('exit', (code, signal) => {
    if (code && code !== 0) {
      console.error(`[${name}] exited with code ${code}${signal ? ` (${signal})` : ''}`);
      process.exitCode = code;
    }
  });

  return child;
}

const backend = start('backend', path.join(__dirname, '..', 'backend'));
const frontend = start('frontend', path.join(__dirname, '..', 'frontend'));

function shutdown(signal) {
  backend.kill(signal);
  frontend.kill(signal);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));