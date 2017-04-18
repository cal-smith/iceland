#!/usr/bin/env bash

set -e # exit with nonzero exit code if anything fails

if [[ ${TRAVIS_TEST_RESULT=0} == 1 ]]; then
  exit 1;
fi

cd dist

if [[ ${TRAVIS_BRANCH} == "master" ]]; then
	# Move to build folder and init it
	git init

	# Configure Git
	git config user.name "Travis CI"
	git config user.email "callum1234moo@gmail.com"

	# Commit all the things into the repo
	git add .
	git commit -m "✨ Deploy to GitHub Pages"

	# Force push to gh-pages
	git push --force "git@github.com:hansolo669/iceland.git" master:gh-pages > /dev/null 2>&1
fi