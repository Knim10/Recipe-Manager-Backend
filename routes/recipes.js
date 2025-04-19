const express = require('express');
const router = express.Router();
const controller = require('../controllers/recipeController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ image_url: imageUrl });
});


router.get('/', controller.getAllRecipes);
router.get('/:id', controller.getRecipeById);
router.post('/', controller.createRecipe);
router.put('/:id', controller.updateRecipe);
router.delete('/:id', controller.deleteRecipe);

module.exports = router;
