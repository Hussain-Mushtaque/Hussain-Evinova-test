# E2E Testing Setup for Pokémon Battle App

This directory contains end-to-end tests for the Pokémon Battle application using TestCafe.

## 🚀 Quick Start

### Run E2E Tests (Automated Setup)
```bash
# From the root directory, run the complete e2e test suite
cd client  
npm run test:e2e
```

This command will:
1. Automatically start the backend server (localhost:3000)
2. Automatically start the frontend dev server (localhost:8000)
3. Run all e2e tests in headless Chrome
4. Clean up and stop servers when done

### Manual Test Execution

### Option 1 — Docker *(recommended)*

Spin up both servers with one command:

```bash
docker compose up -d


But If you prefer to manage servers manually:

1. **Start the backend server:**
   ```bash
   cd server && npm install && npm start
   ```

2. **Start the frontend server:**
   ```bash
   cd client && npm install && npm run dev
   ```

### Run tests in different browsers:**
   ```bash
   cd client       # <-- important!
   # Headless Chrome (default)
   npm run test:e2e:headless
   
   # Chrome with GUI
   npm run test:e2e:chrome
   
   # Firefox
   npm run test:e2e:firefox
   
   # Safari (macOS only)
   npm run test:e2e:safari
   
   # Multiple browsers
   npm run test:e2e:all

   Tip: All test:e2e* scripts live in client/package.json, so you need to be inside client/ for npm/yarn/pnpm to find them.
   ```

## 🧪 Test Coverage

The e2e tests cover the following scenarios:

### ✅ **Page Loading & UI**
- Main page displays correctly with all elements
- Pokemon options load in dropdowns
- Responsive design across different screen sizes

### ✅ **Pokemon Selection**
- Prevents selecting the same Pokemon twice
- Shows Pokemon information when selected
- Enables/disables battle button appropriately

### ✅ **Battle Functionality**
- Performs complete battles successfully
- Displays battle results with winner/loser
- Shows battle summary and scores
- Displays type effectiveness information

### ✅ **Reset & Multiple Battles**
- Resets battle state correctly
- Handles multiple consecutive battles
- Maintains UI state consistency

### ✅ **Error Handling**
- Graceful handling of server connectivity issues
- User-friendly error messages

## 🔧 Configuration

### TestCafe Configuration (`.testcaferc.js`)
- **Default Browser**: Chrome headless
- **Screenshots**: Enabled on test failures
- **Timeouts**: Optimized for app performance
- **Concurrent Tests**: 1 (to avoid server conflicts)

### ⏱️ **Intentional Slow Speed for Visual Demonstration**

The e2e tests have been **intentionally configured** to run slowly for demonstration and visual verification purposes:

#### 🐌 **Speed Settings:**
- **TestCafe Speed**: Set to `0.1` (10% of normal speed)
- **Cursor Movement**: Very slow and deliberate
- **Action Delays**: Strategic `await t.wait()` pauses added throughout tests

#### 🎯 **Why Slow Speed?**
1. **Visual Verification**: Allows developers to see each action clearly
2. **Demonstration**: Perfect for showing the app functionality to stakeholders
3. **Debugging**: Easy to spot UI issues when actions are slow
4. **User Experience Testing**: Mimics careful user interactions

#### ⏸️ **Strategic Wait Times Added:**
- **1-3 seconds** between major actions (dropdown clicks, button clicks)
- **2-3 seconds** after selections to observe UI updates
- **Console logging** with step-by-step progress indicators
- **Visual cues** ("👆 Clicking on first dropdown...") before each action

#### 🚀 **For Faster Execution:**
If you need faster test execution for CI/CD or development cycles, you can:
```bash
# Modify .testcaferc.js speed setting from 0.1 to 1.0
# Reduce wait times in the test file
# Use headless mode: npm run test:e2e:headless
```

**Note:** The slow speed is a **feature, not a bug** - designed to showcase the smooth user journey and provide excellent visual feedback during test execution.

### Customization
You can modify test behavior by:
- Changing browser settings in `.testcaferc.js`
- Adjusting timeouts in `TestUtils.js`
- Adding new test scenarios in `pokemon-battle.test.js`

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000 and 8000 are available
2. **Server startup time**: Tests automatically wait for servers, but you can increase timeouts in `TestUtils.js` if needed
3. **Browser issues**: If Chrome headless fails, try running with `npm run test:e2e:chrome` for debugging

### Debug Mode
Run tests with visible browser for debugging:
```bash
npm run test:e2e:chrome
```

### Test Reports
- Screenshots of failed tests are saved in `e2e/screenshots/`
- TestCafe generates detailed console output with test results

## 🚀 Adding New Tests

To add new test scenarios:

1. Add test cases to `pokemon-battle.test.js`
2. Update `PokemonBattlePage.js` if new page elements are needed
3. Add utility functions to `TestUtils.js` if needed

Example test structure:
```javascript
test('Should handle new scenario', async t => {
  await page.waitForPageLoad();
  
  // Your test steps here
  await page.selectFirstPokemon('Pikachu (electric)');
  
  // Assertions
  await t.expect(someCondition).ok('Description of what should happen');
});
```
