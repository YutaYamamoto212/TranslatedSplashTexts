const fs = require('fs');
const uuid = require('uuid');

// Helper function to convert the original format to the desired format
function convertFormat(original) {
    const result = { splashes: [] };
    Object.keys(original).forEach(key => {
        result.splashes.push(original[key]);
    });
    return result;
}

// Helper function to update the version number and generate random UUIDs
function updateManifest(manifest) {
    manifest.header.version[2] += 1;
    if (manifest.header.version[2] === 10) {
        manifest.header.version[2] = 0;
        manifest.header.version[1] += 1;
    }
    if (manifest.header.version[1] === 10) {
        manifest.header.version[1] = 0;
        manifest.header.version[0] += 1;
    }
    manifest.header.name = manifest.header.name.replace(/v\d+\.\d+\.\d+/, `v${manifest.header.version.join('.')}`);
    manifest.header.uuid = uuid.v4();
    manifest.modules[0].uuid = uuid.v4();
    manifest.modules[0].version = manifest.header.version;
    return manifest;
}

// Read the splash_texts.json file located in zh-CN/splash_texts
const splashTextsCN = JSON.parse(fs.readFileSync('zh-CN/splash_texts/splash_texts.json', 'utf8'));
// Convert the content to the desired format
const convertedCN = convertFormat(splashTextsCN);
// Save the result to the output directory resources/splashes_zh-CN
fs.mkdirSync('resources/splashes_zh-CN', { recursive: true });
fs.writeFileSync('resources/splashes_zh-CN/splashes.json', JSON.stringify(convertedCN, null, 2), 'utf8');

// Read the manifest.json file located in the output directory resources/splashes_zh-CN
const manifestCN = JSON.parse(fs.readFileSync('resources/splashes_zh-CN/manifest.json', 'utf8'));
// Update the version number and generate two random UUIDs
const updatedManifestCN = updateManifest(manifestCN);
// Save the updated manifest to the output directory resources/splashes_zh-CN
fs.writeFileSync('resources/splashes_zh-CN/manifest.json', JSON.stringify(updatedManifestCN, null, 2), 'utf8');

// Repeat the above steps for the other locales (zh-TW, zh-HK, lzh)
const splashTextsTW = JSON.parse(fs.readFileSync('zh-TW/splash_texts/splash_texts.json', 'utf8'));
const convertedTW = convertFormat(splashTextsTW);
fs.mkdirSync('resources/splashes_zh-TW', { recursive: true });
fs.writeFileSync('resources/splashes_zh-TW/splashes.json', JSON.stringify(convertedTW, null, 2), 'utf8');

const manifestTW = JSON.parse(fs.readFileSync('resources/splashes_zh-TW/manifest.json', 'utf8'));
const updatedManifestTW = updateManifest(manifestTW);
fs.writeFileSync('resources/splashes_zh-TW/manifest.json', JSON.stringify(updatedManifestTW, null, 2), 'utf8');

const splashTextsHK = JSON.parse(fs.readFileSync('zh-HK/splash_texts/splash_texts.json', 'utf8'));
const convertedHK = convertFormat(splashTextsHK);
fs.mkdirSync('resources/splashes_zh-HK', { recursive: true });
fs.writeFileSync('resources/splashes_zh-HK/splashes.json', JSON.stringify(convertedHK, null, 2), 'utf8');

const manifestHK = JSON.parse(fs.readFileSync('resources/splashes_zh-HK/manifest.json', 'utf8'));
const updatedManifestHK = updateManifest(manifestHK);
fs.writeFileSync('resources/splashes_zh-HK/manifest.json', JSON.stringify(updatedManifestHK, null, 2), 'utf8');

const splashTextsLzh = JSON.parse(fs.readFileSync('lzh/splash_texts/splash_texts.json', 'utf8'));
const convertedLzh = convertFormat(splashTextsLzh);
fs.mkdirSync('resources/splashes_lzh', { recursive: true });
fs.writeFileSync('resources/splashes_lzh/splashes.json', JSON.stringify(convertedLzh, null, 2), 'utf8');

const manifestLzh = JSON.parse(fs.readFileSync('resources/splashes_lzh/manifest.json', 'utf8'));
const updatedManifestLzh = updateManifest(manifestLzh);
fs.writeFileSync('resources/splashes_lzh/manifest.json', JSON.stringify(updatedManifestLzh, null, 2), 'utf8');

// Zip packs
const archiver = require('archiver');

const version = updatedManifestCN.header.version.join('')
const output = fs.createWriteStream(`splashes_zh-CN_v${version}.mcpack`);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.pipe(output);
archive.directory('resources/splashes_zh-CN/', false);
archive.finalize();

const versionTW = updatedManifestTW.header.version.join('')
const outputTW = fs.createWriteStream(`splashes_zh-TW_v${versionTW}.mcpack`);
const archiveTW = archiver('zip', { zlib: { level: 9 } });

outputTW.on('close', function() {
    console.log(archiveTW.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

archiveTW.pipe(outputTW);
archiveTW.directory('resources/splashes_zh-TW/', false);
archiveTW.finalize();

const versionHK = updatedManifestHK.header.version.join('')
const outputHK = fs.createWriteStream(`splashes_zh-HK_v${versionHK}.mcpack`);
const archiveHK = archiver('zip', { zlib: { level: 9 } });

outputHK.on('close', function() {
    console.log(archiveHK.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

archiveHK.pipe(outputHK);
archiveHK.directory('resources/splashes_zh-HK/', false);
archiveHK.finalize();

const versionLzh = updatedManifestLzh.header.version.join('')
const outputLzh = fs.createWriteStream(`splashes_lzh_v${versionLzh}.mcpack`);
const archiveLzh = archiver('zip', { zlib: { level: 9 } });

outputLzh.on('close', function() {
    console.log(archiveLzh.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

archiveLzh.pipe(outputLzh);
archiveLzh.directory('resources/splashes_lzh/', false);
archiveLzh.finalize();