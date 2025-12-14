const fs = require('fs').promises;
const path = require('path');

class JsonManager {
    constructor(fileName) {
        this.filePath = path.join(__dirname, '../data', `${fileName}.json`);
        this.ensureDataDirectory();
        this.ensureFileExists();
    }

    async ensureDataDirectory() {
        const dataDir = path.join(__dirname, '../data');
        try {
            await fs.access(dataDir);
        } catch {
            await fs.mkdir(dataDir, { recursive: true });
        }
    }

    async ensureFileExists() {
        try {
            await fs.access(this.filePath);
        } catch {
            await fs.writeFile(this.filePath, JSON.stringify({}, null, 4));
        }
    }

    async read() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data || '{}');
        } catch (error) {
            console.error(`Hiba a fájl olvasásakor (${this.filePath}):`, error);
            return {};
        }
    }

    async write(data) {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(data, null, 4));
        } catch (error) {
            console.error(`Hiba a fájl írásakor (${this.filePath}):`, error);
        }
    }

    async get(key, defaultValue = null) {
        const data = await this.read();
        if (key === undefined) return data;
        return data[key] !== undefined ? data[key] : defaultValue;
    }

    async set(key, value) {
        const data = await this.read();
        data[key] = value;
        await this.write(data);
        return value;
    }

    async delete(key) {
        const data = await this.read();
        delete data[key];
        await this.write(data);
    }

    async has(key) {
        const data = await this.read();
        return data[key] !== undefined;
    }

    async increment(key, amount = 1) {
        const current = await this.get(key, 0);
        return await this.set(key, current + amount);
    }

    async push(key, value) {
        const data = await this.read();
        if (!Array.isArray(data[key])) data[key] = [];
        data[key].push(value);
        await this.write(data);
        return data[key];
    }

    async filter(key, callback) {
        const data = await this.read();
        if (Array.isArray(data[key])) {
            return data[key].filter(callback);
        }
        return [];
    }
}

module.exports = JsonManager;