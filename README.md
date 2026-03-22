# 📱 Pocket Preview

[![VSCode Marketplace](https://img.shields.io/visual-studio-marketplace/v/owsam22.pocket-preview?color=blue&label=VS%20Code%20Extension)](https://marketplace.visualstudio.com/items?itemName=owsam22.pocket-preview)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub ](https://img.shields.io/github/stars/owsam22/pocket-preview?color=yellow)](https://github.com/owsam22/pocket-preview-vscode-extention)

> Preview your local dev server instantly on any device with a QR code.

---

## 🎬 Demo

**Live Preview on Phone**  

![Live Preview GIF](https://i.pinimg.com/736x/4a/01/e7/4a01e770ddf86966711bb4bf777c3abb.jpg)  

**Automatic Live Reload**  

![Auto Refresh GIF](https://i.pinimg.com/originals/34/da/ef/34daef2cf895d5d07d6fae45b600b930.gif)

---

## ✨ Features

- 🌐 Public live preview of your local project  
- 📱 QR code for instant mobile access  
- 🔄 Automatic live reload on file changes  
- ⚡ Supports **React**, **Vite**, and plain **HTML**  
- 🚀 One-command start  
- ⚙️ Automatically detects dev server port
- 🟢 Checks for CloudFlred installation and guide users

---

## 📦 Installation

### 1. From VS Code Marketplace

Search **Pocket Preview** → click **Install**  

### 2. Manual Install

```bash
code --install-extension pocket-preview-0.0.6.vsix
```

---

## ⚙️ Requirements

* Node.js installed
* Dev server running (`npm run dev`)
* Cloudflare Tunnel (`cloudflared`) installed & in PATH

if CloudFlared is not found ,the extention will prompt you to download it : [download cloudflared](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/downloads/)

> Tunnel generates a public URL for your preview.

---

## 🛠 Setup for Vite Projects

To avoid blocked requests, add this to `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    cors: true,
    allowedHosts: ['.trycloudflare.com'],
    hmr: {
      protocol: 'wss',
      host: '.trycloudflare.com',
      clientPort: 443
    }
  }
})
```

Restart your dev server after updating.

---

## ▶️ How to Use

1. Start your project:

```bash
npm run dev
```

2. Open VS Code Command Palette:

* Windows/Linux: `Ctrl + Shift + P`
* Mac: `Cmd + Shift + P`

3. Run:

```text
Preview on Phone
```

4. Scan the displayed QR code — your live preview opens instantly.

5. Edit files — changes auto-refresh on phone.

---

## ⚠️ Troubleshooting

**QR not showing / No public URL**

* Ensure `cloudflared` is installed and PATH is correct
* Dev server must be running

**Blocked request error**

* Check `allowedHosts` in `vite.config.js`
* Restart server after changes

**Cloudflared not detected**

* install from [cloudflared downloads](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/downloads/)
---

## 📌 Notes

* URL changes each preview session
* Works best with Vite or React
* Live reload is automatic

---

## 🚧 Planned Improvements

* Auto-install Cloudflare Tunnel
* Auto-detect and patch Vite config
* Better device tracking UI

---

## 👨‍💻 Author / Credit

Built by **Sam (owsam22)**

* GitHub: [owsam22](https://github.com/owsam22/pocket-preview)
* LinkedIn: [samarpan22](https://linkedin.com/samarpan22)

---

## 📜 License

MIT License — see [LICENSE](LICENSE)