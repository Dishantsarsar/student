const { spawnSync, execSync, spawn } = require('child_process');
const path = require('path');

function killPort(port) {
  try {
    const res = spawnSync('netstat', ['-ano'], { encoding: 'utf8', shell: true });
    for (const line of res.stdout.split('\n')) {
      if (line.includes(`:${port} `)) {
        const pid = line.trim().split(/\s+/).pop();
        if (pid && !isNaN(pid)) execSync(`taskkill /PID ${pid} /F 2>nul`, { stdio: 'ignore' });
      }
    }
  } catch {}
}

killPort(3000);
killPort(4000);

// Suppress deprecation warnings from react-scripts internals (like webpack-dev-server deprecations) on newer Node versions
process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ''} --no-deprecation`.trim();

const rootDir = path.resolve(__dirname, '..');

spawn('npx concurrently --kill-others "npm run react-start" "npm --prefix server start"', {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, BROWSER: 'none' }
}).on('exit', process.exit);
