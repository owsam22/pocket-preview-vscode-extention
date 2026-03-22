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
function activate(context) {
    const cmd = vscode.commands.registerCommand("pocketpreview.start", async () => {
        try {
            vscode.window.showInformationMessage("🔍 Detecting dev server...");
            const port = await (0, portDetector_1.detectPort)();
            if (!port) {
                vscode.window.showErrorMessage("❌ No running dev server found");
                return;
            }
            vscode.window.showInformationMessage(`🚀 Starting tunnel on port ${port}...`);
            const publicUrl = await (0, tunnelManager_1.startTunnel)(port);
            const qr = await QRCode.toDataURL(publicUrl);
            const panel = vscode.window.createWebviewPanel("pocketPreview", "📱 Preview on phone", vscode.ViewColumn.One, {
                enableScripts: true,
            });
            panel.webview.html = `
        <html>
          <body style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif;">
            <h1>📱 Scan to Preview</h1>
            <img src="${qr}" alt="QR Code" />
          </body>
        </html>

        <button onclick="navigator.clipboard.writeText('${publicUrl}')" style="position:absolute; bottom:20px; padding:10px 20px; font-size:16px; cursor:pointer;">
          Copy URL
        </button>
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
