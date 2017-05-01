module.exports = function(locals) {
	return `
		${require("./header.js")({title: "home"})}
		<ul class="postlist">${
			locals.postlist.reduce((acc, post) => `${acc}<li>
				<a class="post" href="${post.link}">
					<span class="title">${post.title}</span>
					<span class="pull">some actual post content here that will be long and descriptive and usefull for debugging etc, some actual post content here that will be long and descriptive and usefull for debugging etc</span>
				</a></li>`, "")
		}</ul>
		${require("./footer.js")()}
	`;
}