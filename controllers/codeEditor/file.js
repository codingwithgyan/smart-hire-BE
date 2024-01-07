const path = require("path");
const fs = require("fs");
const generateFolder = (baseFolder,lang) => {
    const dirPath = path.join(__dirname,"..",baseFolder,lang)
    if(!fs?.existsSync(dirPath))
    {
        fs?.mkdirSync(dirPath,{recursive: true})
    }
    return dirPath;
}
module.exports = {generateFolder};