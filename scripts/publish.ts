/* eslint-disable no-console */
/**
 * Publishes the amnis design packages.
 */
import { execSync } from 'child_process';

// Order of build.
const packagePaths = [
  'packages/amnis-core',
  'packages/amnis-api',
  'packages/amnis-db',
  'packages/amnis-state',
];

function publish() {
  packagePaths.forEach((path) => {
    const command = 'yarn publish --access public';
    console.log(`Running '${command}' in '${path}'...`);
    execSync(command, {
      cwd: `${path}/.dist`,
      env: { ...process.env },
    });
    console.log('Publishing complete.');
    console.log('');
  });
}

publish();
