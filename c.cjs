const fs = require('fs');
const path = require('path');

// Argument 1: Target directory (defaults to current directory '.')
const TARGET_DIRECTORY = process.argv[2] || '.';

// Argument 2: Custom search term
const SEARCH_INPUT = process.argv[3];

// Build our search rules based on what you typed in the console
let SEARCH_REGEX;
if (SEARCH_INPUT) {
    // Escapes special characters so things like symbols don't break the search
    const escapedInput = SEARCH_INPUT.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Check if the user is searching for a single letter or exact word like "a"
    // We add word boundaries (\b) so it only finds "a" on its own, not inside "cat"
    if (escapedInput.length <= 2) {
        SEARCH_REGEX = new RegExp(`\\b${escapedInput}\\b`, 'i');
    } else {
        SEARCH_REGEX = new RegExp(escapedInput, 'i');
    }
} else {
    // Default fallback to your original requirements if you don't provide a search term
    SEARCH_REGEX = /@?(lln|spore)/i;
}

const SKIP_EXTENSIONS = [
    '.png', '.jpg', '.jpeg', '.gif', '.ico', 
    '.mp4', '.mp3', '.zip', '.tar', '.gz', 
    '.pdf', '.exe', '.dll', '.woff', '.woff2'
];

const SKIP_FILES = [
    'rename.js', 
    'search-text.js'
];

function scanFilesForText(dirPath) {
    let entries;
    try {
        entries = fs.readdirSync(dirPath, { withFileTypes: true });
    } catch (err) {
        console.error(`[ERROR] Cannot read directory ${dirPath}:`, err.message);
        return;
    }

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            if (entry.name === 'node_modules' || entry.name === '.git') continue;
            scanFilesForText(fullPath);
        } else if (entry.isFile()) {
            if (SKIP_FILES.includes(entry.name)) continue;

            const ext = path.extname(entry.name).toLowerCase();
            if (SKIP_EXTENSIONS.includes(ext)) continue;

            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                
                if (SEARCH_REGEX.test(content)) {
                    console.log(`\n\x1b[32m[FOUND]\x1b[0m Match in file: ${fullPath}`);
                    
                    const lines = content.split('\n');
                    lines.forEach((line, index) => {
                        if (SEARCH_REGEX.test(line)) {
                            const preview = line.trim().substring(0, 120); 
                            console.log(`   \x1b[36m-> Line ${index + 1}:\x1b[0m ${preview}`);
                        }
                    });
                }
            } catch (err) {
                // Fail silently for unreadable files
            }
        }
    }
}

// Display what we are actually searching for
const displaySearch = SEARCH_INPUT ? `"${SEARCH_INPUT}" (Whole word)` : `"lln" or "spore" (Default)`;
console.log(`Starting text search for ${displaySearch} in directory: ${path.resolve(TARGET_DIRECTORY)}...\n`);

scanFilesForText(TARGET_DIRECTORY);
console.log(`\nScan complete.`);