const fs = require('fs');
const { execSync } = require('child_process');

const printError = (message, err) => {
  if (!`${err}`.includes('No such file or directory')) {
    console.error(`${err}`);
  }
}

// Read the pnpm-workspace.yaml file
const workspaceConfig = fs.readFileSync('pnpm-workspace.yaml', 'utf8');

// Regular expression to find package patterns
const packagePatternRegex = /-\s*'([^']+)'/g;

// Extract package patterns
let match;
const packagePatterns = [];
while ((match = packagePatternRegex.exec(workspaceConfig)) !== null) {
  packagePatterns.push(match[1]);
}


// Function to delete node_modules directory
const deleteNodeModules = (path) => {
  console.log(`Deleting node_modules in ${path}`);
  try {
    execSync(`rm -rf ${path}/node_modules`);
  } catch (error) {
    printError(`Error deleting node_modules in ${path}`, error)
  }
};

// Delete pnpm-lock.yaml

console.log(`Deleting pnpm-lock.yaml`);
try {
  execSync(`rm pnpm-lock.yaml`);
} catch (error) {
  printError(`Error pnpm-lock.yaml`, error)
}

console.log('');

// Delete root node_modules
deleteNodeModules('./');

// Iterate over each package and delete its node_modules
packagePatterns.forEach(packagePattern => {
  const directories = fs.readdirSync(packagePattern.replace('*', ''), { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => `${packagePattern.replace('*', '')}${dirent.name}`);

  directories.forEach(deleteNodeModules);
});

console.log('');

console.log(`Deleting dist folder`);
try {
  execSync(`rm -rf ./dist`);
} catch (error) {
  printError(`Error deleting dist`, error)
}

console.log('\nWorkspace has cleaned.\nNow you can run `pnpm i`\n');
