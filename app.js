const { DirectoryInfo } = require("./DirectoryInfo");

// 1)

// (async () => {
//   const dir = new DirectoryInfo("./test");

//   try {
//     const files = await dir.getFiles();
//     console.log("Files:", files);

//     const dirs = await dir.getDirectories();
//     console.log("Directories:", dirs);
//   } catch (err) {
//     console.error(err.message);
//   }
// })();

// 2)

// const folder = new DirectoryInfo('./test');

// (async () => {
//   await folder.printTree();
// })();

// 3)

const folder = new DirectoryInfo('./test-organize');

(async () => {
  await folder.organize();
})();
