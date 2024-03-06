## About

IMDB version of pizzas, world wide, with images and ratings.  
Users can create multiple pizzas with an image and rating.

Pizzas should be able to be filtered by name, brand, or country by the user.

Anonymous user can: sign up, login, see pizzas with ratings
Logged in user can: add new pizza with a rating and image, or add their image and rating to already existing pizza

To be implemented:
Whole client side code.
Admin role and actions:
-If user is admin, they should be able to: delete pizzas, brands, images
Ability for user to delete their own uploaded image.

## Setup

1. `npm install`
2. Create a PostgreSQL database, or use an existing one.
3. Setup `.env` files in `client` and `server` based on `.env.example` files.
4. Connect your own Firebase app. Add `serviceAccountKey.json` in servers `/firebase` directory.

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
npm run dev

# server can be started without a database
npm run dev:mem
```
