---
Title: Linux Notes 2025
draft: "true"
---
## What is Linux?
Linux is Free and Opensource unix like system license under GNU GPL 2.0 which allows users to read, modify and redistribute the code under the same license. It is started as a hobby project by Linus Torvald in 1991 in University of Finland. Then people around the glob started contributing and sharing the code eventually making the linux largest project of developer base.

## What is Unix?
Unix is a family of multitasking, multi-user computer operating systems that derive from the original AT&T Unix, whose development started in 1969 at the Bell Labs research center by Ken Thompson, Dennis Ritchie, and others. Initially intended for use inside the Bell System, AT&T licensed Unix to outside parties in the late 1970s, leading to a variety of both academic and commercial Unix variants from vendors including University of California, Berkeley, Microsoft, Sun Microsystems, HP/HPE, and IBM.

UNIX, whose full form is "Uniplexed Information and Computing Service", is a pioneering Operating System developed in the late 1960s at AT&T's Bell Labs. Renowned for its modular design and robustness, UNIX introduced innovative concepts like hierarchical file systems and the use of plain text for storing data.

## What is Operating System?
An operating system is system software that manages computer hardware and software resources, and provides common services for computer programs.


## Architecture of Linux
    - Hardware
    - Kernel
    - Shell
    - Application
    - Utilities

## File system Hierarchy in Linux?
    - /         root level
    - /bin      binaries                            cat, ls, cd, mv, etc
    - /boot     boot related files                  initramfs, initrd, bootloader, grub
    - /dev      device files                        stdin, stderr, null, tty, sda
    - /home     user files                          ramesh, prakash, prathamesh, rakhi
    - /etc      configuration files                 nginx.conf, dhcp, httpd.conf 
    - /lib      system libraries                    dkms, dpkg, cups, init
    - /opt      optional directories                zoom, stremio
    - /tmp      temporary files                     Tmpaddon, configerror
    - /media    mountable media directory           sdb1, sdc1, sdc2
    - /run      runlevel files                      lock, lvm, mount, initctl
    - /sbin     shared system libraries             openvpn, arp, alsa
    - /usr      user level files                    /usr/local, /usr/share
    - /proc     processes                           net, tty, kcore
    - /var      variable files, logs, caches        log, cache, lib, opt, run, spool, mail
    - /sys      system files                        block, bus, class, dev

## What is bootloader?
A bootloader, also spelled as boot loader or called bootstrap loader, is a computer program that is responsible for booting a computer and booting an operating system. If it also provides an interactive menu with multiple boot choices then it's often called a boot manager. 

## What are commands?
Linux commands are instructions that users type into the command line interface to perform specific tasks on a Linux operating system. They allow users to navigate the file system, manage files and directories, and execute programs efficiently.

## What is Process?
A process is a instance of program running into computer. Its loaded into memory and active. A program operates independently and has its own memory space.
Each process provides the resources needed to execute a program. A process has a virtual address space, executable code, open handles to system objects, a security context, a unique process identifier, environment variables, a priority class, minimum and maximum working set sizes, and at least one thread of execution. Each process is started with a single thread, often called the primary thread, but can create additional threads from any of its threads.

## What is thread?
Both processes and threads are independent sequences of execution. The typical difference is that threads (of the same process) run in a shared memory space, while processes run in separate memory spaces.
Threads are an operating environment feature, rather than a CPU feature (though the CPU typically has operations that make threads efficient).
A thread is an entity within a process that can be scheduled for execution. All threads of a process share its virtual address space and system resources. In addition, each thread maintains exception handlers, a scheduling priority, thread local storage, a unique thread identifier, and a set of structures the system will use to save the thread context until it is scheduled. The thread context includes the thread's set of machine registers, the kernel stack, a thread environment block, and a user stack in the address space of the thread's process. Threads can also have their own security context, which can be used for impersonating clients.

## What is Syscalls?
Syscalls, or system calls, are the way programs request services from the operating system, such as accessing hardware, creating processes, or managing files. They serve as an essential interface between user applications and the operating system.
System calls are mechanisms that provide the operating system’s services to computer programs. Computer programs use system calls to request a service from the operating system’s kernel. Moreover, if a program requires a resource from the operating system, it needs to make a system call.
https://www.baeldung.com/cs/system-calls

## What is filesystem?
A file system is a method an operating system uses to store, organize, and manage files and directories on a storage device. Some common types of file systems include:

    FAT (File Allocation Table): An older file system used by older versions of Windows and other operating systems.

    NTFS (New Technology File System): A modern file system used by Windows. It supports features such as file and folder permissions, compression, and encryption.

    ext (Extended File System): A file system commonly used on Linux and Unix-based operating systems.

    HFS (Hierarchical File System): A file system used by macOS.

    APFS (Apple File System): A new file system introduced by Apple for their Macs and iOS devices.

A file is a collection of related information that is recorded on secondary storage. Or file is a collection of logically related entities. From the user’s perspective, a file is the smallest allotment of logical secondary storage. 

## What is Kernel?
A kernel is the core component of an operating system that manages communication between hardware and software, controlling system resources and processes. It acts as a bridge, allowing applications to interact with the computer's hardware efficiently.

## What are types of Files?
    d: Directory
    -: Regular file
    c: Character device
    l: Link (symbolic or hard link)
    s: Socket
    p: Named pipe
    b: Block device

## File descriptor?
In Unix and Unix-like computer operating systems, a file descriptor is a process-unique identifier for a file or other input/output resource, such as a pipe or network socket. 
