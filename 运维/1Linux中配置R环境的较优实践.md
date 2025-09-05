一台机器上优质的R环境如下：

- 可随时切换 R 版本，推荐使用 Conda 。
- R 包在不同项目中隔离， 推荐使用 renv 。
- 可提供图形界面工具，此工具与 R 环境集成，推荐使用 RStudio Server 完成。



## 1 准备 Linux

使用的操作系统： Centos 7

架构：X86_64



## 2 准备 Conda 

使用的 conda ：miniconda3 。写此文时的版本是25.1.1 。

下载：[Installing Miniconda - Anaconda](https://www.anaconda.com/docs/getting-started/miniconda/install#macos-linux-installation)

配置 R 4.3 版本的虚拟环境：

```
conda create -n r4.3_env r-base=4.3  # 指定R版本
conda activate r4.3_env              # 激活环境
```

测试 R 环境是否可用：

```
(r4.3_env) [root@localhost ~]# R
>q()
```



## 3 准备图形界面 RStudio Server

2025年4月1日时官网上显眼位置上没有 CentOS 7 的下载链接提供了。

对于我当前的操作系统和版本，可以以此执行如下命令：

```
wget https://download2.rstudio.org/server/centos7/x86_64/rstudio-server-rhel-2023.06.1-524-x86_64.rpm
# then
sudo yum install rstudio-server-rhel-2023.06.1-524-x86_64.rpm
```

```
# Verify your installation
rstudio-server version
```

当你做到这一步的时候，表示你已经成功安装了 rstudio-server 。下面需要做些必要的配置才可以成功启动。

配置  rserver.conf ，文件位于 `/etc/rstudio/rserver.conf`，文件写入：

```
# Server Configuration File
www-port=8787
rsession-which-r=/root/miniconda3/envs/r4.3_env/bin/R # which R
auth-timeout-minutes=0
auth-stay-signed-in-days=30
```

配置 rsession.conf ，文件位于 `/etc/rstudio/rsession.conf`，文件写入：

```
# R Session Configuration File
www-port=8787
```

配置防火墙：

```
sudo firewall-cmd --zone=public --add-port=8787/tcp --permanent 
sudo firewall-cmd --reload
sudo firewall-cmd --query-port=8787/tcp  # Verify your configuration
```



接下来，就是见证 RStudio Server 运行起来的时刻🎉

```
sudo systemctl start rstudio-server
systemctl status rstudio-server  # Verify that it is running
```

任意一台带浏览器的机器都可以访问到这个 RStudio Server 服务。



需要注意的是，可能还需要配置 用户名和密码 。因为当前的 RStudio Server 不允许以 Linux 中 root 账号登录，需要在 Linux 中添加新用户。

还需要注意，可能登录后遇到如下问题：

```
Could not connect to the R session on RStudio Server.
Unable to connect to service (1)
```

解决方法



附录

附录1 R语言中国镜像网站：

北大镜像：https://mirrors.pku.edu.cn/CRAN/bin/windows/base/



‌附录2 R语言主流稳定版本推荐（AI生成）

‌**R 4.2.x 系列（如 4.2.3）**‌

- ‌**优势**‌：官方长期维护版本，兼容主流扩展包（如 `tidyverse`、`data.table`）且修复了历史版本的安全漏洞‌。
- ‌适用场景
  - 新项目开发、数据分析与可视化‌4。
  - 需与最新版 IDE（如 RStudio 2024）集成‌。

1. ‌**R 3.6.x 系列（如 3.6.0）**‌
   - ‌**优势**‌：长期支持版本（LTS），稳定性强，适合依赖旧版包的项目‌56。
   - ‌适用场景
     - 企业级遗留系统维护‌。
     - 兼容性敏感的科研计算环境‌。



附录3 R包镜像网站配置



附录4 

添加用户后依然会报这个错误哦！

为了安全起见，`RStudio Server`不允许`root`用户登录，所以我们需要新建一个没有`root`权限的用户。

```text
useradd abc
passwd abc 
```

------

然后为你自己建个`home directory`，不然的话会报错哦。

```text
mkdir /home/abc
chown -R abc /home/abc
```

------

报错会说：

```text
could not connect to the r session on rstudio server unable to connect to service
```

**关于 `setenforce 0` 和 SELinux 的解释** ‌（AI生成）

‌**1. 你做了什么？**‌

- ‌**命令**‌：`setenforce 0`
- ‌作用：将 SELinux 的运行模式从默认的 ‌强制模式（Enforcing）切换为 ‌宽容模式（Permissive）。
  - ‌**Enforcing 模式**‌：严格拦截所有违反 SELinux 安全策略的操作（如文件访问、网络端口绑定等）。
  - ‌**Permissive 模式**‌：仅记录违规行为但不阻止操作，相当于“仅警告不拦截”‌。

------

‌**2. 为什么设置后问题解决了？**‌

- ‌**根本原因**‌：RStudio Server 或其他服务运行时触发了 SELinux 的安全策略拦截（例如尝试绑定 8787 端口或访问受限文件）。
- ‌**临时绕过**‌：通过 `setenforce 0` 关闭强制拦截，系统不再阻止这些操作，因此服务恢复正常‌。

------

‌**3. 注意事项**‌

- ‌**临时生效**‌：`setenforce 0` 的配置在系统重启后会失效，SELinux 会恢复为默认的 Enforcing 模式。

- ‌永久关闭 SELinux（不推荐）‌：

  ```
  sudo sed -i 's/SELINUX=enforcing/SELINUX=permissive/g' /etc/selinux/config  # 永久设为 Permissive 模式  
  ```

  ‌

  风险‌：完全禁用 SELinux（

  ```
  SELINUX=disabled
  ```

  ）会显著降低系统安全性‌。

------

‌**4. 更安全的解决方案（推荐）**‌

- ‌通过 SELinux 策略放行特定操作：

  1. ‌查看 SELinux 拦截日志‌：

     ```
     sudo ausearch -m avc -ts recent  # 检查最近被拦截的操作  
     ```

  2. ‌生成自定义策略模块：

     ```
     sudo ausearch -m avc -ts recent | audit2allow -M mypolicy  # 生成策略文件 `mypolicy`  
     sudo semodule -i mypolicy.pp  # 加载策略模块  
     ```

  3. 重启服务并验证‌：

     ```
     sudo systemctl restart rstudio-server  
     ```

- ‌示例场景：

  - 若 RStudio Server 因无法绑定端口被拦截，可通过策略允许其使用 8787 端口：

    ```
    sudo semanage port -a -t http_port_t -p tcp 8787  # 添加端口到 SELinux 白名单  
    ```

------

### ‌**操作验证**‌

```
getenforce  # 查看当前 SELinux 模式（应返回 "Permissive"）  
sestatus     # 检查详细状态（包括模式及策略版本）  
```

------

### ‌**总结**‌

- ‌**短期方案**‌：`setenforce 0` 可快速绕过 SELinux 限制，但牺牲了安全性。
- ‌**长期方案**‌：通过 `audit2allow` 或 `semanage` 调整 SELinux 策略，精准放行必要权限，保持安全防护‌。
- ‌**RStudio 相关**‌：若问题仅涉及端口，直接放行端口策略（`semanage port`）是最佳实践‌。



首先关闭浏览器 Rstudio登录页面。然后使用 ssh登陆到服务器中，在家目录中找到并进入 rstudio 这个隐藏目录，并重命名为rstudio.old（如果已经存在 rstudio.old ，就先把 rstudio.old  删掉）。再一次使用 方法7 kill 掉之前残留的进程。最后再打开浏览器登录 Rstudio 

查看 `systemctl status rstudio-server -l` 知道错误

```
4月 09 16:44:41 localhost.localdomain rserver[12525]: ERROR RStudio session start failed for: shiny: in 10.8s error: rpc error: system error 2 (No such file or directory) [host: 192.168.132.101:8787, uri: /rpc/client_init, path: /var/run/rstudio-server/rstudio-rsession/shiny-d, user-id: 1001]; OCCURRED AT void rstudio::core::http::LocalStreamAsyncClient::handleConnect(const rstudio_boost::system::error_code&) src/cpp/server/session/ServerSessionProxy.cpp:124; LOGGED FROM: void rstudio::server::SessionManager::removePendingLaunch(const rstudio::core::r_util::SessionContext&, bool, const string&) src/cpp/server/session/ServerSessionManager.cpp:425
```





推荐 docker 部署

本机：ubuntu22

架构：amd64

[docker命令出现permission denied的解决方法_permission denied while trying to connect to the d-CSDN博客](https://blog.csdn.net/nb12138/article/details/145355889)

```
docker run -itd -p 8787:8787 --name rstudio -e PASSWORD=root1123 --privileged=true -v /srv/shinyapps/:/home/rstudio/shinyapps -v /srv/shinylog/:/home/rstudio/shinylogs rocker/rstudio
```

