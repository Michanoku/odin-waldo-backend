# The Odin Project - Where Is Waldo? — Backend

A REST API for a **Where Is Waldo?-style browser game**, built as part of [The Odin Project](https://www.theodinproject.com/) curriculum.

Players select a scene, find hidden characters, and compete for the fastest completion time. The backend handles game sessions, character validation, timing, and leaderboard records, keeping the game logic and data independent of the frontend.

## Disclaimer

The scenes are generated with AI image generation. The reason is that I was not sure about using existing busy images for this from known franchises with known characters. I saw some examples from other users using Waldo images or other IPs. I have not done much research about what can be used freely, as I found it hard to find appropriate busy images. However this code works with other images too, so if I had more information about what images can be legally used, I would gladly replace AI with those images. But for now, this is the best I can come up with. And in any case, this project is to showcase the code, not the images. 

## Features

- **Dynamic game data** — Available scenes, character names, image URLs, and leaderboard records are served by the API.
- **JWT-based game sessions** — Each game starts with a signed JSON Web Token containing the session state.
- **Server-side character validation** — Character positions are stored in the database and never exposed to the frontend.
- **Automatic game timing** — Completion time is calculated on the server in milliseconds.
- **Leaderboards** — The ten fastest completion times are returned for each scene.
- **Input validation** — Request data is validated using `express-validator`.
- **Automated tests** — API endpoints and game mechanics are tested using Jest and Supertest.

## Tech Stack

- **Node.js** — JavaScript runtime
- **Express** — Web framework and REST API
- **PostgreSQL** — Relational database
- **Prisma ORM** — Database queries and data modeling
- **JSON Web Token (JWT)** — Stateless game session management
- **express-validator** — Request validation
- **Jest** — Automated testing
- **Supertest** — HTTP endpoint testing

## How It Works

### 1. Retrieve available scenes

The frontend requests the available scenes from the API. Each scene includes its ID, image URLs, thumbnail URL, and leaderboard records.

The frontend does not need to know how many scenes or characters exist. It receives the information dynamically from the backend.

### 2. Start a game

The player submits a username and the ID of the selected scene.

The backend validates the request, retrieves the scene's characters, and creates a signed JWT containing:

- The selected scene ID
- The player's username
- The game start timestamp
- An array tracking found characters

The frontend receives the token and the character IDs and names needed to display the character selection interface.

Character coordinates remain on the server.

### 3. Tag a character

When the player clicks a location in the scene and selects a character, the frontend submits the coordinates, character ID, and current JWT.

The backend verifies the token, validates the request, retrieves the character's server-side coordinates, and checks whether the submitted location falls within the character's valid region.

Depending on the result, the API responds with one of the following outcomes:

- **Correct** — The character is found and the updated game state is returned in a new JWT.
- **Incorrect** — The player missed, and a refreshed JWT is returned.
- **Game over** — All characters have been found. The completion time is calculated and saved to the database.

### 4. Record the result

When the player finds every character, the backend calculates the elapsed time using the server-side start timestamp and current time.

The result is saved to the database and becomes eligible for the scene's leaderboard.

Completion times are stored in milliseconds and returned in a human-readable `minutes:seconds:milliseconds` format, for example `0:42:137`.

## API Documentation

All endpoints return JSON responses.

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| `GET` | `/images` | Retrieve available scenes and their top ten records | None |
| `POST` | `/start` | Start a new game session | None |
| `POST` | `/tag` | Attempt to find a character | Bearer JWT |

### `GET /images`

Returns the available scenes, their image URLs, thumbnail URLs, and the ten fastest records for each scene.

**Example response:**

```json
[
  {
    "id": "scene-id",
    "imageUrl": "/assets/images/scene.jpg",
    "thumbUrl": "/assets/images/scene-thumb.jpg",
    "records": [
      {
        "userName": "Player1",
        "time": 42137
      }
    ]
  }
]
```

The IDs and URLs above are illustrative. The actual response depends on the database contents.

### `POST /start`

Starts a new game session.

**Request body:**

```json
{
  "userName": "Player1",
  "imageId": "scene-id"
}
```

**Successful response (`200 OK`):**

```json
{
  "token": "<jwt>",
  "characters": [
    {
      "id": "character-id",
      "name": "Hidden Character"
    }
  ],
  "message": "started"
}
```

The `characters` array contains only the IDs and names needed by the frontend. The server retains the character coordinates for validation.

**Validation errors (`400 Bad Request`):**

- Username is required.
- Username must be between 3 and 32 characters.
- A valid scene ID must be provided.

### `POST /tag`

Attempts to find a character at the submitted coordinates.

**Request headers:**

```http
Authorization: Bearer <jwt>
```

**Request body:**

```json
{
  "xCoord": 450,
  "yCoord": 320,
  "characterId": "character-id"
}
```

Coordinates must be integers. They should use the same coordinate system as the character regions stored in the database.

**Successful response — correct guess (`200 OK`):**

```json
{
  "token": "<updated-jwt>",
  "message": "correct"
}
```

**Successful response — incorrect guess (`200 OK`):**

```json
{
  "token": "<updated-jwt>",
  "message": "incorrect"
}
```

**Successful response — game completed (`200 OK`):**

```json
{
  "time": "0:42:137",
  "message": "gameover"
}
```

**Invalid character (`400 Bad Request`):**

```json
{
  "message": "Character not found for this image."
}
```

Malformed requests return `400 Bad Request` with an `errors` array containing validation details.

Requests to `/tag` also require a valid, unexpired JWT.

## Installation and Setup

### Prerequisites

- Node.js
- PostgreSQL
- npm

### 1. Clone the repository

```bash
git clone git@github.com:Michanoku/odin-waldo-backend.git
cd odin-waldo-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
NODE_ENV=development
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/waldo"
JWT_SECRET="your-secret-key"
FRONTEND_URL="your-frontend-url"
```

Replace the database credentials, secret and frontend-url with your own values.

Use a strong, private JWT secret in production. Do not commit `.env` files or other secrets to version control.

### 4. Set up the database

Run the Prisma database setup command used by the project:

```bash
npm run db:init
```

Run the seed script to populate the database with the initial scenes, characters, and any other required data.

```bash
npm run db:seed
```

### 5. Start the server

Use the development or start script:

```bash
npm run dev
```

or 

```bash
npm run start
```

The server will start on the port configured by the application. If no port is configured through an environment variable, check `server.js`.

## Testing

The API is tested using Jest and Supertest.

The tests cover:

- Retrieving available scenes
- Username and scene ID validation
- Starting a game session
- Coordinate and character ID validation
- Correct and incorrect character guesses
- Completing a game
- Saving and retrieving completion records

Run the test suite using:

```bash
npm run test
```

### Test Database

The project uses a separate PostgreSQL database for testing to prevent tests from modifying development data.

The Prisma configuration automatically selects the test database when `NODE_ENV=test` by appending `_test` to the database URL defined in `DATABASE_URL`.

For example, if your `.env` contains:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/waldo"
```

The test environment will use:

```text
postgresql://USER:PASSWORD@localhost:5432/waldo_test
```

Make sure the test database exists and has the required schema and seed data before running the tests.

## Project Structure

The following is a simplified overview of the backend's main modules:

```text
.
├── app.js
├── routes.js
├── controller.js
├── db.js
├── server.js
├── lib/
│   ├── prisma.js
│   └── token.js
├── public/
│   └── images/
├── prisma/
│   └── schema.prisma
│   └── seed.js
└── tests/
    └── game.test.js
    └── setup.js
```

- **`routes.js`** — Defines the API endpoints and their middleware.
- **`controller.js`** — Handles request validation, game logic, and API responses.
- **`db.js`** — Encapsulates database queries using Prisma.
- **`lib/token.js`** — Creates, verifies, and refreshes JWTs.
- **`lib/prisma.js`** — Configures the Prisma client.
- **`public/`** — Stores publicly served game assets.
- **`tests/`** — Contains automated API tests.

## Design Decisions

### Backend-driven game data

The frontend does not hardcode the number of scenes or characters. It retrieves the available content through the API, allowing new scenes and characters to be added through database changes without rewriting the core frontend logic.

### Server-side coordinate validation

Character locations are stored in the database and checked by the backend. The frontend can display the game and submit guesses, but it does not receive the correct coordinate regions as part of the normal game-start response.

This keeps the game logic centralized and avoids relying on client-side validation.

### Stateless game sessions

JWTs carry the state required to process a game, including the start time and the IDs of found characters. This avoids needing a separate database session record for every active game.

The database is updated when a player completes a game and earns a record.

### Server-side timing

The completion time is calculated by the backend rather than relying on a timer supplied by the frontend. This keeps the recorded duration independent of the client's displayed timer.
