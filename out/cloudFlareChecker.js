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
exports.checkCloudflared = checkCloudflared;
const vscode = __importStar(require("vscode"));
async function checkCloudflared() {
    try {
        const { execa } = await import("execa");
        // Try running cloudflared --version
        const { stdout } = await execa("cloudflared", ["--version"]);
        vscode.window.showInformationMessage(`Cloudflared found: ${stdout}`);
        return true;
    }
    catch {
        // Cloudflared not found
        const downloadUrl = "https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/downloads/";
        const action = "Download Cloudflared";
        vscode.window.showErrorMessage("Cloudflared not found in PATH. It is required for Pocket Preview.\nMake sure to install it and add it to your system PATH.", action).then(selection => {
            if (selection === action) {
                vscode.env.openExternal(vscode.Uri.parse(downloadUrl));
            }
        });
        return false;
    }
}
//# sourceMappingURL=cloudFlareChecker.js.map