"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectPort = detectPort;
const net_1 = __importDefault(require("net"));
const ports = [5173, 3000, 4200, 5500, 8080];
async function detectPort() {
    for (const port of ports) {
        const isOpen = await new Promise((resolve) => {
            const socket = new net_1.default.Socket();
            socket.setTimeout(300);
            socket.once("connect", () => {
                socket.destroy();
                resolve(true);
            });
            socket.once("timeout", () => {
                socket.destroy();
                resolve(false);
            });
            socket.once("error", () => {
                resolve(false);
            });
            socket.connect(port, "localhost"); // important
        });
        console.log(`Checking port ${port}:`, isOpen);
        if (isOpen)
            return port;
    }
    return null;
}
//# sourceMappingURL=portDetector.js.map