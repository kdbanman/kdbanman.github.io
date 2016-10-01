---
layout: post
title: reportify
---

[reportify](https://www.npmjs.com/package/reportify) is an issue reporting tool for GitHub repositories.  It uses GitHub Auth Tokens to scrape the REST API for a repository for a complete history of issues.

#### Built with Node

reportify sits on top of the [octonode](https://github.com/pksunkara/octonode) API wrapper for [Node](https://nodejs.org/en/), and it uses [promises](https://www.npmjs.com/package/q) for asynchronous control flow.  But it's time for a refactor - reportify started as a tiny script to rushed to fulfill the requirements of [another project]({% post_url 2016-04-23-polyball %}), so mutating global state felt justified.  It's still reasonably readable, but all functions need to be decoupled from global state and modularized before any more features are added.  [Get in touch](/contact) if you're interested in helping out.
