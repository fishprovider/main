# VPS Setup

## Cloudflare
Create Origin CA certificates
https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/

Save to
```
/etc/nginx/ssl/cloudflare-cert.pem;
/etc/nginx/ssl/cloudflare-key.pem;
```

## Nginx
`ls /etc/nginx/sites-available`
```
default
root
www
back
gate
pay
mon
```

`cat /etc/nginx/sites-available/default`
```
server {
    listen 443 ssl;
    ssl_certificate     /etc/nginx/ssl/cloudflare-cert.pem;
    ssl_certificate_key /etc/nginx/ssl/cloudflare-key.pem;
}
```

`cat /etc/nginx/sites-available/root` (redirect `/` to www)
```
server {
    listen 443 ssl http2;
    ssl_certificate     /etc/nginx/ssl/cloudflare-cert.pem;
    ssl_certificate_key /etc/nginx/ssl/cloudflare-key.pem;

    server_name fishprovider.com;

    location / {
        return 301 $scheme://www.fishprovider.com$request_uri;
    }
}
```

`cat /etc/nginx/sites-available/www`
```
upstream webservers {
    server localhost:3000;
    server localhost:3100 backup;
}

server {
    listen 443 ssl http2;
    ssl_certificate     /etc/nginx/ssl/cloudflare-cert.pem;
    ssl_certificate_key /etc/nginx/ssl/cloudflare-key.pem;

    server_name www.fishprovider.com;

    location / {
        proxy_pass http://webservers;

        # for websocket
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # for passing client meta to upstream server
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # for buffer the responses from the proxied server
        proxy_buffering on;
    }
}
```

`cat /etc/nginx/sites-available/back`
```
upstream backservers {
    server localhost:3001;
    server localhost:3101 backup;
}

server {
    listen 443 ssl http2;
    ssl_certificate     /etc/nginx/ssl/cloudflare-cert.pem;
    ssl_certificate_key /etc/nginx/ssl/cloudflare-key.pem;

    server_name back.fishprovider.com;

    location / {
        proxy_pass http://backservers;

        # for websocket
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # for passing client meta to upstream server
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # for buffer the responses from the proxied server
        proxy_buffering on;
    }
}
```

`cat /etc/nginx/sites-available/gate`
```
server {
    listen 443 ssl http2;
    ssl_certificate     /etc/nginx/ssl/cloudflare-cert.pem;
    ssl_certificate_key /etc/nginx/ssl/cloudflare-key.pem;

    server_name gate.fishprovider.com;

    location / {
        proxy_pass http://localhost:8001;

        # for websocket
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # for passing client meta to upstream server
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # for buffer the responses from the proxied server
        proxy_buffering on;
    }
}
```

`cat /etc/nginx/sites-available/pay`
```
server {
    listen 443 ssl http2;
    ssl_certificate     /etc/nginx/ssl/cloudflare-cert.pem;
    ssl_certificate_key /etc/nginx/ssl/cloudflare-key.pem;

    server_name pay.fishprovider.com;

    location / {
        proxy_pass http://localhost:8020;

        # for websocket
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # for passing client meta to upstream server
        proxy_set_header Host $hos  t;
        proxy_set_header X-ReaIP $remote_addr;
        proxy_set_header Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # for buffer the responses from the proxied server
        proxy_buffering   on;
    }
}
```

`cat /etc/nginx/sites-available/mon`
```
server {
    listen 443 ssl http2;
    ssl_certificate     /etc/nginx/ssl/cloudflare-cert.pem;
    ssl_certificate_key /etc/nginx/ssl/cloudflare-key.pem;

    server_name mon.fishprovider.com;

    location / {
        proxy_pass http://localhost:8000;

        # for websocket
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # for passing client meta to upstream server
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # for buffer the responses from the proxied server
        proxy_buffering on;
    }
}
```

`ln -s /etc/nginx/sites-available/my-proxy /etc/nginx/sites-enabled/`

`ls /etc/nginx/sites-enabled/`
```
back -> /etc/nginx/sites-available/back
back-secondary -> /etc/nginx/sites-available/back-secondary
default -> /etc/nginx/sites-available/default
gate -> /etc/nginx/sites-available/gate
mon -> /etc/nginx/sites-available/mon
pay -> /etc/nginx/sites-available/pay
root -> /etc/nginx/sites-available/root
www -> /etc/nginx/sites-available/www
www-secondary -> /etc/nginx/sites-available/www-secondary
```
