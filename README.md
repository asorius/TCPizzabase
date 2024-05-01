## About

IMDB version of pizzas with user provided images and ratings.  
In addition of rating, user must provide an image of the pizza.
The goal of the app is to see actual how pizzas look in reality, compare them to similar pizzas from different brands in various countries.

Pizzas should be able to be filtered by name, brand, or country by the user.

Anonymous user can: sign up, login, see pizzas with images ratings.
Logged in user can: add new pizza with a rating and image, or add their own image and rating to already existing pizza.

Live version: https://pizzabase.uq04v1ilsbd18.eu-west-2.cs.amazonlightsail.com/

## Setup

### Local with npm:

1. `npm install`
2. Create a PostgreSQL database, or use an existing one.
3. Create `.env` files in `client` and `server` based on `.env.example` files.
4. NOT REQUIRED: To run application fully connect your own Firebase app. Update `serviceAccountKey.json` file and `.env` `FIREBASE_STORAGE_BUCKET` value.

### Docker:

App can be run on docker, but it won't work properly unless Firebase is fully connected.

1. Clone repository to `folderName`.
2. Create `.env` files in `client` and `server` based on `.env.example` files.
3. Run

```bash
# inside /folderName
docker compose build

docker compose up

```

4. Client should be accessible through `localhost:3001` and server on `localhost:3001`

## Tests

```bash

# e2e tests require server to be on
npm run dev:mem -w=server

#then
run test:e2e -w=client

# back end tests with an in-memory database
npm test -w=server

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
