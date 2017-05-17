module.exports = function(locals) {
	return `
		${require("./header.js")({title: locals.title, main: "post"})}
			${locals.post}
		${require("./footer.js")()}`;
}