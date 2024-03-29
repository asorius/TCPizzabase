## About

IMDB version of pizzas with user provided images and ratings.  
In addition of rating, user must provide an image of the pizza.
The goal of the app is to see actual how pizzas look in reality, compare them to similar pizzas from different brands in various countries.

Pizzas should be able to be filtered by name, brand, or country by the user.

Anonymous user can: sign up, login, see pizzas with images ratings.
Logged in user can: add new pizza with a rating and image, or add their own image and rating to already existing pizza.

## Setup

1. `npm install`
2. Create a PostgreSQL database, or use an existing one.
3. Setup `.env` files in `client` and `server` based on `.env.example` files.
4. Setup `serviceAccountKey.json` in servers `/firebase` directory with empty object as value `{}`.
5. NOT REQUIRED: To run front-end connect your own Firebase app. Update `serviceAccountKey.json` file and `.env` `FIREBASE_STORAGE_BUCKET` value.

## Tests

```bash

# back end tests with an in-memory database
npm test -w server

# back end tests with a development database
npm run test:db -w server
```

## Running the server

In development mode:

```bash
# automatically restarts the server
npm run dev -w server

# server can be started without a database
npm run dev:mem -w server
```
