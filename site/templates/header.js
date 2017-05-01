module.exports = function(locals) {
	return `
		<!DOCTYPE html>
		<html>
		<head>
			<title>${locals.title}</title>
			<link rel="stylesheet" href="bundle.css">
			<link rel="manifest" href="manifest.json">
		</head>
		<body>
		<main>
			<header>
				<h1><a href="./">Iceland</a></h1>
			</header>`;
}