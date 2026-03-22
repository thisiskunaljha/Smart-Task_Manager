# Smart Task Manager - PWA (Progressive Web App)

A fully functional Progressive Web App for managing tasks with priorities, deadlines, and offline support.

## ✨ PWA Features

✅ **Installable** - Install directly on your device (iOS, Android, Windows, Mac)
✅ **Offline First** - Works completely offline with automatic syncing
✅ **Fast** - Lightning-fast performance with intelligent caching
✅ **Responsive** - Optimized for all screen sizes
✅ **Secure** - Uses HTTPS (required for PWAs)
✅ **App-like** - Feels like a native app with standalone mode

## 🚀 Quick Start

### Option 1: Local Development
```bash
# Start a local web server (Python 3)
python3 -m http.server 8000

# Or with Node.js
npx http-server

# Or with Ruby
ruby -run -ehttpd . -p8000
```

Then open `https://localhost:8000` in your browser.

### Option 2: Deploy to Web Server
Upload all files to your web server (must support HTTPS).

## 📋 Files Overview

- **index.html** - Main application with service worker registration
- **manifest.json** - PWA manifest with app metadata, icons, and shortcuts
- **sw.js** - Service worker with offline support and caching strategies

## 🔧 How to Install (Users)

### Desktop (Chrome, Edge)
1. Open the app in your browser
2. Click the "Install App" button (or look for the install icon in the address bar)
3. Click "Install"

### Mobile (iOS)
1. Open Safari and navigate to the app
2. Tap the Share button (↑ arrow)
3. Select "Add to Home Screen"
4. Tap "Add"

### Mobile (Android/Chrome)
1. Open Chrome and navigate to the app
2. Tap the menu (⋮)
3. Select "Install app" or "Create shortcut"
4. Tap "Install"

## 🌐 Server Configuration

### For Apache (.htaccess)
Create a `.htaccess` file in your root directory:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  # Redirect all requests to index.html for SPA routing
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [QSA,L]
</IfModule>

# Enable gzip compression
<IfModule mod_gzip.c>
  mod_gzip_on Yes
  mod_gzip_level 6
  mod_gzip_types text/plain text/html text/xml text/javascript application/javascript
</IfModule>

# Set cache headers for static assets
<FilesMatch "\.(js|css|svg|woff|woff2)$">
  Header set Cache-Control "max-age=31536000, public"
</FilesMatch>

# Set cache headers for HTML
<FilesMatch "\.html$">
  Header set Cache-Control "no-cache, must-revalidate"
</FilesMatch>

# HTTPS headers
Header set Strict-Transport-Security "max-age=31536000; includeSubDomains" env=HTTPS
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "SAMEORIGIN"
Header set X-XSS-Protection "1; mode=block"
```

### For Nginx
```nginx
server {
  listen 443 ssl http2;
  server_name your-domain.com;

  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;

  # Enable gzip
  gzip on;
  gzip_types text/plain text/html text/xml text/javascript application/javascript application/json;

  # Cache control
  location ~* \.(js|css|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  location ~ \.html$ {
    expires -1;
    add_header Cache-Control "no-cache, must-revalidate";
  }

  # SPA routing
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Security headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
}

# Redirect HTTP to HTTPS
server {
  listen 80;
  server_name your-domain.com;
  return 301 https://$server_name$request_uri;
}
```

## 🔒 HTTPS Requirement

PWAs REQUIRE HTTPS (except localhost). Use free SSL certificates:

- **Let's Encrypt** (Free): `https://letsencrypt.org`
- **Cloudflare** (Free): `https://www.cloudflare.com`
- **Firebase Hosting** (Free): `https://firebase.google.com/hosting`

## 📱 Testing the PWA

### Chrome DevTools
1. Open DevTools (F12)
2. Go to **Application → Manifest**
3. Check manifest is valid
4. Go to **Application → Service Workers**
5. Verify service worker is registered and active

### Lighthouse Audit
1. Open DevTools
2. Go to **Lighthouse**
3. Select "Progressive Web App"
4. Click "Analyze page load"

## 🎯 Offline Capabilities

- ✅ App loads offline
- ✅ Tasks are stored locally in IndexedDB/localStorage
- ✅ Changes sync automatically when online
- ✅ Works on airplane mode

## 📦 Deployment Checklist

- [ ] All files are served over HTTPS
- [ ] manifest.json is valid
- [ ] Service worker is registered
- [ ] Icons are displayed correctly
- [ ] App is installable
- [ ] App works offline
- [ ] Responsive design passes mobile tests
- [ ] Lighthouse PWA score > 90

## 🚀 Update Service Worker

To update the app version, increment the cache version in `sw.js`:

```javascript
const CACHE_NAME = 'task-manager-v2'; // Changed from v1
```

## 📞 Support

For PWA issues, refer to:
- [MDN Web Docs - PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google PWA Documentation](https://web.dev/progressive-web-apps/)
- [Web.dev PWA Checklist](https://web.dev/pwa-checklist/)

---

**Built with ❤️ as a Progressive Web App**
