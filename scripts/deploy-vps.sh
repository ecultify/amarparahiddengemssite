#!/usr/bin/env bash
# Ship this repo to the VPS and run it behind nginx. Re-runnable: later calls
# just sync changed files, rebuild and restart.
set -euo pipefail

HOST="${1:-root@200.234.47.136}"
APP=/var/www/amarpara

ssh "$HOST" "mkdir -p $APP"

echo "==> syncing source to $HOST:$APP"
rsync -az --delete \
  --exclude node_modules --exclude .next --exclude .git \
  --exclude '*.zip' --exclude '*.psd' --exclude '*.docx' --exclude '*.pptx' \
  --exclude tsconfig.tsbuildinfo --exclude _to_delete --exclude .env.local \
  ./ "$HOST:$APP/"

# Only send env when running from a machine that has it; CI does not.
if [ -f .env.local ]; then
  echo "==> env"
  scp -q .env.local "$HOST:$APP/.env.local"
fi

echo "==> building and starting on the server"
ssh "$HOST" APP="$APP" bash -s <<'REMOTE'
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive

# Node 22 + nginx, once.
if ! command -v node >/dev/null || [ "$(node -v | cut -d. -f1)" != "v22" ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
command -v nginx >/dev/null || apt-get install -y nginx
command -v pm2  >/dev/null || npm install -g pm2

cd "$APP"
npm ci --omit=dev --ignore-scripts || npm install --omit=dev
npm install --no-save --ignore-scripts   # build needs the dev deps too
npm run build

pm2 delete amarpara 2>/dev/null || true
pm2 start npm --name amarpara -- start
pm2 save
pm2 startup systemd -u root --hp /root >/dev/null

# Written once, on a bare box. Never rewritten: certbot edits this file to add
# the TLS server block, and clobbering it on every deploy takes HTTPS down.
if [ ! -f /etc/nginx/sites-available/amarpara ]; then
  cat >/etc/nginx/sites-available/amarpara <<'CONF'
server {
  listen 80 default_server;
  server_name _;
  client_max_body_size 25m;          # the submission form accepts 25MB photos
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
  }
}
CONF
  ln -sf /etc/nginx/sites-available/amarpara /etc/nginx/sites-enabled/amarpara
  rm -f /etc/nginx/sites-enabled/default
fi
nginx -t && systemctl reload nginx

pm2 status amarpara
REMOTE

echo "==> done: http://${HOST#*@}/"
