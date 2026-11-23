const fs = require('fs');
const path = require('path');

const targets = ['dist', 'build', 'public'];

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'dist', 'build', 'public', '.vercel'].includes(entry.name)) continue;
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

for (const target of targets) {
  const targetDir = path.join(__dirname, target);
  copyDir(__dirname, targetDir);
  console.log(`Synced files to ${target}/`);
}

console.log('Build completed successfully!');
