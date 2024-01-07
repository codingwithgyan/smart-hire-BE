const { exec } = require('node:child_process');
const runPythonFile = (filePath, lang) => {
    return new Promise((resolve,reject)=>{
        exec(`python3 ${filePath}`,
            (error,stdout,stderr)=>{
            if(error)
               reject({stderr});
            else if(stderr)
                reject(stderr);
            else
                resolve(stdout);
        })
    });
}

module.exports = runPythonFile;