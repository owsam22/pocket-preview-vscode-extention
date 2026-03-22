import * as vscode from "vscode";


export async function checkCloudflared(): Promise<boolean> {
    try {
        const { execa } = await import("execa");
        // Try running cloudflared --version
        const { stdout } = await execa("cloudflared", ["--version"]);
        vscode.window.showInformationMessage(`Cloudflared found: ${stdout}`);
        return true;
    } catch {
        // Cloudflared not found
        const downloadUrl = "https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/downloads/";
        const action = "Download Cloudflared";

        vscode.window.showErrorMessage(
            "Cloudflared not found in PATH. It is required for Pocket Preview.\nMake sure to install it and add it to your system PATH.",
            action
        ).then(selection => {
            if (selection === action) {
                vscode.env.openExternal(vscode.Uri.parse(downloadUrl));
            }
        });

        return false;
    }
}