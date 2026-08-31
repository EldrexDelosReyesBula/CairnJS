#!/usr/bin/env node

/**
 * @eldrex/cairnjs - Instant Project Scaffolding CLI
 * npx create-cairn-app <project-name> [--template <template>]
 */

import fs from 'fs';
import path from 'path';
import { create, templates } from '../src/scaffolding.js';

const args = process.argv.slice(2);
let projectName = 'my-cairn-app';
let templateName = 'basic';

for (let i = 0; i < args.length; i++) {
    if (args[i] === '--template' || args[i] === '-t') {
        templateName = args[i + 1] || 'basic';
        i++;
    } else if (!args[i].startsWith('-')) {
        projectName = args[i];
    }
}

console.log(`\n\x1b[36m\x1b[1m🪨 CairnJS — Instant Project Scaffolding\x1b[0m`);
console.log(`\x1b[32m✔\x1b[0m Creating CairnJS project: \x1b[1m${projectName}\x1b[0m (Template: ${templateName})`);

const result = create(projectName, { template: templateName });
const targetDir = path.resolve(process.cwd(), projectName);

for (const [relPath, content] of Object.entries(result.fileMap)) {
    const fullPath = path.join(targetDir, relPath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf-8');
}

console.log(`\x1b[32m✔\x1b[0m Generating optimized project structure`);
console.log(`\x1b[32m✔\x1b[0m Creating template files (${result.files.length} files generated)`);
console.log(`\x1b[32m✔\x1b[0m Setting up configuration and dependencies\n`);

console.log(`\x1b[35m🎉 Project ready! Next steps:\x1b[0m`);
console.log(`   \x1b[33mcd ${projectName}\x1b[0m`);
console.log(`   \x1b[33mcairn dev\x1b[0m\n`);
console.log(`   Your app will be running at \x1b[36mhttp://localhost:3000\x1b[0m\n`);
