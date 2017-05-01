console.log("test");

this.addEventListener('install', function(event) {
 	event.waitUntil(caches.open('v1').then(function(cache) {
		return cache.addAll([
			"./",
			"index.html",
			"bundle.css",
			"bundle.js",
			"manifest.json",
			// posts ... wonder if this can be generated somehow
			// ... maybe a meta.json?
			"1-test.html",
			"2-test.html"
		]);
	}));
});

this.addEventListener("fetch", event => {
	console.log(event.request);
	event.respondWith(caches.match(event.request)
		.catch(() => fetch(event.request))
		.then(res => {
			return res;
		})
		.catch(() => console.log("a"))
	);
});