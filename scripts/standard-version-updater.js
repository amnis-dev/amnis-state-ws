module.exports.readVersion = function (contents) {
  const json = JSON.parse(contents);
  console.log(json.version);
  return json.verion;
};

module.exports.writeVersion = function (contents, version) {
  const json = JSON.parse(contents);
  json.version = version;
  return JSON.stringify(json, null, 2);
};
