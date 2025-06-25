import { Selector } from "testcafe";

fixture("E2E Setup Verification").page("http://localhost:8000");

test("Verify basic page accessibility", async (t) => {
  const title = Selector("h1");

  await t
    .expect(title.exists)
    .ok("Page should load and display title")
    .expect(title.textContent)
    .contains("Pokémon", "Title should contain Pokémon");
});
