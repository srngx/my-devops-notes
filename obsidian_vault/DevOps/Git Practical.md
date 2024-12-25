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

#### To add all untracked changes into git
```sh
git add . 
#or 
git add -A
```

#### This command will commit changes into git
```sh
git commit -m "new commit"
``` 

#### Syncing latest commit to remote repo
```sh
git push origin main
```

#### Pulling latest changes from remote to local
```sh
git pull origin main
```

