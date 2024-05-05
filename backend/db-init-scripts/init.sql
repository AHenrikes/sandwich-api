CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA restaurant;

CREATE TYPE restaurant.orderStatus AS ENUM ('ordered', 'received', 'inQueue', 'ready', 'failed');

CREATE TYPE restaurant.breadTypes AS ENUM ('oat', 'rye', 'wheat');

CREATE TABLE restaurant.sandwiches (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  "breadType" restaurant.breadTypes NOT NULL
);

CREATE TABLE restaurant.toppings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE restaurant.sandwich_toppings (
  "sandwichId" INT REFERENCES restaurant.sandwiches(id),
  "toppingId" INT REFERENCES restaurant.toppings(id),
  PRIMARY KEY ("sandwichId", "toppingId")
);

CREATE TABLE restaurant.orders (
  id SERIAL PRIMARY KEY,
  "sandwichId" INT NOT NULL,
  status restaurant.orderStatus NOT NULL,
  FOREIGN KEY ("sandwichId") REFERENCES restaurant.sandwiches(id)
);

CREATE TABLE restaurant.api_keys(
  id SERIAL PRIMARY KEY,
  encrypted_key BYTEA NOT NULL
);

-- Toppings
-- Meatery
INSERT INTO restaurant.toppings (name) VALUES ('Ham');
INSERT INTO restaurant.toppings (name) VALUES ('Chicken');
INSERT INTO restaurant.toppings (name) VALUES ('Tuna');
INSERT INTO restaurant.toppings (name) VALUES ('MUU');
-- Cheesery
INSERT INTO restaurant.toppings (name) VALUES ('Mozzarella');
INSERT INTO restaurant.toppings (name) VALUES ('Cheddar');
INSERT INTO restaurant.toppings (name) VALUES ('Vegan Cheese');
-- Vegetablery
INSERT INTO restaurant.toppings (name) VALUES ('Tomato');
INSERT INTO restaurant.toppings (name) VALUES ('Lettuce');
INSERT INTO restaurant.toppings (name) VALUES ('Avocado');

-- Example sandwiches
INSERT INTO restaurant.sandwiches (name, "breadType") VALUES ('Chicken Cheesery', 'wheat');
INSERT INTO restaurant.sandwiches (name, "breadType") VALUES ('Vegan Witch', 'rye');
INSERT INTO restaurant.sandwiches (name, "breadType") VALUES ('Tuna Delight', 'oat');
INSERT INTO restaurant.sandwiches (name, "breadType") VALUES ('Ham and Cheese', 'wheat');
INSERT INTO restaurant.sandwiches (name, "breadType") VALUES ('Trio Formaggio', 'wheat');

-- Sandwich toppings for example sandwiches
INSERT INTO restaurant.sandwich_toppings ("sandwichId", "toppingId") VALUES (1, 2);
INSERT INTO restaurant.sandwich_toppings ("sandwichId", "toppingId") VALUES (1, 6);
INSERT INTO restaurant.sandwich_toppings ("sandwichId", "toppingId") VALUES (1, 9);
INSERT INTO restaurant.sandwich_toppings ("sandwichId", "toppingId") VALUES (2, 4);
INSERT INTO restaurant.sandwich_toppings ("sandwichId", "toppingId") VALUES (2, 7);
INSERT INTO restaurant.sandwich_toppings ("sandwichId", "toppingId") VALUES (2, 10);
INSERT INTO restaurant.sandwich_toppings ("sandwichId", "toppingId") VALUES (3, 3);
INSERT INTO restaurant.sandwich_toppings ("sandwichId", "toppingId") VALUES (3, 5);
INSERT INTO restaurant.sandwich_toppings ("sandwichId", "toppingId") VALUES (3, 8);
INSERT INTO restaurant.sandwich_toppings ("sandwichId", "toppingId") VALUES (4, 1);
INSERT INTO restaurant.sandwich_toppings ("sandwichId", "toppingId") VALUES (4, 6);
INSERT INTO restaurant.sandwich_toppings ("sandwichId", "toppingId") VALUES (4, 9);
INSERT INTO restaurant.sandwich_toppings ("sandwichId", "toppingId") VALUES (5, 5);
INSERT INTO restaurant.sandwich_toppings ("sandwichId", "toppingId") VALUES (5, 6);
INSERT INTO restaurant.sandwich_toppings ("sandwichId", "toppingId") VALUES (5, 7);