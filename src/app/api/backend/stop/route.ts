import { NextRequest, NextResponse } from "next/server";
import { spawn, type ChildProcessWithoutNullStreams } from "child_process";

declare global {
  // eslint-disable-next-line no-var
  var __fypBackendProc: ChildProcessWithoutNullStreams | undefined;
}

function isProcessRunning(proc: ChildProcessWithoutNullStreams | undefined) {
  return !!proc && !proc.killed && typeof proc.pid === "number";
}

export async function POST(_request: NextRequest) {
  try {
    // Security: Only allow in development
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, message: "Backend stop is only available in development mode" },
        { status: 403 }
      );
    }

    const proc = globalThis.__fypBackendProc;
    if (!isProcessRunning(proc)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No backend process tracked by the UI. If you started the backend manually, stop it from your terminal.",
        },
        { status: 400 }
      );
    }

    const pid = proc.pid!;
    const isWindows = process.platform === "win32";

    if (isWindows) {
      // Kill the whole process tree quietly (no window).
      spawn("cmd.exe", ["/d", "/s", "/c", "taskkill", "/PID", String(pid), "/T", "/F"], {
        windowsHide: true,
        stdio: "ignore",
        shell: false,
      });
    } else {
      try {
        proc.kill("SIGTERM");
      } catch {
        // ignore
      }
    }

    globalThis.__fypBackendProc = undefined;

    return NextResponse.json({
      success: true,
      message: "Backend stop requested",
    });
  } catch (error) {
    console.error("Error stopping backend:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

