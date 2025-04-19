-- Drop tables if they exist
DROP TABLE IF EXISTS instructions;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS recipes;

-- Main recipe table
CREATE TABLE recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  servings INTEGER,
  prep_time TEXT,
  difficulty TEXT,
  image_url TEXT
);

-- Ingredients table (linked to recipes)
CREATE TABLE ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id INTEGER,
  quantity REAL,
  unit TEXT,
  name TEXT,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- Instructions table (linked to recipes)
CREATE TABLE instructions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id INTEGER,
  step_number INTEGER,
  description TEXT,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- Seed data
INSERT INTO recipes (name, servings, prep_time, difficulty, image_url)
VALUES ('Spaghetti Bolognese', 4, '30 minutes', 'Medium', 'https://via.placeholder.com/400x250');

INSERT INTO ingredients (recipe_id, quantity, unit, name)
VALUES
  (1, 1.5, 'cups', 'flour'),
  (1, 2, 'tbsp', 'olive oil'),
  (1, 1, 'lb', 'ground beef');

INSERT INTO instructions (recipe_id, step_number, description)
VALUES
  (1, 1, 'Boil water.'),
  (1, 2, 'Cook spaghetti for 10 minutes.'),
  (1, 3, 'Brown the ground beef.');
