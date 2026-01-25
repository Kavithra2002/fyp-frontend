import { NextRequest, NextResponse } from "next/server";
import { spawn, type ChildProcessWithoutNullStreams } from "child_process";
import path from "path";
import fs from "fs";

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

declare global {
  // eslint-disable-next-line no-var
  var __fypBackendProc: ChildProcessWithoutNullStreams | undefined;
}

export async function POST(request: NextRequest) {
  try {
    // Security: Only allow in development
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, message: "Backend start is only available in development mode" },
        { status: 403 }
      );
    }

    const backendPath = path.join(process.cwd(), "..", "backend");
    
    // Check if backend directory exists
    if (!fs.existsSync(backendPath)) {
      return NextResponse.json(
        { success: false, message: "Backend directory not found" },
        { status: 404 }
      );
    }

    // Check if backend package.json exists
    const packageJsonPath = path.join(backendPath, "package.json");
    if (!fs.existsSync(packageJsonPath)) {
      return NextResponse.json(
        { success: false, message: "Backend package.json not found" },
        { status: 404 }
      );
    }

    // Try to start the backend
    // Note: On Windows, we need to use different commands
    const isWindows = process.platform === "win32";
    const backendPort = Number(process.env.BACKEND_PORT || 4000);

    // On Windows, .cmd files (npm.cmd) cannot be spawned reliably without a shell.
    // To avoid opening a new console window, we spawn `cmd.exe` hidden.
    const command = isWindows ? "cmd.exe" : "npm";
    const args = isWindows ? ["/d", "/s", "/c", "npm", "run", "dev"] : ["run", "dev"];

    // If already running, just report status
    const healthUrl = `http://localhost:${backendPort}/health`;
    try {
      const res = await fetch(healthUrl, { method: "GET", cache: "no-store" });
      if (res.ok) {
        return NextResponse.json({
          success: true,
          message: `Backend already running at http://localhost:${backendPort}`,
          port: backendPort,
        });
      }
    } catch {
      // not running (or not reachable) - proceed to spawn
    }

    // Spawn backend WITHOUT opening a new cmd window.
    // Note: you cannot attach this to an existing separate "backend terminal" session.
    const backendProcess = spawn(command, args, {
      cwd: backendPath,
      detached: false,
      shell: false,
      windowsHide: true,
      env: {
        ...process.env,
        // IMPORTANT: Next.js dev sets PORT=3000; don't let backend inherit it.
        PORT: String(backendPort),
      },
      stdio: ["ignore", "pipe", "pipe"],
    });

    globalThis.__fypBackendProc = backendProcess;

    const prefix = "[backend]";
    backendProcess.stdout.on("data", (chunk) => {
      process.stdout.write(`${prefix} ${chunk.toString()}`);
    });
    backendProcess.stderr.on("data", (chunk) => {
      process.stderr.write(`${prefix} ${chunk.toString()}`);
    });
    backendProcess.on("exit", (code, signal) => {
      console.log(`${prefix} exited (code=${code}, signal=${signal})`);
      if (globalThis.__fypBackendProc === backendProcess) globalThis.__fypBackendProc = undefined;
    });

    // Wait until backend responds (or timeout)
    const timeoutMs = 8000;
    const intervalMs = 400;

    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const res = await fetch(healthUrl, { method: "GET", cache: "no-store" });
        if (res.ok) {
          return NextResponse.json({
            success: true,
            message: `Backend is running at http://localhost:${backendPort}`,
            port: backendPort,
          });
        }
      } catch {
        // still starting
      }
      await sleep(intervalMs);
    }

    return NextResponse.json(
      {
        success: false,
        message:
          `Backend did not become ready at ${healthUrl}. ` +
          "If port 4000 is already in use, stop that process and try again.",
        suggestion:
          "Manual start:\n1) cd E:\\FYP\\backend\n2) npm run dev\n\nOr start both:\n1) cd E:\\FYP\\frontend\n2) npm run dev:all",
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error starting backend:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
        suggestion: "Please start the backend manually:\n1. Open terminal\n2. cd ../backend\n3. npm run dev",
      },
      { status: 500 }
    );
  }
}
