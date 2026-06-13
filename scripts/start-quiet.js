import { spawnSync, execSync } from 'child_process';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

function killPort(port) {
  try {
    const result = spawnSync('netstat', ['-ano'], { encoding: 'utf8', shell: true });
    for (const line of result.stdout.split('\n')) {
      if (line.includes(`:${port} `)) {
        const pid = line.trim().split(/\s+/).pop();
        if (pid && !isNaN(pid)) try { execSync(`taskkill /PID ${pid} /F 2>nul`, { stdio: 'ignore' }); } catch {}
      }
    }
  } catch {}
}

killPort(3000);
killPort(4000);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const serverDir = path.resolve(rootDir, 'server');

console.log('Starting student app...\n');

const react = spawn('npm.cmd', ['run', 'react-start'], { cwd: rootDir, stdio: 'inherit', shell: true, env: { ...process.env, BROWSER: 'none' } });
const server = spawn('npm.cmd', ['start'], { cwd: serverDir, stdio: 'inherit', shell: true });

react.on('close', (code) => { if (code) console.log(`React exited with code ${code}`); });
server.on('close', (code) => { if (code) console.log(`Server exited with code ${code}`); });

process.on('SIGINT', () => { react.kill(); server.kill(); process.exit(); });
process.on('SIGTERM', () => { react.kill(); server.kill(); process.exit(); });
