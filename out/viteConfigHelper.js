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
exports.ensureViteConfig = ensureViteConfig;
exports.patchViteConfig = patchViteConfig;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function ensureViteConfig(rootPath) {
    const config = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['.trycloudflare.com'],
    hmr: { protocol: 'ws', host: '.trycloudflare.com', clientPort: 443 }
  }
});
`;
    fs.writeFileSync(path.join(rootPath, 'vite.config.js'), config);
}
async function patchViteConfig(configPath) {
    let content = fs.readFileSync(configPath, 'utf-8');
    if (!content.includes('host: true')) {
        content = content.replace(/server:\s*{/, `server: {\n    host: true,`);
    }
    if (!content.includes('allowedHosts')) {
        content = content.replace(/server:\s*{/, `server: {\n    allowedHosts: ['.trycloudflare.com'],`);
    }
    if (!content.includes('hmr:')) {
        content = content.replace(/server:\s*{/, `server: {\n    hmr: { protocol: 'ws', host: '.trycloudflare.com', clientPort: 443 },`);
    }
    fs.writeFileSync(configPath, content);
}
//# sourceMappingURL=viteConfigHelper.js.map