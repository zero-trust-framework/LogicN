const fs = require('fs').promises;
const path = require('path');

// The directory to start searching in. Defaults to the current directory ('.')
const targetDir = process.argv[2] || '.';

// Regex: Uses word boundaries (\b) to match the exact word 'galerin'.
// This perfectly handles 'galerina-' or 'galerin!' while ignoring 'Galerina'.
// The 'g' flag finds all matches, and 'i' makes it case-insensitive.
const searchRegex = /\bgalerin\b/gi;

async function walkAndSearch(dir) {
    try {
        const items = await fs.readdir(dir, { withFileTypes: true });

        for (const item of items) {
            const fullPath = path.join(dir, item.name);

            if (item.isDirectory()) {
                // Skip 'node_modules' and hidden folders (like .git) to speed up the search
                if (item.name === 'node_modules' || item.name.startsWith('.')) {
                    continue;
                }
                // Recursively search child folders
                await walkAndSearch(fullPath);
            } else {
                // Check the file's contents
                await checkFile(fullPath);
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error.message);
    }
}

async function checkFile(filePath) {
    try {
        // Read the file as a string
        const content = await fs.readFile(filePath, 'utf8');
        
        // Reset the regex state before testing the whole file
        searchRegex.lastIndex = 0; 
        
        if (searchRegex.test(content)) {
            console.log(`\nMatch found in file: ${filePath}`);
            
            // Print the exact lines where the match occurs for context
            const lines = content.split('\n');
            lines.forEach((line, index) => {
                // Create a fresh regex to test individual lines
                const lineRegex = /\bgalerin\b/gi;
                if (lineRegex.test(line)) {
                    console.log(`  -> Line ${index + 1}: ${line.trim()}`);
                }
            });
        }
    } catch (error) {
        // Silently skip files that cannot be read as text (e.g., binaries or permission errors)
    }
}

console.log(`Searching for exact word "galerin" in: ${path.resolve(targetDir)}`);
console.log(`--------------------------------------------------------------------------------`);
walkAndSearch(targetDir);