import { Selector, t } from "testcafe";

class PokemonBattlePage {
  constructor() {
    // Main elements
    this.title = Selector("h1").withText("Pokémon Battle Simulator");
    this.loadingIndicator = Selector("div").withText("Connecting to server...");
    this.errorMessage = Selector("div").withAttribute("class", /bg-red-100/);
    this.retryButton = Selector("button").withText("Retry");

    // Pokemon selection
    this.firstPokemonSelect = Selector("select").nth(0);
    this.secondPokemonSelect = Selector("select").nth(1);
    this.firstPokemonLabel = Selector("h3").withText("Select First Pokémon");
    this.secondPokemonLabel = Selector("h3").withText("Select Second Pokémon");

    // Pokemon info display
    this.firstPokemonInfo = Selector(".bg-red-50");
    this.secondPokemonInfo = Selector(".bg-blue-50");

    // Battle controls
    this.battleButton = Selector("button").withText("Start Battle!");
    this.resetButton = Selector("button").withText("Reset");

    // Battle results
    this.battleResult = Selector("h2").withText("Battle Result");
    this.winnerText = Selector("h3").withAttribute("class", /text-green-700/);
    this.battleSummary = Selector("p").withAttribute("class", /text-green-600/);
    this.finalScores = Selector("h4").withText("Final Scores");
    this.typeEffectiveness = Selector("h4").withText("Type Effectiveness");
  }

  async waitForPageLoad() {
    await t.expect(this.title.exists).ok("Page title should be visible");
    await t
      .expect(this.firstPokemonSelect.exists)
      .ok("First Pokemon select should be available", { timeout: 10000 });
  }

  async selectFirstPokemon(pokemonName) {
    await t
      .click(this.firstPokemonSelect)
      .click(this.firstPokemonSelect.find("option").withText(pokemonName));
  }

  async selectSecondPokemon(pokemonName) {
    await t
      .click(this.secondPokemonSelect)
      .click(this.secondPokemonSelect.find("option").withText(pokemonName));
  }

  async startBattle() {
    await t.click(this.battleButton);
  }

  async resetBattle() {
    await t.click(this.resetButton);
  }

  async getAvailablePokemon(selectElement) {
    const options = selectElement.find("option");
    const count = await options.count;
    const pokemon = [];

    for (let i = 1; i < count; i++) {
      // Skip the first "Choose Pokémon..." option
      const optionText = await options.nth(i).textContent;
      pokemon.push(optionText);
    }

    return pokemon;
  }

  async isBattleButtonEnabled() {
    return !(await this.battleButton.hasAttribute("disabled"));
  }

  async hasErrorMessage() {
    return await this.errorMessage.exists;
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent;
  }

  async hasBattleResult() {
    return await this.battleResult.exists;
  }

  async getWinnerText() {
    return await this.winnerText.textContent;
  }

  async getBattleSummary() {
    return await this.battleSummary.textContent;
  }
}

export default PokemonBattlePage;
