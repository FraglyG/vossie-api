import fs from 'fs';
import path from 'path';

// Imports all the subscripts in a given directory.
async function importSubsripts(absolutePath: string, initScriptName: string | undefined) {
    const files = fs.readdirSync(absolutePath);
    let returns: any[] = [];

    for (const file of files) {
        if (!file.endsWith('.ts') && !file.endsWith('.js')) continue; // Only import TypeScript files

        const filePath = path.join(absolutePath, file);
        const fileName = file.replace('.ts', '').replace('.js', '')

        try {
            const module = await import('' + filePath);

            // Push default export to returns
            if (!initScriptName) {
                returns.push(module.default);
                continue;
            }

            const initScript = module[initScriptName];
            if (!initScript) continue; // Only run the initScript if it exists

            const returned = await initScript();
            returns.push(returned);
        } catch (error) {
            console.error(error, `Error initiating ${fileName}`);
        }
    }

    return returns;
}

// Imports all the subscripts of the subfolders in a given directory.
async function importSubFolderSubsripts(absolutePathMainFolder: string, initScriptName: string | undefined) {
    const folders = fs.readdirSync(absolutePathMainFolder);
    let returns = [];

    for (const folderName of folders) {
        const folderPath = path.join(absolutePathMainFolder, folderName);
        const folderReturns = await importSubsripts(folderPath, initScriptName);
        returns.push(...folderReturns);
    }

    return returns;
}

// Import all subscripts in a folder, recursively.
async function importAllFilesInFolder(folderPath: string) {
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stats = await fs.promises.stat(filePath);

        if (stats.isDirectory()) {
            await importAllFilesInFolder(filePath); // Recursive call for subdirectories
        } else if (file.endsWith('.js') || file.endsWith('.ts')) {
            const module = await import(filePath);
        }
    }
}

export { importSubsripts, importSubFolderSubsripts, importAllFilesInFolder };
