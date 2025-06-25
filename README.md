# Pokemon Battle Simulator

A full-stack Pokemon battle simulator built with Node.js/TypeScript backend and React frontend.

## Features

- 🎮 Battle simulation between any two Pokemon
- 📊 Type effectiveness system (Fire vs Grass, Water vs Fire, etc.)
- 🎯 Stats-based battle calculations
- 🔄 Real-time battle results
- 🧪 Comprehensive test suite
- 🐳 Docker support

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker & Docker Compose (optional)

## Getting Started with Docker

To run the application, you will need to have Docker and Docker Compose installed on your machine.

1. Clone the repository to your local machine.
2. Open a terminal and navigate to the root directory of the repository.
3. Copy `.env-example` as `.env`
4. Copy `docker-compose.override-example.yml` as `docker-compose.override.yml`
5. Start the service by running `docker-compose up`

### 1. Download Pokemon Data

> **Note:** The original link provided in the test wasn’t clickable, so I manually downloaded the Pokémon data here:

```bash
wget https://calmcode.io/static/data/pokemon.json

```

### 2. Backend Setup

```bash
cd server && npm install && npm run dev
```

### 3. Frontend Setup

```bash
cd client && npm install && npm run dev

```

#### Frontend vite.config.ts update

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000,
    host: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});
```

#### Frontend setupTests.ts

```typescript
import "@testing-library/jest-dom";
```

## Running the Application

### Option 1: Docker Compose (Recommended)

```bash
# From project root
docker-compose up --build
```

- Backend: http://localhost:3000
- Frontend: http://localhost:8000

## API Endpoints

### GET /api/pokemon

Returns list of all available Pokemon with names and types.

### POST /api/battle

Simulates a battle between two Pokemon.

**Request Body:**

```json
{
  "pokemon1": "Pikachu",
  "pokemon2": "Charmander"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "winner": {
      "name": "Pikachu",
      "type": ["electric"]
    },
    "loser": {
      "name": "Charmander",
      "type": ["fire"]
    },
    "battleSummary": "Pikachu wins! Base stats: Pikachu (234) vs Charmander (209). No type advantage",
    "stats": {
      "pokemon1Score": 234,
      "pokemon2Score": 209,
      "typeEffectiveness": "No type advantage"
    }
  }
}
```

## Battle System

The battle system uses a simplified approach:

1. **Base Stats**: Sum of HP + Attack + Defense
2. **Type Effectiveness**: Multiplier based on type matchups:

   - Fire beats Grass and Ice (2x damage)
   - Water beats Fire (2x damage)
   - Grass beats Water (2x damage)
   - Electric beats Water and Flying (2x damage)
   - And more...

3. **Final Score**: Base Stats × Type Effectiveness Multiplier
4. **Winner**: Pokemon with higher final score

## Testing

### Backend Tests

```bash
cd server
npm test

# Watch mode
npm run test:watch
```

### Frontend Tests

```bash
cd client
npm test
```

### Test Coverage

- ✅ Battle logic with known Pokemon
- ✅ API endpoint response format
- ✅ Error handling for invalid Pokemon
- ✅ Component rendering and interactions

### End-to-End (E2E) Tests

The E2E tests use TestCafe to simulate real user interactions and verify the complete application flow.

#### Running E2E Tests

**🖥️ Visual Mode (Chrome Browser) - Recommended for Development**

```bash
cd client && npm install && npm run test:e2e:chrome
```

This opens a visible Chrome browser where you can watch the test:

- ✅ See the cursor moving slowly to each element
- ✅ Watch dropdowns being clicked and Pokemon selected
- ✅ Observe the battle button enabling and battle execution
- ✅ View the complete user journey in real-time

**🤖 Headless Mode (Serverless) - Fast Execution**

```bash
cd client && npm install && npm run test:e2e:headless
```

This runs the test without opening a browser window:

- ✅ Faster execution for CI/CD pipelines
- ✅ No visual interface required
- ✅ Perfect for automated testing environments
- ✅ Console output shows all test progress

#### Other E2E Test Options

```bash
# Run in Firefox
npm run test:e2e:firefox

# Run in Safari
npm run test:e2e:safari

# Run in multiple browsers
npm run test:e2e:all

# Custom runner with setup verification
npm run test:e2e
```

#### E2E Test Features

- 🎯 **Complete User Journey**: Tests the entire flow from page load to battle completion
- 🐌 **Slow Motion**: Runs at 10% speed for easy visual verification
- 📊 **Detailed Logging**: Step-by-step console output with emojis and progress indicators
- 🔄 **Reset Testing**: Verifies the application properly resets after battles
- 📱 **Responsive Testing**: Tests UI at different screen sizes
- ⚡ **Real Data**: Uses actual Pokemon data and API calls

#### What the E2E Test Covers

1. **Page Loading**: Verifies main page loads with all UI elements
2. **Pokemon Loading**: Checks that Pokemon options are loaded in dropdowns
3. **Pokemon Selection**: Tests selecting Pikachu and Charmander
4. **Button Logic**: Verifies battle button enables only when both Pokemon selected
5. **Battle Execution**: Initiates battle and waits for results
6. **Results Display**: Validates winner declaration and battle summary
7. **Reset Functionality**: Tests that reset properly clears all data

#### Console Output Example

```
🎮 Starting Pokémon Battle E2E Journey...
⏱️ Running in slow mode for visual demonstration...
📱 Step 1: Loading application and verifying main page...
✅ Page title verified: Pokémon Battle Simulator
✅ All UI elements loaded correctly
🔍 Step 2: Verifying Pokemon options are loaded...
✅ 3 Pokemon options loaded successfully
⚡ Step 3: Selecting first Pokemon (Pikachu)...
👆 Clicking on first dropdown...
🎯 First Pokemon selected!
✅ Pikachu selected and info displayed
🔥 Step 4: Selecting second Pokemon (Charmander)...
👆 Clicking on second dropdown...
🎯 Second Pokemon selected!
✅ Charmander selected and info displayed
⚔️ Step 5: Starting the battle...
👆 Clicking the BATTLE button...
🎯 Battle initiated! Waiting for results...
✅ Battle completed! Results are now visible
🏆 Step 6: Verifying battle results...
🎉 Battle Result: Pikachu Wins!
🔄 Step 7: Testing reset functionality...
👆 Clicking the RESET button...
✅ Reset functionality working correctly
🎊 E2E Journey Complete! All tests passed successfully! 🎊
```

## E2E Test Demonstration

_Complete E2E test showing Pokemon selection, battle execution, and results_

> 📹 **Want to see the full quality video?** [Download here](https://github.com/Hussain-Mushtaque/Hussain-Evinova-test/raw/main/client/public/e2e-test.mov)




## Implementation Highlights

### Backend

- **TypeScript**: Full type safety with interfaces
- **Service Layer**: Clean separation of business logic
- **Error Handling**: Comprehensive validation and error responses
- **Type System**: Simple but effective type effectiveness calculation

### Frontend

- **React Hooks**: Modern functional components with state management
- **API Integration**: Clean service layer for backend communication
- **User Experience**: Loading states, error handling, result display
- **Responsive Design**: Works on desktop and mobile

### Testing

- **Backend**: Unit tests for business logic and API endpoints
- **Frontend**: Component and integration tests
- **Mocking**: Proper API mocking for isolated frontend tests

## Notes

Note: Although the challenge instructions suggested using Create React App and Jest for the frontend, this implementation uses Vite and Vitest instead—they’re faster to bootstrap and have built-in support for modern features. Jest is still used for all backend tests.
