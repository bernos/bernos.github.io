---
layout: post
title:  "Building Bitbucket pull requests with Team City"
subtitle:	"Setting up TeamCity to merge and build a Bitbucket pull request before accepting it"
date:   2014-08-29 00:14:48
header_background_color:	"#003663"
categories: articles
tags: teamcity
header_image: "/img/posts/building-bitbucket-pull-requests-with-teamcity/header.jpg"
header_image_width: 1920
header_image_height: 800
---

Overview

Install git on the build agent

Setting up the Team City job

Version control settings

Ensure VCS Checkout mode is set to "Automatically on agent"

![My helpful screenshot]({{ site.url }}/img/posts/building-bitbucket-pull-requests-with-teamcity/vcs-settings.png)

Build step

Command line

{% highlight powershell %}
call %env.TEAMCITY_GIT_PATH% fetch
call %env.TEAMCITY_GIT_PATH% checkout dev
call %env.TEAMCITY_GIT_PATH% config --local user.email "automerge@merge.com"
call %env.TEAMCITY_GIT_PATH% config --local user.name "Auto Merge"
call %env.TEAMCITY_GIT_PATH% merge --no-commit %teamcity.build.branch%
{% endhighlight %}