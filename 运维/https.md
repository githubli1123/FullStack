## HTTPS

1 安装 SSL 证书

### acme.sh

只需三行命令，免费配置https 加密证书，一次配置，永久生效。 对于家庭NAS服务，或者自建网站等暴露在公网上的网络应用。如果使用 HTTP 协议，信息是明文传输，只要攻击者在通信链路中的任意路由器抓个包，就看到包里面内容，因此很不安全。配置 TLS 加密，也就是使用HTTPS协议 ，则可以保护传输安全。 这其中，**最关键的步骤，是从CA机构那里申请服务器证书**。 CA机构作为受信任的第三方，是确保客户端与服务端互相信任的核心机制。 网上有很多免费提供TLS证书的服务商，比如Let's Encrypt 不过这里的免费证书只有短短90天。频繁续签，更换证书绝对是令人头秃的一件事。 本期视频带来一个Github上4.9万Star的开源项目，acme.sh，只需要几行简单命令就可以免费申请TLS证书，还能全自动续签，一劳永逸解决https证书难题。

项目名字 ACME （Automatic Certificate Management Environment） 是一种自动化的协议，用于自动化管理证书的颁发、续期和撤销等等。 acme.sh就是ACME协议的一种实现方式，使用了简单几行 shell 命令，帮我们自动完成证书的申请与续签

https://github.com/acmesh-official/acme.sh



遇到的问题：

在windows上编辑好sh后到linux下运行时常会出现“no such file or directory”，这一般是格式的问题，改成unix格式就可以，具体步骤如下。

开始以为是sh路径问题，用which查看是正确的。

用vim打开文件：vi 文件名

按‘：’号键，输入查看文件的格式命令set ff或set fileformat

可以看到格式是DOS的

再按‘：’键输入set ff=unix 或 set fileformat=unix设置格式为unix的，

然后‘：’键后输入wq，保存，再重新运行就可以了



```
acme.sh --issue -d www.meta.genelonghe.com --webroot /var/project/commpany/fontend/dist
```

```
acme.sh --install-cert -d www.genelonghe.com \
--key-file       /etc/nginx/tls/key.pem  \
--fullchain-file /etc/nginx/tls/cert.pem \
--reloadcmd     "service nginx force-reload"
```

### certbot

创建一个普通用户

```
sudo useradd -m common
sudo passwd common
sudo usermod -aG wheel common
id common
```

```
# 1. 下载软件
sudo yum install certbot -y

# 2. 签名
# 2.1 单域名/多域名（通过 Nginx 自动配置验证）
sudo certbot --nginx -d www.genelonghe.com -d www.meta.genelonghe.com

# 2.2 通配符域名（需手动 DNS TXT 记录验证）
certbot -d XXX.com -d *.XXX.com --manual --preferred-challenges dns-01 --server https://acme-v02.api.letsencrypt.org/directory certonly --agree-tos

# 2.3 仅获取证书（不修改服务器配置）
sudo certbot certonly --nginx -d www.meta.genelonghe.com
# 或
sudo certbot certonly --webroot -w /var/project/commpany/fontend/dist -d www.meta.genelonghe.com # 没有那个nginx插件就用这条命令
```

```
IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/www.meta.genelonghe.com/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/www.meta.genelonghe.com/privkey.pem
   Your certificate will expire on 2025-09-14. To obtain a new or
   tweaked version of this certificate in the future, simply run
   certbot again. To non-interactively renew *all* of your
   certificates, run "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```

```
# 如果需要 nginx 手动配置
# 样本管理系统，子域名需要写在主域名后面
    # HTTP 重定向配置：将 meta.a.com 和 www.meta.a.com 的 HTTP 请求重定向到 HTTPS
    server {
        listen 80;
        server_name meta.genelonghe.com www.meta.genelonghe.com;
        return 301 https://www.meta.a.com$request_uri;
    }
    # HTTPS 主配置：处理 www.meta.a.com 的请求
    server {
        listen 443 ssl;
        server_name  www.meta.genelonghe.com;
        # nginx 访问日志
        access_log /var/project/commpany/nginxLog/access.log;
        error_log /var/project/commpany/nginxLog/error.log;
        # 页面位置
        location / {
            root   /var/project/commpany/fontend/dist;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html; # 适配 history 模式
        }
        # 接口代理 作用：解决跨域；负载均衡（这里暂时没得）
        # 后端地址
        location /api/ {
          proxy_pass http://127.0.0.1:9999/;
          client_max_body_size 1024m;
          client_body_buffer_size 128k;
          client_body_timeout 900s;
          proxy_connect_timeout 120s;
          proxy_read_timeout  900s;
          proxy_send_timeout 900s;
          proxy_pass_header Authorization;
          proxy_set_header  Host $host;
          proxy_set_header  Upgrade $http_upgrade;
          proxy_set_header  Connection $connection_upgrade;
          proxy_set_header  X-NginX-Proxy true;
          proxy_set_header  X-Real-IP $remote_addr;
          proxy_set_header  X-Forwarded-Proto $scheme;
          proxy_set_header  X-Forwarded-For $remote_addr;
          proxy_hide_header X-Powered-By;
          proxy_redirect off;
          proxy_buffers 32 32k;
        }
        location /bio/ {
          proxy_pass http://127.0.0.1:3000/;
          client_max_body_size 1024m;
          client_body_buffer_size 128k;
          client_body_timeout 900s;
          proxy_connect_timeout 120s;
          proxy_read_timeout  900s;
          proxy_send_timeout 900s;
          proxy_pass_header Authorization;
          proxy_set_header  Host $host;
          proxy_set_header  Upgrade $http_upgrade;
          proxy_set_header  Connection $connection_upgrade;
          proxy_set_header  X-NginX-Proxy true;
          proxy_set_header  X-Real-IP $remote_addr;
          proxy_set_header  X-Forwarded-Proto $scheme;
          proxy_set_header  X-Forwarded-For $remote_addr;
          proxy_hide_header X-Powered-By;
          proxy_redirect off;
          proxy_buffers 32 32k;
        }

        #SSL-START SSL相关配置，请勿删除或修改下一行带注释的404规则
        #error_page 404/404.html;
        #HTTP_TO_HTTPS_START
        # if ($server_port !~ 443) {
        #     rewrite ^(/.*)$ https://$host$1 permanent;
        # }
        #HTTP_TO_HTTPS_END
        ssl_certificate /etc/letsencrypt/live/www.meta.genelonghe.com/fullchain.pem; 
        ssl_certificate_key /etc/letsencrypt/live/www.meta.genelonghe.com/privkey.pem; 
        ssl_protocols TLSv1.3 TLSv1.2 TLSv1.1 TLSv1;
        ssl_ciphers EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
        ssl_prefer_server_ciphers on;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;
        add_header Strict-Transport-Security "max-age=31536000";
        error_page 497 https://$host$request_uri;
        #SSL-END

        #ERROR-PAGE-START  错误页配置，可以注释、删除或修改
        error_page 404 /404.html;
        location = /404.html {
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        } 
        #ERROR-PAGE-END
        
    }
    # Settings for a TLS enabled server.
    # HTTPS 重定向配置：将 meta.a.com 的 HTTPS 请求重定向到 www
    server {
        listen 443 ssl;
        server_name meta.genelonghe.com;

        # 复用相同的 SSL 证书
        ssl_certificate /etc/letsencrypt/live/www.meta.genelonghe.com/fullchain.pem; 
        ssl_certificate_key /etc/letsencrypt/live/www.meta.genelonghe.com/privkey.pem; 

        return 301 https://www.meta.a.com$request_uri;
        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
```

