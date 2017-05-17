const marked = require("marked");
const path = require("path");
const fs = require("fs");
const minimist = require("minimist");

const argv = minimist(process.argv.slice(2));
console.log(argv);

const BASE = path.resolve(__dirname, argv._[0]);
const OUT = path.resolve(__dirname, argv.o);
const TEMPLATES = path.resolve(BASE, "./templates");
const POSTS = path.resolve(BASE, "./posts");
const IMAGES = path.resolve(BASE, "./images");
try {
	const config = require(path.resolve(BASE, "config.json"));
} catch (e) {
	console.log("🙃  failed to load config, using defaults");
} finally {
	const config = {};
}

async function renderIndex() {
	let indexTemplate = require(path.resolve(TEMPLATES, "home.js"));
	/*
	*	render listing of all the posts under posts
	*/
	let files = await readDirFiles(POSTS);
	files = await Promise.all(files.map(async file => {
		let postMeta = getPostMeta(await file.data);
		Object.assign(postMeta, {
			link: file.name.replace(/\.md$/, ".html")
		});
		return postMeta;
	}));
	writeFile(`${OUT}/index.html`, indexTemplate({postlist: files.reverse()}));
}

async function renderPosts() {
	let postTemplate = require(path.resolve(TEMPLATES, "post.js"));
	let files = await readDirFiles(POSTS);
	for (let file of files) {
		let name = file.name.replace(/\.md$/, ".html");
		console.log("💭  rendering", file.name, "➡️ ", name);
		writeFile(`${OUT}/${name}`, postTemplate(getPostMeta(await file.data)));
	}
}

function getPostMeta(postMD) {
	let postMeta;
	try {
		postMeta = JSON.parse(postMD.match(/^\{(.|\n)*}/)[0]);
	} catch (e) {
		console.log("parse fail :(", e);
	}
	let post = marked(postMD.replace(/^\{(.|\n)*}/, ""));
	Object.assign(postMeta, {
		title: postMeta.title || "Untitled...",
		post
	});
	return postMeta;
}

async function copyImages() {
	for (let image of await readDirFiles(IMAGES, {encoding: null})) {
		writeFile(path.resolve(OUT, image.name), await image.data, {encoding: null});
	}
}

renderIndex();
renderPosts();
copyImages();
// console.log("✨ done");

// async/await wrapped fs and helper functions
function readFile(file, options) {
	if (!options) {options = {encoding: "utf-8"};}
	return new Promise((resolve, reject) => {
		fs.readFile(file, options, (err, data) => {
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

function readDirFiles(dir, options) {
	return readDir(dir).then(files => {
		return files.map(file => {
			return {
				name: file,
				data: readFile(path.join(dir, file), options)
			};
		});
	});
}

function writeFile(file, data, options) {
	if (!options) {options = {encoding: "utf-8"};}
	return new Promise((resolve, reject) => {
		fs.writeFile(file, data, options, err => {
			resolve(true);
			reject(err);
		});
	});
}
