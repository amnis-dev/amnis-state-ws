/**
 * Sets the version for the amnis design packages.
 */
import yargs from 'yargs';
import glob from 'glob';
import fse from 'fs-extra';
import { execSync } from 'child_process';
import type { PackageJson } from 'type-fest/source/package-json';

async function init() {
  const { argv } = yargs(process.argv.slice(2))
    .version(false)
    .options({
      version: {
        type: 'string',
        alias: 'v',
        demandOption: 'Please specify a semantic version',
      },
    });

  const { version } = await argv;

  console.log(version);

  const packageJsonPaths = glob.sync('./**/package.json', {
    nodir: true,
    ignore: './**/node_modules/**',
  });

  packageJsonPaths.forEach((path) => {
    const packageJson: PackageJson = fse.readJSONSync(path);
    if (packageJson?.name?.startsWith('@amnis')) {
      packageJson.version = version;
    }

    if (packageJson.dependencies) {
      Object.keys(packageJson.dependencies).forEach((key) => {
        if (packageJson.dependencies && key.startsWith('@amnis')) {
          packageJson.dependencies[key] = version;
        }
      });
    }

    if (packageJson.peerDependencies) {
      Object.keys(packageJson.peerDependencies).forEach((key) => {
        if (packageJson.peerDependencies && key.startsWith('@amnis')) {
          packageJson.peerDependencies[key] = version;
        }
      });
    }

    fse.writeJSONSync(path, packageJson, { spaces: 2 });
  });

  execSync(`git add ${packageJsonPaths.join(' ')}`);
  execSync(`git commit -m "feat: Bumped version to ${version}"`);
  execSync('git push');
  execSync(`git tag v${version}`);
  execSync(`git push origin v${version}`);
}

init();
