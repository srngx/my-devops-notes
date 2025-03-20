---
date: 2024-12-20
title: Git Notes
tags:
  - blog
  - git
---
## What is Git?
Git is a **Distributed Version Control System** that mainly used for Source code management by developers.

Git basically divides your code into three part.

1. Working Area
2. Staging Area
3. Head or commit

Working Area is your state of code before running the `git add` command.
The files in here also known as "untracked files".

To add the files into git you do `git add` and they moved to `staging area`.

Here your code got the `stage`. 

Before finalizing your code into production i.e. 'commit' you make required changes and after making sure 
your code is ready to go into production you run `git commit` command.
which is basically telling git this is a final changes with the special stamp of "commit hash".

Then If you want you can push your code into remote repository sitting onto the cloud waiting to be forked and contributed by peoples across the glob.

## Basic Git commands
- `git add`     To add code into git
- `git commit`  To commit changes 
- `git push`    To upload your code into remote repo
- `git pull`    To download latest changes from remote to your local
- `git fetch`   Fetching Metadata and logs from remote 

## Branching Strategies

Git Provide "Branches" which are nothing but a way to seperate your code into different version so you can later integrate your features and bugfixes into production once they finished peacefully in their own isolated places.

There are well known three branches people generally creates:
- Main  (which is your production branch)
- Dev   (which is your ongoing development which never cease to stop.)
- Test  (Here your code is being tested against performance and security standards.)

Some people also like to create their own custom branches like `alpha, beta, stable` etc i.e. according to release state.

## Commands Related to Branches
- `git branch -a`   List all available branches
- `git checkout -b` Create and switch to the new branch
- `git checkout`    To switch to different branch




