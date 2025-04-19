const db = require('../db/database');

// Get all recipes (basic info only)
exports.getAllRecipes = (req, res) => {
  const query = `SELECT * FROM recipes`;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Get one recipe by ID (with ingredients and instructions)
exports.getRecipeById = (req, res) => {
  const recipeId = req.params.id;

  const recipeQuery = `SELECT * FROM recipes WHERE id = ?`;
  const ingredientsQuery = `SELECT quantity, unit, name FROM ingredients WHERE recipe_id = ?`;
  const instructionsQuery = `SELECT description FROM instructions WHERE recipe_id = ? ORDER BY step_number`;

  db.get(recipeQuery, [recipeId], (err, recipe) => {
    if (err || !recipe) return res.status(404).json({ error: 'Recipe not found' });

    db.all(ingredientsQuery, [recipeId], (err, ingredients) => {
      if (err) return res.status(500).json({ error: err.message });

      db.all(instructionsQuery, [recipeId], (err, instructions) => {
        if (err) return res.status(500).json({ error: err.message });

        recipe.ingredients = ingredients;
        recipe.instructions = instructions;

        res.json(recipe);
      });
    });
  });
};

// Create a new recipe
exports.createRecipe = (req, res) => {
  const { name, servings, prep_time, difficulty, image_url, ingredients, instructions } = req.body;

  const insertRecipe = `INSERT INTO recipes (name, servings, prep_time, difficulty, image_url) VALUES (?, ?, ?, ?, ?)`;

  db.run(insertRecipe, [name, servings, prep_time, difficulty, image_url], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    const recipeId = this.lastID;

    const insertIngredient = db.prepare(`INSERT INTO ingredients (recipe_id, quantity, unit, name) VALUES (?, ?, ?, ?)`);
    ingredients.forEach(ing => insertIngredient.run(recipeId, ing.quantity, ing.unit, ing.name));
    insertIngredient.finalize();

    const insertInstruction = db.prepare(`INSERT INTO instructions (recipe_id, step_number, description) VALUES (?, ?, ?)`);
    instructions.forEach((inst, i) => insertInstruction.run(recipeId, i + 1, inst.description));
    insertInstruction.finalize();

    res.status(201).json({ message: 'Recipe created', id: recipeId });
  });
};

// Update a recipe
exports.updateRecipe = (req, res) => {
  const recipeId = req.params.id;
  const { name, servings, prep_time, difficulty, image_url, ingredients, instructions } = req.body;

  const updateRecipe = `UPDATE recipes SET name = ?, servings = ?, prep_time = ?, difficulty = ?, image_url = ? WHERE id = ?`;

  db.run(updateRecipe, [name, servings, prep_time, difficulty, image_url, recipeId], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    // Delete old ingredients/instructions
    db.run(`DELETE FROM ingredients WHERE recipe_id = ?`, [recipeId]);
    db.run(`DELETE FROM instructions WHERE recipe_id = ?`, [recipeId], () => {
      const insertIngredient = db.prepare(`INSERT INTO ingredients (recipe_id, quantity, unit, name) VALUES (?, ?, ?, ?)`);
      ingredients.forEach(ing => insertIngredient.run(recipeId, ing.quantity, ing.unit, ing.name));
      insertIngredient.finalize();

      const insertInstruction = db.prepare(`INSERT INTO instructions (recipe_id, step_number, description) VALUES (?, ?, ?)`);
      instructions.forEach((inst, i) => insertInstruction.run(recipeId, i + 1, inst.description));
      insertInstruction.finalize();

      res.json({ message: 'Recipe updated' });
    });
  });
};

// Delete a recipe
exports.deleteRecipe = (req, res) => {
  const recipeId = req.params.id;
  db.run(`DELETE FROM recipes WHERE id = ?`, [recipeId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Recipe deleted' });
  });
};
