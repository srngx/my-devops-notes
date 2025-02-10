---
Title: My Limited Diff Usecase for my Remembral
tags:
  - blog
  - diff
---
**What is `diff`?**

Shows difference/comparison between files

**Why is it useful?**

- **Tracking changes:** See how a file has evolved over time.
- **Comparing versions:** Find out what's different between two versions of a document or code.
- **Merging changes:** Helps you combine different versions of a file.
- **Troubleshooting:** Identify what went wrong in a configuration file or program.

**How to use it?**

The basic command is super simple:

```bash
diff file1 file2
```

Just replace `file1` and `file2` with the actual names of your files.

**Making the output more helpful**

`diff` has some options to make the output easier to understand:

- `-u` (or `--unified`): Shows the changes in a "unified" format, which is more compact and easier to read.
- `-y` (or `--side-by-side`): Displays the files side-by-side, so you can see the differences directly.
- `-w` (or `--ignore-all-space`): Ignores differences in whitespace (spaces and tabs), which is helpful if you only care about the content.
- `-r` (or `--recursive`): Compares entire directories, not just individual files.
- `-q` (or `--brief`): Only tells you if the files are different, not what the differences are.

**Example:**

Let's say you have two files, `original.txt` and `revised.txt`. To see the differences in a unified format:

```bash
diff -u original.txt revised.txt
```

**Understanding the output**

`diff` uses some symbols to show you the changes:

- `+`: Lines added in the second file.
- `-`: Lines removed from the first file.
- `@@`: Indicates a block of changed lines.
***

See difference between two folders
Basic Usage
```sh
diff -qr folder1 folder2
```
- `-q`: Only reports when files differ.
- `-r`: Recursively compares subdirectories.

More detailed output
```sh
diff -ruN dir1 dir2
```
- `-r`: Recursively compares subdirectories.
- `-u`: Produces a unified diff format, which is easier to read.
- `-N`: Treats absent files as empty.

For files
```sh
diff -wy file1.txt file2.txt
```
- `-w` : for ignoring whitespaces
- `-y` : side by side comparison


Some Very Important Flags
- `--color=always`