module.exports.readVersion = (contents) => {
  const json = JSON.parse(contents);
  console.log(json.version);
  return json.version;
};

module.exports.writeVersion = (contents, version) => {
  const json = JSON.parse(contents);
  json.version = version;

  /**
   * Update dependencies
   */
  if (json.dependencies) {
    Object.keys(json.dependencies).forEach((key) => {
      if (json.dependencies && key.startsWith('@amnis')) {
        console.log(`^-- bumping dependency ${key} version from ${json.dependencies[key]} to ${version}`);
        json.dependencies[key] = version;
      }
    });
  }

  /**
   * Update peer dependencies
   */
  if (json.peerDependencies) {
    Object.keys(json.peerDependencies).forEach((key) => {
      if (json.peerDependencies && key.startsWith('@amnis')) {
        console.log(`^-- bumping peer dependency ${key} version from ${json.peerDependencies[key]} to ${version}`);
        json.peerDependencies[key] = version;
      }
    });
  }

  return JSON.stringify(json, null, 2);
};
