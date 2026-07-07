const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');
const backendDir = path.join(__dirname, 'backend');
const destPublicDir = path.join(backendDir, 'public');

console.log('📦 Starting unified production build...');

// 1. Install frontend dependencies and build
console.log('⚙️ Building frontend static assets...');
execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });
execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });

// 2. Clear target public folder
if (fs.existsSync(destPublicDir)) {
  console.log('🧹 Cleaning old static build in backend/public...');
  fs.rmSync(destPublicDir, { recursive: true, force: true });
}

// 3. Create target public folder
fs.mkdirSync(destPublicDir, { recursive: true });

// 4. Copy frontend/dist to backend/public
const srcDist = path.join(frontendDir, 'dist');
console.log(`🚚 Copying assets from ${srcDist} to ${destPublicDir}...`);

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDirRecursive(srcDist, destPublicDir);
console.log('✨ Unified build complete! Ready for single-container deployment.');
