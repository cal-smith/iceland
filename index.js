const marked = require("marked");
const path = require("path");
const fs = require("fs");
const minimist = require("minimist");

const argv = minimist(process.argv.slice(2));
console.log(argv);

const base = path.resolve(__dirname, argv._[0]);
const out = path.resolve(__dirname, argv.o);
const templates = path.resolve(base, "./templates");
const posts = path.resolve(base, "./posts");
try {
	const config = require(path.resolve(base, "config.json"));
} catch (e) {
	console.log("🙃  failed to load config, using defaults");
} finally {
	const config = {};
}

async function renderIndex() {
	let indexTemplate = require(path.resolve(templates, "home.js"));
	// let indexMD = await readFile(path.resolve(base, "home.md"));
	/*
		render listing of all the posts under posts
	*/
	let files = await readDir(posts);
	files = files.map(file => {
		let title = file.replace(/^\d-/, "").replace(/\.md$/, "").replace(/-/g, " ");
		title = title[0].toUpperCase() + title.slice(1);
		return {
			link: file.replace(/\.md$/, ".html"),
			title
		}
	});
	writeFile(`${out}/index.html`, indexTemplate({postlist: files}));
}

async function renderPosts() {
	let postTemplate = require(path.resolve(templates, "post.js"));
	let files = await readDirFiles(posts);
	for (let file of files) {
		let post = marked(await file.data);
		let name = file.name.replace(/\.md$/, ".html")
		console.log("💭  rendering", file.name, "➡️ ", name);
		let test = await writeFile(`${out}/${name}`, postTemplate({title: name.replace(/^\d-/, "").replace(/\.html$/, ""), post: post}));
	}
}

renderIndex();
renderPosts();
// console.log("✨ done");

// async/await wrapped fs and helper functions
function readFile(file) {
	return new Promise((resolve, reject) => {
		fs.readFile(file, {encoding: "utf-8"}, (err, data) => {
			resolve(data);
			reject(err);
		});
	});
}

function readDir(dir) {
	return new Promise((resolve, reject) => {
		fs.readdir(dir, (err, files) => {
			resolve(files);
			reject(err);
		});
	});
}

function readDirFiles(dir) {
	return readDir(dir).then(files => {
		return files.map(file => {
			return {
				name: file,
				data: readFile(path.join(dir, file))
			};
		});
	});
}

function writeFile(file, data) {
	return new Promise((resolve, reject) => {
		fs.writeFile(file, data, {encoding: "utf-8"}, err => {
			resolve(true);
			reject(err);
		});
	});
}

/*
./templates/
  /home.html
  /post.html
./posts
  /1-title.md
  /2-title.md
./home.md
*/