const fs = require('fs').promises;
const path = require('path');

async function renameItems(targetDir) {
    try {
        // Read all items in the directory
        const items = await fs.readdir(targetDir, { withFileTypes: true });

        for (const item of items) {
            const fullPath = path.join(targetDir, item.name);

            if (item.isDirectory()) {
                // Skip node_modules and hidden folders
                if (item.name === 'node_modules' || item.name.startsWith('.')) {
                    continue;
                }
                
                // 1. RECURSE FIRST: Process all files inside this folder BEFORE we rename it
                await renameItems(fullPath);
                
                // 2. RENAME FOLDER: Now that children are processed, check if the folder needs renaming
                if (item.name.includes('logicn')) {
                    const newName = item.name.replace(/logicn/g, 'galerina');
                    const newPath = path.join(targetDir, newName);
                    
                    await fs.rename(fullPath, newPath);
                    console.log(`📁 Renamed folder: ${item.name} -> ${newName}`);
                }
                
            } else if (item.isFile() && item.name.includes('logicn')) {
                
                // RENAME FILE
                const newName = item.name.replace(/logicn/g, 'galerina');
                const newPath = path.join(targetDir, newName);
                
                await fs.rename(fullPath, newPath);
                console.log(`📄 Renamed file:   ${item.name} -> ${newName}`);
            }
        }
    } catch (error) {
        console.error(`❌ Error processing directory ${targetDir}:`, error);
    }
}

// Start execution from the directory where the script is located
const startingDirectory = __dirname;

console.log(`Starting scan in: ${startingDirectory}...\n`);

renameItems(startingDirectory)
    .then(() => console.log('\n🎉 Finished processing all files and folders!'))
    .catch(err => console.error('Script failed:', err));