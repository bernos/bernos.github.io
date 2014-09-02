---
layout: post
title:  "Building Bitbucket pull requests with Team City"
subtitle:	"Setting up TeamCity to merge and build a Bitbucket pull request before accepting it"
date:   2014-09-02 00:14:48
header_background_color:	"#003663"
categories: articles
tags: teamcity
header_image: "/img/posts/building-bitbucket-pull-requests-with-teamcity/header.jpg"
header_image_width: 1920
header_image_height: 800
---

Pull requests are a great way to socialise proposed new features, conduct code reviews or just apply some structure and ceremony to your branch merging process. They offer the opportunity to review and comment on proposed branch merges, and to preview the result of the merge, should you choose to accept the pull request.

One thing that a pull request can't do, however, is tell you what impact the proposed changes might have on any build/compilation or test process. Accepting a pull request because it "looks good!" and doesn't cause any merge conflicts can prove potentially problematic as it is possible to only find out about subtle issues that a code review won't pick up, but that will be caught by your compiler or unit tests, until _after_ you commit to accepting the pull request. Put another way, a pull request won't tell you whether the resulting code will _actually do what you think it will do_

The solution to this problem is fairly straight forward - just perform the hypothetical merge on a local copy repository, then run your build and test routines, and either accept or reject the pull request. Obviously this can get tedious, not to mention that any build or test failures are difficult to share with the rest of your team. Setting up Team City to do the work for us is a relatively straight forward process.

A good article for setting up Team City to build pull requests from Github already exists on the [Team City blog](http://blog.jetbrains.com/teamcity/2013/02/automatically-building-pull-requests-from-github-with-teamcity/). Unfortunately bitbucket does not use the same git branching setup under the hood, meaning that its a little more complicated to get this up and running if your git repository is hosted on Bit Bucket.

##Running git on the build agent

Team City is a _distributed_ build system. It consists of a _build server_ that manages job configuration and aggregates build results and so forth, and one or more _build agents_ that do the actual grunt work of performing build steps.

By default, when working with git, Team City will clone or pull your git repository onto the _build server_ and transfer the sources out to the _build agents_ to do the work. Unfortunately this is not going to work for us, as we will need to checkout and merge branches as part of our build process, so we are going to need our build agents to have a fully fledged git repository to work with, as well as the ability to execute git commands. Luckily this is all pretty easy to set up.

The first step is to go ahead an install git on your build agents. In a standard Team City setup you are usually running both the build server and build agent on the same box, but if you have multiple agents you'll want to install it on all of them.

Next, when setting up the Team City job, we need to make sure that the VCS checkout mode (on the "Version Control Settings" page) is set to "Automatically on agent"

![My helpful screenshot]({{ site.url }}/img/posts/building-bitbucket-pull-requests-with-teamcity/vcs-settings.png)


##Adding the build step

Once you have git installed and the VCS settings configured to checkout directly to the build agent, we can go ahead and set up a build step to perform the checkout and merge commands. Add a new "Command Line" build step with the following commands
Command line

{% highlight powershell %}
%env.TEAMCITY_GIT_PATH% fetch
%env.TEAMCITY_GIT_PATH% checkout master
%env.TEAMCITY_GIT_PATH% config --local user.email "automerge@merge.com"
%env.TEAMCITY_GIT_PATH% config --local user.name "Auto Merge"
%env.TEAMCITY_GIT_PATH% merge --no-commit %teamcity.build.branch%
{% endhighlight %}

The `TEAMCITY_GIT_PATH` environment variable will automatically be added by the build agent if it locates the git binary in any standard install path. You may also want to change the intial checkout branch from `master` to whatever the target branch for you pull requests is.

Once this build step runs you will have a copy of the merged source code, ready to pass on to the rest of your build steps.

So now it is a simple case of running the build against the branch you are wanting to merge, and reviewing the results. Once the build completes you can post a link back to the build results in a comment on the pull request and either accept or reject it.