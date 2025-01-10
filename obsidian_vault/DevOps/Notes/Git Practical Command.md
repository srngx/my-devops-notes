
### Git Setup from scratch
## Installing Git
- Signup to [github.com](https://github.com)
- Install git with [gitbash](http://git-scm.com) in windows 
- or via package manager in linux
	- for ubuntu `apt install git`
	- for rhel based distros `yum install git`
	- for arch based distros `pacman -S git`

## Initializing empty repository as git
- Create empty folder in local machine
- navigate to it and run `git init`
- add some files and run `git add .`
- commit changes `git commit -m "git initialized and new files added"
- Create repository in github and use its link to below step
- Add remote repo `git remote add origin git@github.com:<username>/<repo-name>.git`
- update the remote repo with push `git push origin main`

---
### Basic Git Commands

#### Adding Files to Staging Area 

```sh
git add . 
```
This command will staged all files and modifications done in current and subdirectories but wont wont stage deletions.

```sh
git add -A 
```
This command will stage **all types of changes** across your entire working directory including *newfiles, modifications and deletions*
#### This command will commit changes into git
```sh
git commit -m "new commit"
``` 
**Creates a commit with the specified message.** This is the most common way to commit changes.

```sh
git commit -A "your commit message"
```
**Automatically stages all tracked files that have been modified and deleted, then creates a commit.** It combines `git add -A` and `git commit -m` into a single command.

**Does not stage any new files.** If you have new files you want to include in the commit, you still need to stage them separately using `git add`.
#### Syncing latest commit to remote repo
```sh
git push origin main
```
**Uploads your local changes to the remote repository.**
After pushing, other developers can access your changes by pulling from the remote repository.
#### Pulling latest changes from remote to local
```sh
git pull origin main
```
**Downloads changes from the remote repository to your local repository.** Used to stay up-to-date with the latest changes made by other develpers.*

#### Merging changes from branch to master
```sh
git checkout master
git merge 4.4.0

#or to replace completely (overwrite history) 
git push origin 4.4.0:master 

```
