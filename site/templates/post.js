module.exports = function(locals) {
	return `
		${require("./header.js")({title: locals.title})}
			${locals.post}
		${require("./footer.js")()}`;
}