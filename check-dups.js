const items = require('./src/items.json');

function main() {
    const { fileExtensions, fileNames } = items;

    const duplicates = [
        ...getDuplicates(fileExtensions),
        ...getDuplicates(fileNames),
    ];

    if (duplicates.length > 0) {
        for (const [ext, type] of duplicates) {
            console.log(`Duplicate "${ext}" in "${type}" section`);
        }
    } else {
        console.log('No duplicates are found');
    }
}

function getDuplicates(props) {
    const checkedItems = [];
    const duplicates = [];

    for (const type in props) {
        const extensions = props[type];

        for (const ext of extensions) {
            if (checkedItems.includes(ext)) {
                duplicates.push([ext, type]);
            } else {
                checkedItems.push(ext);
            }
        }
    }

    return duplicates;
}

main();
