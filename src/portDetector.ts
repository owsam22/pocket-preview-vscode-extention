import net from "net";

const ports = [5173,5174, 3000,3001, 4200, 5500, 8080];

export async function detectPort(): Promise<number | null> {
  for (const port of ports) {
    const isOpen = await new Promise<boolean>((resolve) => {
      const socket = new net.Socket();

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

    if (isOpen) return port;
  }

  return null;
}