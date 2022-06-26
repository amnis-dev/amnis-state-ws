/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/**
 * Builds the amnis design packages.
 */
import { execSync } from 'child_process';
import fse from 'fs-extra';

// Order of build.
const packagePaths = [
  'packages/amnis-core',
  'packages/amnis-auth',
  'packages/amnis-db',
  'packages/amnis-api',
  'packages/amnis-state',
];

function tsCompile() {
  packagePaths.forEach((path) => {
    const command = `yarn tsc --project ${path}/tsconfig.build.json`;
    console.log(`Running '${command}...'`);
    try {
      execSync(command);
    } catch (error: any) {
      console.log('==================================================');
      console.error('output', error.output.toString());
      console.log('----------------------------------------');
      console.error('stdout', error.stdout.toString());
      console.log('----------------------------------------');
      console.error('sdterr', error.stderr.toString());
      console.log('==================================================');
      process.exit(1);
    }
    console.log('Command complete.');
    console.log('');

    console.log(`Copying '${path}/package.json' into the build directory...`);
    fse.copySync(`${path}/package.json`, `${path}/.dist/package.json`);
    console.log('Copy complete.');
    console.log('');
  });
}

tsCompile();
