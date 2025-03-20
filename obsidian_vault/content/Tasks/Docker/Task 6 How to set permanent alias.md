---
Title: How to set Permanent Aliases
date: 2025-01-07
tags:
  - ShellScripting
  - linux
  - bash
---
aliases are shortnames or nick names for big forgottable commands user sets by themselves the use for their own convenience and comfort over big and tedius commands.

Example. If you set alias for `ls -la --color=auto` command to be `ll` it will automagically trigger that command everytime you use `ll` command.

There are two ways to set Alias in linux terminal:
#### Method 1 (Temporary Alias):

```sh
alias k="kubectl"
```
Here you only set alias for your current shell meaning as long you have that shell session on you can use it if you kill it or spawn in new shell or restart terminal it wont be available again. To use permanent Alias use Method 2.

#### Method 2 (Permanent Alias)

Adding this line in *~/.bashrc* or */.bash-profile* file

You can add this line into your shell configuration whether its bash or zsh. it will work.
```sh
alias k="kubectl"
```

**Limitation**: For simple purposes this is fine but it wont work in your shell scripts cuz its limited to your shell and not its child processes.

Using **export** will add aditional functionality to your alias and expands its availability to the **child processess of shell** also which makes them usable in your custom shell scripts too.

```sh
export alias k="kubectl"
```

You can add your alias in this way either in `~/.bashrc` or` ~/.profile` or `~/.bash-profile` file

Immediate result may not be seen you need to restart shell or source the file again 
```sh
source ~/.bashrc
or 
. ~/.bashrc
```

