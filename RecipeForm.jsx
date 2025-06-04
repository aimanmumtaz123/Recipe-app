import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { fetchRecipeById, createRecipe, updateRecipe } from '../services/api';
import { uploadImage } from '../services/image-upload';

const RecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    imageUrl: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      const fetchRecipe = async () => {
        try {
          setLoading(true);
          const data = await fetchRecipeById(id);
          setFormData({
            title: data.title || '',
            ingredients: data.ingredients || '',
            instructions: data.instructions || '',
            imageUrl: data.imageUrl || ''
          });
          setImagePreview(data.imageUrl || '');
          setError(null);
        } catch (err) {
          setError('Failed to load recipe data. The recipe may not exist.');
          console.error('Error fetching recipe:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchRecipe();
    }
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormErrors({
        ...formErrors,
        imageFile: 'Image size should be less than 5MB'
      });
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setFormErrors({
        ...formErrors,
        imageFile: 'Only JPG, PNG and GIF images are allowed'
      });
      return;
    }

    setImageFile(file);
    setFormErrors({
      ...formErrors,
      imageFile: null
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.ingredients.trim()) {
      errors.ingredients = 'Ingredients are required';
    }

    if (!formData.instructions.trim()) {
      errors.instructions = 'Instructions are required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitLoading(true);
      setError(null);

      let imageUrl = formData.imageUrl;

      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile);
        } catch (imgErr) {
          setError('Failed to upload image. Please try again.');
          setSubmitLoading(false);
          return;
        }
      }

      const recipeData = {
        ...formData,
        imageUrl
      };

      if (isEditMode) {
        await updateRecipe(id, recipeData);
        navigate(`/recipe/${id}`, { state: { message: 'Recipe updated successfully!' } });
      } else {
        const newRecipe = await createRecipe(recipeData);
        navigate(`/recipe/${newRecipe.id}`, { state: { message: 'Recipe created successfully!' } });
      }
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} recipe. Please try again.`);
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} recipe:`, err);
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading recipe data...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h1 className="page-title mb-4">{isEditMode ? 'Edit Recipe' : 'Create New Recipe'}</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="recipeTitle">
          <Form.Label>Recipe Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter recipe title"
            isInvalid={!!formErrors.title}
          />
          <Form.Control.Feedback type="invalid">
            {formErrors.title}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="recipeIngredients">
          <Form.Label>Ingredients</Form.Label>
          <Form.Control
            as="textarea"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleInputChange}
            placeholder="List ingredients, separated by commas"
            rows={4}
            isInvalid={!!formErrors.ingredients}
          />
          <Form.Control.Feedback type="invalid">
            {formErrors.ingredients}
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            List all ingredients with quantities (e.g., "2 cups flour, 1 tsp salt")
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="recipeInstructions">
          <Form.Label>Instructions</Form.Label>
          <Form.Control
            as="textarea"
            name="instructions"
            value={formData.instructions}
            onChange={handleInputChange}
            placeholder="Enter cooking instructions step by step"
            rows={6}
            isInvalid={!!formErrors.instructions}
          />
          <Form.Control.Feedback type="invalid">
            {formErrors.instructions}
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            Provide detailed steps, numbered or bulleted
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-4" controlId="recipeImage">
          <Form.Label>Recipe Image <span className="text-muted">(Optional)</span></Form.Label>
          <div className="d-flex flex-column">
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              isInvalid={!!formErrors.imageFile}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.imageFile}
            </Form.Control.Feedback>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Recipe preview"
                className="image-preview mt-3"
              />
            )}
          </div>
          <Form.Text className="text-muted">
            Max file size: 5MB. Supported formats: JPG, PNG, GIF. Leave empty if you don't have an image.
          </Form.Text>
        </Form.Group>

        <div className="d-flex justify-content-between">
          <Button
            variant="outline-secondary"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} className="me-2" /> Back
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={submitLoading}
          >
            {submitLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save size={16} className="me-2" />
                {isEditMode ? 'Update Recipe' : 'Create Recipe'}
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default RecipeForm;