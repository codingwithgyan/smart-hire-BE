const { exec } = require("node:child_process");
const runJavascriptFile = (filePath, lang) => {
  return new Promise((resolve, reject) => {
    exec(`node ${filePath}`, (error, stdout, stderr) => {
      if (error) reject({ stderr });
      else if (stderr) reject(stderr);
      else resolve(stdout);
    });
  });
};

module.exports = runJavascriptFile;
