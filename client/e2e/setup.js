import { spawn } from "child_process";
import { promisify } from "util";
import fetch from "node-fetch";

const delay = promisify(setTimeout);

class TestSetup {
  constructor() {
    this.backendProcess = null;
    this.frontendProcess = null;
    this.isSetup = false;
  }

  async waitForServer(url, maxAttempts = 30, delayMs = 1000) {
    console.log(`⏳ Waiting for server at ${url}...`);

    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          console.log(`✅ Server ready at ${url}`);
          return true;
        }
      } catch (error) {}

      console.log(`   Attempt ${i + 1}/${maxAttempts}...`);
      await delay(delayMs);
    }

    throw new Error(
      `❌ Server at ${url} did not become ready after ${maxAttempts} attempts`
    );
  }

  async startBackend() {
    console.log("🚀 Starting backend server...");
    try {
      const response = await fetch("http://localhost:3000/api/health");
      if (response.ok) {
        console.log("✅ Backend server already running");
        return;
      }
    } catch (error) {
      // Server not running, start it
    }

    this.backendProcess = spawn("npm", ["start"], {
      cwd: "../server",
      stdio: "pipe",
      shell: true,
    });

    this.backendProcess.stdout.on("data", (data) => {
      console.log(`[Backend] ${data.toString().trim()}`);
    });

    this.backendProcess.stderr.on("data", (data) => {
      console.error(`[Backend Error] ${data.toString().trim()}`);
    });
    await this.waitForServer("http://localhost:3000/api/health");
  }

  async startFrontend() {
    console.log("🚀 Starting frontend server...");
    try {
      const response = await fetch("http://localhost:8000");
      if (response.ok) {
        console.log("✅ Frontend server already running on port 8000");
        return;
      }
    } catch (error) {
      // Server not running, start it
    }

    this.frontendProcess = spawn("npm", ["run", "dev"], {
      cwd: ".",
      stdio: "pipe",
      shell: true,
    });

    this.frontendProcess.stdout.on("data", (data) => {
      console.log(`[Frontend] ${data.toString().trim()}`);
    });

    this.frontendProcess.stderr.on("data", (data) => {
      console.error(`[Frontend Error] ${data.toString().trim()}`);
    });
    await this.waitForServer("http://localhost:8000");
  }

  async setup() {
    if (this.isSetup) return;

    console.log("🔧 Setting up test environment...");

    try {
      await this.startBackend();
      await this.startFrontend();

      console.log("✅ Test environment ready!");
      this.isSetup = true;
    } catch (error) {
      console.error("❌ Failed to setup test environment:", error.message);
      await this.cleanup();
      throw error;
    }
  }

  async cleanup() {
    console.log("🧹 Cleaning up test environment...");

    if (this.frontendProcess && !this.frontendProcess.killed) {
      this.frontendProcess.kill("SIGTERM");
      console.log("🛑 Frontend server stopped");
    }

    if (this.backendProcess && !this.backendProcess.killed) {
      this.backendProcess.kill("SIGTERM");
      console.log("🛑 Backend server stopped");
    }

    this.isSetup = false;
  }
}
const testSetup = new TestSetup();

process.on("SIGINT", async () => {
  console.log("\n⚠️  Received SIGINT, cleaning up...");
  await testSetup.cleanup();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n⚠️  Received SIGTERM, cleaning up...");
  await testSetup.cleanup();
  process.exit(0);
});

export default testSetup;
