"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const portDetector_1 = require("./portDetector");
const tunnelManager_1 = require("./tunnelManager");
const QRCode = __importStar(require("qrcode"));
const cloudFlareChecker_1 = require("./cloudFlareChecker");
function activate(context) {
    const cmd = vscode.commands.registerCommand("pocketpreview.start", async () => {
        try {
            const isInstalled = await (0, cloudFlareChecker_1.checkCloudflared)();
            if (!isInstalled) {
                return;
            }
            vscode.window.showInformationMessage("🔍 Detecting dev server...");
            const port = await (0, portDetector_1.detectPort)();
            if (!port) {
                vscode.window.showErrorMessage("❌ No running dev server found");
                return;
            }
            vscode.window.showInformationMessage(`🚀 Starting tunnel on port ${port}...`);
            const publicUrl = await (0, tunnelManager_1.startTunnel)(port);
            let qr = "";
            try {
                qr = await QRCode.toDataURL(publicUrl);
            }
            catch {
                qr = "";
                vscode.window.showWarningMessage("⚠️ Failed to generate QR code, URL will still be shown.");
            }
            const panel = vscode.window.createWebviewPanel("pocketPreview", "📱 Preview on phone", vscode.ViewColumn.One, {
                enableScripts: true,
            });
            panel.webview.html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      font-family: var(--vscode-font-family);
      color: var(--vscode-foreground);
      background-color: var(--vscode-editor-background);
    }

    .container {
      text-align: center;
      padding: 24px;
      border-radius: 8px;
      background: var(--vscode-welcomePage-tileBackground);
      border: 1px solid var(--vscode-widget-border);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      max-width: 320px;
    }

    h1 {
      font-size: 1.4rem;
      margin-bottom: 16px;
      color: var(--vscode-settings-headerForeground);
    }

    #qr-wrapper {
      background: white; /* Necessary for QR scanning reliability */
      padding: 12px;
      border-radius: 4px;
      display: inline-block;
      margin-bottom: 16px;
    }

    #qr {
      display: block;
      width: 180px;
      height: 180px;
    }

    .url-box {
      background: var(--vscode-textCodeBlock-background);
      padding: 8px;
      border-radius: 4px;
      font-family: var(--vscode-editor-font-family);
      font-size: 0.85rem;
      word-break: break-all;
      margin-bottom: 16px;
      border: 1px solid var(--vscode-panel-border);
    }

    a {
      color: var(--vscode-textLink-foreground);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    button {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      padding: 8px 16px;
      font-size: 13px;
      border-radius: 2px;
      cursor: pointer;
      width: 100%;
      transition: background 0.2s;
    }

    button:hover {
      background: var(--vscode-button-hoverBackground);
    }

    .footer-note {
      margin-top: 16px;
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
      line-height: 1.4;
    }

    .error-text {
      color: var(--vscode-errorForeground);
      font-weight: bold;
    }
  </style>
</head>
<body>

  <div class="container">
    <h1>📱 Pocket Preview</h1>
    
    <div id="qr-wrapper">
      <img id="qr" src="${qr}" alt="QR Code" />
    </div>

    <div class="url-box">
      <a href="${publicUrl}" target="_blank" id="urlText">${publicUrl}</a>
    </div>

    <button id="copyBtn">Copy URL</button>

    <div class="footer-note">
      <span class="error-text">Link not working?</span><br>
      Run the <b>Pocket Preview</b> command again to regenerate the tunnel.
    </div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    const copyBtn = document.getElementById('copyBtn');

    copyBtn.addEventListener('click', () => {
      const url = document.getElementById('urlText').innerText;
      navigator.clipboard.writeText(url);
      
      // Visual feedback
      const originalText = copyBtn.innerText;
      copyBtn.innerText = '✅ Copied to Clipboard';
      copyBtn.style.background = 'var(--vscode-button-secondaryBackground)';
      
      setTimeout(() => {
        copyBtn.innerText = originalText;
        copyBtn.style.background = 'var(--vscode-button-background)';
      }, 2000);
    });
  </script>
</body>
</html>
`;
            console.log("FINAL URL:", publicUrl);
        }
        catch (error) {
            vscode.window.showErrorMessage(`❌ ${error.message}`);
            console.error("EXT ERROR:", error);
        }
    });
    context.subscriptions.push(cmd);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map