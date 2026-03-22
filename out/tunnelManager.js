"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTunnel = startTunnel;
async function startTunnel(port) {
    const { execa } = await import("execa");
    const process = execa("cloudflared", [
        "tunnel",
        "--url",
        `http://localhost:${port}`,
        "--no-autoupdate"
    ]);
    return new Promise((resolve, reject) => {
        let resolved = false;
        const handleData = (data) => {
            const text = data.toString();
            console.log("CF:", text);
            const match = text.match(/https:\/\/[a-zA-Z0-9.-]+trycloudflare\.com/);
            if (match && !resolved) {
                resolved = true;
                resolve(match[0]);
            }
        };
        process.stdout?.on("data", handleData);
        process.stderr?.on("data", handleData);
        process.on("error", (err) => reject(err));
        setTimeout(() => {
            if (!resolved)
                reject(new Error("Tunnel URL not found"));
        }, 15000);
    });
}
//# sourceMappingURL=tunnelManager.js.map