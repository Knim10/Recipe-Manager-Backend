const express = require('express');
const cors = require('cors');
const recipeRoutes = require('./routes/recipes');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/recipes', recipeRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/recipes', recipeRoutes);

module.exports = app;
