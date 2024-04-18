

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

