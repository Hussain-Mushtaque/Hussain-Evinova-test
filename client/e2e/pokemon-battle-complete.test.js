import { Selector } from "testcafe";
import PokemonBattlePage from "./pages/PokemonBattlePage.js";
import { TestUtils } from "./utils/TestUtils.js";

fixture("Pokémon Battle App - Complete E2E Journey")
  .page(TestUtils.APP_URL)
  .beforeEach(async (t) => {
    console.log("🎮 Starting Pokémon Battle E2E Journey...");
    console.log("⏱️ Running in slow mode for visual demonstration...");
    await t.wait(2000);
  });

const page = new PokemonBattlePage();

test("Complete E2E Journey: Load → Select → Battle → Result", async (t) => {
  console.log("📱 Step 1: Loading application and verifying main page...");

  // 1. Verify page loads correctly
  await page.waitForPageLoad();
  await t.wait(500); // Pause to see page fully loaded

  await t.expect(page.title.exists).ok("✅ Main page loaded successfully");
  await t.expect(page.title.textContent).contains("Pokémon Battle Simulator");
  console.log("✅ Page title verified: Pokémon Battle Simulator");
  await t.wait(300);

  // Verify UI elements are present
  await t
    .expect(page.firstPokemonSelect.exists)
    .ok("First Pokemon dropdown present");
  await t
    .expect(page.secondPokemonSelect.exists)
    .ok("Second Pokemon dropdown present");
  await t.expect(page.battleButton.exists).ok("Battle button present");
  console.log("✅ All UI elements loaded correctly");
  await t.wait(300);

  console.log("🔍 Step 2: Verifying Pokemon options are loaded...");

  const firstPokemonOptions = await page.getAvailablePokemon(
    page.firstPokemonSelect
  );
  await t
    .expect(firstPokemonOptions.length)
    .gte(3, "Should have Pokemon options loaded");
  console.log(
    `✅ ${firstPokemonOptions.length} Pokemon options loaded successfully`
  );
  await t.wait(300);

  const expectedPokemon = ["Pikachu", "Charmander", "Squirtle"];
  for (const pokemon of expectedPokemon) {
    await t
      .expect(firstPokemonOptions.some((opt) => opt.includes(pokemon)))
      .ok(`${pokemon} should be available`);
  }
  console.log(
    "✅ All expected Pokemon (Pikachu, Charmander, Squirtle) are available"
  );
  await t.wait(300);

  console.log("⚡ Step 3: Selecting first Pokemon (Pikachu)...");
  console.log("👆 Clicking on first dropdown...");

  await t.wait(300);
  await page.selectFirstPokemon("Pikachu");
  console.log("🎯 First Pokemon selected!");
  await t.wait(500);

  await t
    .expect(page.firstPokemonInfo.exists)
    .ok("First Pokemon info should be displayed");
  await t.expect(page.firstPokemonInfo.textContent).contains("Pikachu");
  console.log("✅ Pikachu selected and info displayed");
  await t.wait(800);
  await t
    .expect(await page.isBattleButtonEnabled())
    .notOk("Battle button should still be disabled");
  console.log(
    "✅ Battle button correctly disabled (only one Pokemon selected)"
  );
  await t.wait(300);

  console.log("🔥 Step 4: Selecting second Pokemon (Charmander)...");
  console.log("👆 Clicking on second dropdown...");

  await t.wait(300);
  await page.selectSecondPokemon("Charmander");
  console.log("🎯 Second Pokemon selected!");
  await t.wait(500);
  await t
    .expect(page.secondPokemonInfo.exists)
    .ok("Second Pokemon info should be displayed");
  await t.expect(page.secondPokemonInfo.textContent).contains("Charmander");
  console.log("✅ Charmander selected and info displayed");
  await t.wait(500);
  await t
    .expect(await page.isBattleButtonEnabled())
    .ok("Battle button should be enabled");
  console.log("✅ Battle button enabled (both Pokemon selected)");
  await t.wait(500); // Pause to observe button becoming enabled

  console.log("⚔️ Step 5: Starting the battle...");
  console.log("👆 Clicking the BATTLE button...");

  // 5. Start the battle with dramatic pause
  await t.wait(500); // Pause before clicking battle button
  await page.startBattle();
  console.log("🎯 Battle initiated! Waiting for results...");
  await t.wait(1000); // Brief pause after clicking

  // Wait for battle results
  await t
    .expect(page.battleResult.exists)
    .ok("Battle result should be displayed", { timeout: 15000 });
  console.log("✅ Battle completed! Results are now visible");
  await t.wait(1000); // Longer pause to see battle results appear

  console.log("🏆 Step 6: Verifying battle results...");

  // 6. Verify battle results
  const winnerText = await page.getWinnerText();
  await t
    .expect(winnerText)
    .match(
      /(Pikachu|Charmander) Wins!|It's a Draw!/,
      "Winner should be declared"
    );
  console.log(`🎉 Battle Result: ${winnerText}`);
  await t.wait(500); // Pause to read battle result

  // Verify battle summary is present
  const battleSummary = await page.getBattleSummary();
  await t
    .expect(battleSummary.length)
    .gt(0, "Battle summary should not be empty");
  console.log(`📊 Battle Summary: ${battleSummary.substring(0, 50)}...`);
  await t.wait(500); // Pause to read battle summary

  // Verify additional battle info sections
  await t
    .expect(page.finalScores.exists)
    .ok("Final scores section should be present");
  await t
    .expect(page.typeEffectiveness.exists)
    .ok("Type effectiveness section should be present");
  console.log("✅ All battle result sections displayed correctly");
  await t.wait(1000);

  console.log("🔄 Step 7: Testing reset functionality...");
  console.log("👆 Clicking the RESET button...");

  await t.wait(500);
  await page.resetBattle();
  console.log("🎯 Reset button clicked!");
  await t.wait(500);

  await t
    .expect(page.battleResult.exists)
    .notOk("Battle result should be hidden after reset");
  await t
    .expect(page.firstPokemonSelect.value)
    .eql("", "First Pokemon select should be reset");
  await t
    .expect(page.secondPokemonSelect.value)
    .eql("", "Second Pokemon select should be reset");
  console.log("✅ Reset functionality working correctly");
  await t.wait(500);
  await t
    .expect(await page.isBattleButtonEnabled())
    .notOk("Battle button should be disabled after reset");
  console.log("✅ UI state properly reset");
  await t.wait(500); // Final pause to observe clean state

  console.log("🎊 E2E Journey Complete! All tests passed successfully! 🎊");
  console.log("===============================================");
  console.log("✅ Page Loading     : PASSED");
  console.log("✅ Pokemon Loading  : PASSED");
  console.log("✅ Pokemon Selection: PASSED");
  console.log("✅ Battle Execution : PASSED");
  console.log("✅ Results Display  : PASSED");
  console.log("✅ Reset Function   : PASSED");
  console.log("===============================================");
});
