module.exports = function(locals) {
	return `
		${require("./header.js")({title: "home"})}
		<div class="map">
			<iframe src="https://www.google.com/maps/d/u/0/embed?mid=1JckFYS7xR0RwF9DqW-ptZlqXogc" frameborder="0"></iframe>
		</div>
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