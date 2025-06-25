import testSetup from "./e2e/setup.js";

async function verifySetup() {
  console.log("🔍 Verifying E2E test setup...\n");

  try {
    await testSetup.setup();
    console.log("✅ Server setup successful!");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("✅ E2E test environment verification complete!");
    console.log("\n🎯 Ready to run E2E tests with: npm run test:e2e");
  } catch (error) {
    console.error("❌ Setup verification failed:", error.message);
    process.exit(1);
  } finally {
    await testSetup.cleanup();
  }
}

verifySetup();
