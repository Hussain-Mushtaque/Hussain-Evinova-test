import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const TestUtils = {
  // App URLs
  APP_URL: "http://localhost:8000",
  API_URL: "http://localhost:3000",

  // Wait for servers to be ready
  async waitForServerReady(url, maxAttempts = 30, delay = 1000) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          console.log(`✅ Server ready at ${url}`);
          return true;
        }
      } catch (error) {
        // Server not ready yet
      }

      console.log(
        `⏳ Waiting for server at ${url}... (attempt ${i + 1}/${maxAttempts})`
      );
      await this.delay(delay);
    }

    throw new Error(
      `❌ Server at ${url} did not become ready after ${maxAttempts} attempts`
    );
  },
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  async startBackendServer() {
    console.log("🚀 Starting backend server...");
    const backendProcess = exec("npm start", {
      cwd: "/Users/mushtaqhussain/Documents/test/mushtaq-Evinova-test/server",
    });

    await this.delay(2000);

    return backendProcess;
  },

  async startFrontendServer() {
    console.log("🚀 Starting frontend server...");
    const frontendProcess = exec("npm run dev", {
      cwd: "/Users/mushtaqhussain/Documents/test/mushtaq-Evinova-test/client",
    });

    await this.delay(5000);

    return frontendProcess;
  },

  stopProcess(process) {
    if (process && !process.killed) {
      process.kill("SIGTERM");
    }
  },

  POKEMON_NAMES: ["Pikachu", "Charmander", "Squirtle"],
  getRandomPokemon() {
    return this.POKEMON_NAMES[
      Math.floor(Math.random() * this.POKEMON_NAMES.length)
    ];
  },

  getTwoDifferentPokemon() {
    const first = this.getRandomPokemon();
    let second = this.getRandomPokemon();
    while (second === first) {
      second = this.getRandomPokemon();
    }
    return [first, second];
  },
};