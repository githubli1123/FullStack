

## error: failed to push some refs to ...

### 一、问题产生原因

------

当你直接在github上在线修改了代码，或者是直接向某个库中添加文件，但是没有对本地库同步，接着你想push上传到远程库，就会失败，如下：

```
Error:failed to push some refs to 'github.com:githubli1123/FunctionSet.git'
```

### 二、解决办法
这个问题是因为**远程库与本地库不一致**造成的，那么我们把**远程库同步到本地库**就可以了，具体的，有以下两种情况：

1. 提前防止发生这个警告：如果你之前没有在本地库中进行commit，那么直接通过pull拉取你要上传的远程库即可，如下代码：`git pull 远程库别名 master`

2. 后来遇到了这个警告，之前已经commit过了：需要通过 --rebase 取消掉本地库中刚刚的commit，并把他们接到更新后的版本库之中，如下代码：`git pull --rebase 远程库别名 master`。如果你使用 `git pull --rebase 远程库别名 master`，出现如下情况，就说明成功了！`Successfully rebased and updated refs/heads/master`

### 三、如果还是出问题，怎么办？（必杀）
如果使用 `--rebase` 还是不行，你需要再通过 `git status` 看一下，是不是如下图情况：（如果是下图情况，那么这就是你提交不成功问题的根源！）

```
You are currently editing a commit while rebasing branch 'master' on ...
```

意思就是说：

你当前正在编辑一个提交，如果你对当前的修改不满意，可以使用 `git commit --amend` 修改当前提交，如果你对当前的修改满意时，使用 `git rebase --continue` 。

那么就看你自己对提交的情况满不满意了，为了快速解决push失败的问题（即认同对自己当前的提交已经满意），那么！你直接输入代码`git rebase --continue`即可：（之后再push，一定会成功！）

原文链接：https://blog.csdn.net/CYK_byte/article/details/128970712





## error:Your local changes to the following files would be overwritten by merge

### 问题产生的原因

用 `git pull` 来更新代码的时候，遇到了以下报错信息：
error:Your local changes to the following files would be overwritten by merge: xxx Please, commit your changes or stash them before you can merge. Aborting

原因分析：出现这个问题的原因是，其他人修改了xxx文件并提交到版本库中，而你本地恰好也修改了这个文件。这个时候执行 git pull 时就产生冲突了。

### 解决方法

解决这个问题有以下两个方案：
（1）🚫删除本地代码再执行git pull(不推荐，本地代码被覆盖，等于工作白干)
（2）✔️通过git stash 将工作区恢复到上次提交到内容，同时备份到本地所做到修改，之后就可以正常git pull了，git pull完成后，执行git bash pop将之前本地做的修改应用到当前工作区。

```
git stash
git pull
git stash pop
```

### 总结
这里解释一下这三行代码到意思吧；
`git stash` 备份当前的工作内容区的内容，从最近的一次提交中读取相关内容，让工作区保证和上次提交的内容一致。同时，将当前的工作区内容保存到git栈中。

`git pull` 拉取服务器上的代码；

`git stash pop` 从git栈中读取最近一次保存的内容，恢复工作区的相关内容。由于可能存在多个stash的内容，所以用栈来管理，pop会从最近的一个stash中读取内容并恢复。

`git stash list`显示git栈内的所有备份，可以利用这个列表来决定从哪个地方恢复。

`git stash clear` 清空git栈。此时若使用git相关的图形化工具会发现，原来的那些结点就消失了。
———————————————

原文链接：https://blog.csdn.net/StoneVivi/article/details/114809766

### 还是出了问题

主要会在执行 `git stash pop` 时出现问题。
