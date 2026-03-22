import * as vscode from "vscode";
import { detectPort } from "./portDetector";
import { startTunnel } from "./tunnelManager";
import * as QRCode from "qrcode";



export function activate(context: vscode.ExtensionContext) {

  const cmd = vscode.commands.registerCommand(
    "pocketpreview.start",
    async () => {
      try {
        vscode.window.showInformationMessage("🔍 Detecting dev server...");

        const port = await detectPort();

        if (!port) {
          vscode.window.showErrorMessage("❌ No running dev server found");
          return;
        }

        vscode.window.showInformationMessage(`🚀 Starting tunnel on port ${port}...`);

        const publicUrl = await startTunnel(port);

        const qr =await QRCode.toDataURL(publicUrl);

        const panel = vscode.window.createWebviewPanel(
          "pocketPreview",
          "📱 Preview on phone",
          vscode.ViewColumn.One,
          {
            enableScripts: true,
          }
        );
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

      } catch (error: any) {
        vscode.window.showErrorMessage(`❌ ${error.message}`);
        console.error("EXT ERROR:", error);
      }
    }
  );

  context.subscriptions.push(cmd);
}

export function deactivate() {}