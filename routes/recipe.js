const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe'); // Make sure the model is correct

// Create a recipe (POST request)
router.post('/', async (req, res) => {
    try {
        const { title, ingredients, instructions, category ,imageUrl} = req.body;

        if (!title || !ingredients || !instructions || !category || !imageUrl) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newRecipe = new Recipe({ title, ingredients, instructions, category , imageUrl});
        await newRecipe.save();

        res.status(201).json(newRecipe);
    } catch (error) {
        console.error('Error adding recipe:', error);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get all recipes (GET request)
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find(); // Fetch all recipes from MongoDB
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: error.message });
    }
});




// delete the single recipe
// Delete a single recipe by ID (DELETE request)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRecipe = await Recipe.findByIdAndDelete(id);

        if (!deletedRecipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.json({ message: 'Recipe deleted successfully', deletedRecipe });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ error: error.message });
    }
});

// get single recipe
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const getRecipe = await Recipe.findById(id);

        if (!getRecipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.json({ message: 'Recipe fetched successfully', recipe: getRecipe });
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ error: error.message });
    }
});


// Update a single recipe by ID (PUT request)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, ingredients, instructions, category, imageUrl } = req.body;

        const updatedRecipe = await Recipe.findByIdAndUpdate(
            id,
            { title, ingredients, instructions, category, imageUrl },
            { new: true, runValidators: true }
        );

        if (!updatedRecipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.json({ message: 'Recipe updated successfully', updatedRecipe });
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
