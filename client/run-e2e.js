import { spawn } from "child_process";
import testSetup from "./e2e/setup.js";

async function runE2ETests() {
  console.log("🎯 Starting Pokemon Battle E2E Tests");
  console.log("=====================================\n");

  try {
    await testSetup.setup();

    console.log("\n🧪 Running TestCafe tests...\n");
    const testcafe = spawn(
      "npx",
      ["testcafe", "chrome:headless", "e2e/pokemon-battle-complete.test.js"],
      {
        stdio: "inherit",
        shell: true,
      }
    );
    await new Promise((resolve, reject) => {
      testcafe.on("close", (code) => {
        if (code === 0) {
          console.log("\n✅ All E2E tests passed!");
          resolve();
        } else {
          console.log(`\n❌ E2E tests failed with exit code ${code}`);
          reject(new Error(`Tests failed with exit code ${code}`));
        }
      });

      testcafe.on("error", (error) => {
        console.error("\n❌ Error running TestCafe:", error);
        reject(error);
      });
    });
  } catch (error) {
    console.error("\n❌ E2E test execution failed:", error.message);
    process.exit(1);
  } finally {
    await testSetup.cleanup();
    console.log("\n🏁 E2E test execution completed.");
  }
}

process.on("SIGINT", async () => {
  console.log("\n\n⚠️  Test execution interrupted, cleaning up...");
  await testSetup.cleanup();
  process.exit(1);
});

if (import.meta.url === `file://${process.argv[1]}`) {
  runE2ETests().catch(console.error);
}

export default runE2ETests;
