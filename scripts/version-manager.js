const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const packages = [
    { name: 'sankhyabook', type: 'react', path: './sankhyabook/package.json' },
    { name: 'sankhyabook', type: 'spfx', path: './sankhyabook/config/package-solution.json' },
    { name: 'apiclient', type: 'react', path: './apiclient/package.json' },
    { name: 'airavat', type: 'react', path: './airavat/package.json' }
];

const rootPkgJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const newVersion = rootPkgJson.version;
packages.forEach(pkg => {
    if (pkg.type === 'spfx') {
        const pkgJson = JSON.parse(fs.readFileSync(pkg.path, 'utf8'));
        pkgJson.solution.version = `${newVersion}.0`;
        pkgJson.solution.features[0].version = `${newVersion}.0`;
        fs.writeFileSync(pkg.path, JSON.stringify(pkgJson, null, 2));
        console.log(`✓ Updated ${pkg.name} to v${newVersion}.0`);
    }
    else {

        const pkgJson = JSON.parse(fs.readFileSync(pkg.path, 'utf8'));
        pkgJson.version = newVersion;
        fs.writeFileSync(pkg.path, JSON.stringify(pkgJson, null, 2));
        console.log(`✓ Updated ${pkg.name} to v${newVersion}`);
    }
});
