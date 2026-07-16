import { spawnSync, execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

spawn('cmd', ['/c', 'npm run react-start'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, BROWSER: 'none' }
}).on('exit', process.exit);
