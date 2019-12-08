const fs = require('fs');

const sourceFile = 'octicons.woff';
const sourcePath = `node_modules/octicons-webfont/build/${sourceFile}`;
const targetDir = 'resources';
const targetPath = `${targetDir}/${sourceFile}`;

function main() {
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
    }

    console.log(`Copy '${sourceFile}' to '${targetDir}'`);
    fs.copyFileSync(sourcePath, targetPath);
}

main();
