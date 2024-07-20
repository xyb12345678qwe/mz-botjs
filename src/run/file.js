import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

class file {
    constructor() {
        this.filePath = {
            master: path.join(process.cwd(), 'config', 'master', 'master.yaml'),
            config: path.join(process.cwd(), 'config', 'config.yaml'),
            server: path.join(process.cwd(), 'config', 'server', 'server.yaml'),
            appsettings: path.join(process.cwd(), 'config', 'Lagrange', 'appsettings.json')
        }
        this.defaultconfig = {
            master: {
                masters: []
            },
            config: {},
            server: {}
        }
        const filePaths = Object.keys(this.filePath);
        for (const key of filePaths) {
            if (!fs.existsSync(this.filePath[key])) {
                this.createFilePath(key);
                if (key == 'appsettings') continue;
                this.writeFile(key, this.defaultconfig[key] || {});
            }
        }
    }

    createFilePath(key) {
        const dirPath = path.dirname(this.filePath[key]);
        fs.mkdirSync(dirPath, { recursive: true });
    }

    readFile(key) {
        const filePath = this.filePath[key];
        const yamlContent = fs.readFileSync(filePath, 'utf8');
        return yaml.load(yamlContent);
    }

    writeFile(key, data) {
        const filePath = this.filePath[key];
        const yamlContent = yaml.dump(data);
        fs.writeFileSync(filePath, yamlContent);
    }
    writeFileJson(key, data) {
        fs.writeFileSync(this.filePath[key], JSON.stringify(data, null, 2))
    }
}

export const File = new file();
