module.exports = function(locals) {
	return `
		${require("./header.js")({title: "home"})}
		<ul>${locals.postlist.reduce((acc, post) => `${acc}<li><a href="${post.link}">${post.title}</a></li>`, "")}</ul>
		${require("./footer.js")()}
	`;
}