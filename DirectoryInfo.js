const fs = require("fs/promises");
const path = require("path");

class DirectoryInfo {
  constructor(folderPath) {
    this.folderPath = folderPath;
  }

  async validateDirectory() {
    try {
      const stats = await fs.stat(this.folderPath);
      if (!stats.isDirectory()) {
        throw new Error(
          `Provided path "${this.folderPath}" is not a directory`
        );
      }
    } catch (err) {
      throw new Error(`Invalid path - ${this.folderPath} - ${err.message}`);
    }
  }

  async getFiles() {
    await this.validateDirectory();

    const items = await fs.readdir(this.folderPath, { withFileTypes: true });
    return items.filter((item) => item.isFile()).map((file) => file.name);
  }

  async getDirectories() {
    await this.validateDirectory();

    const items = await fs.readdir(this.folderPath, { withFileTypes: true });
    return items.filter((item) => item.isDirectory()).map((dir) => dir.name);
  }

  async printTree(indent = 0, prefix = "", showMainFolder = true) {
    await this.validateDirectory();

    if (showMainFolder) {
      console.log(path.basename(this.folderPath));
    }

    const items = await fs.readdir(this.folderPath, { withFileTypes: true });

    const sortedDocuments = items.sort((a, b) => {
      if (!a.isDirectory() && b.isDirectory()) {
        return -1;
      }

      if (a.isDirectory() && !b.isDirectory()) {
        return 1;
      }

      return a.name.localeCompare(b.name);
    });

    const lastIndex = sortedDocuments.length - 1;

    for (let i = 0; i < sortedDocuments.length; i++) {
      const entry = sortedDocuments[i];
      const isLast = i === lastIndex;
      const lineConector = isLast ? "└── " : "├── ";
      const nextPrefix = prefix + (isLast ? "    " : "│   ");

      console.log(prefix + lineConector + entry.name);

      if (entry.isDirectory()) {
        const subDirPath = path.join(this.folderPath, entry.name);
        const subDir = new DirectoryInfo(subDirPath);
        await subDir.printTree(indent + 1, nextPrefix, false);
      }
    }
  }

  async organize() {
    await this.validateDirectory();

    const items = await fs.readdir(this.folderPath, { withFileTypes: true });
    const folders = new Set();

    for (const item of items) {
      if (!item.isFile()) continue;

      const extension = path.extname(item.name);
      const extensionName = extension.slice(1);
      const fileName = item.name;

      const oldPath = path.join(this.folderPath, fileName);
      const newDir = path.join(this.folderPath, extensionName);
      const newPath = path.join(newDir, fileName);

      if (!folders.has(extensionName)) {
        await fs.mkdir(newDir);
        folders.add(extensionName);
      }

      await fs.rename(oldPath, newPath);
      console.log(`The ${fileName} moved to => ${extensionName}/ folder.`);
    }
  }
}

module.exports = { DirectoryInfo };
