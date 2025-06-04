import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Row, Col, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { ArrowLeft, Edit, Trash2, Upload } from 'lucide-react';
import { fetchRecipeById, deleteRecipe } from '../services/api';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const getRecipeDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchRecipeById(id);
        setRecipe(data);
        setError(null);
      } catch (err) {
        setError('Failed to load recipe details. The recipe may not exist or has been removed.');
        console.error('Error fetching recipe details:', err);
      } finally {
        setLoading(false);
      }
    };

    getRecipeDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteRecipe(id);
      navigate('/', { state: { message: 'Recipe deleted successfully!' } });
    } catch (err) {
      setError('Failed to delete recipe. Please try again.');
      setShowDeleteConfirm(false);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading recipe details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-5">
        <Alert variant="danger">{error}</Alert>
        <Button 
          as={Link} 
          to="/" 
          variant="outline-primary" 
          className="mt-3"
        >
          <ArrowLeft size={16} className="me-2" /> Back to Recipes
        </Button>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="my-5 text-center">
        <Alert variant="warning">Recipe not found</Alert>
        <Button 
          as={Link} 
          to="/" 
          variant="outline-primary" 
          className="mt-3"
        >
          <ArrowLeft size={16} className="me-2" /> Back to Recipes
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button 
          as={Link} 
          to="/" 
          variant="outline-secondary"
        >
          <ArrowLeft size={16} className="me-2" /> Back
        </Button>
        
        <div className="recipe-actions">
          <Button 
            as={Link} 
            to={`/edit/${recipe.id}`} 
            variant="outline-primary"
          >
            <Edit size={16} className="me-2" /> Edit
          </Button>
          
          {!showDeleteConfirm ? (
            <Button 
              variant="outline-danger" 
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 size={16} className="me-2" /> Delete
            </Button>
          ) : (
            <>
              <Button 
                variant="danger" 
                onClick={handleDelete}
              >
                Confirm Delete
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      <Card className="mb-4">
        {recipe.imageUrl ? (
          <Card.Img 
            src={recipe.imageUrl} 
            alt={recipe.title} 
            className="recipe-detail-image"
          />
        ) : (
          <div className="recipe-image-placeholder d-flex align-items-center justify-content-center">
            <div className="text-center text-muted">
              <Upload size={48} className="mb-2" />
              <p className="mb-0">No image available</p>
            </div>
          </div>
        )}
        <Card.Body>
          <h1 className="mb-4">{recipe.title}</h1>
          
          <Row className="mb-4">
            <Col md={6}>
              <h3 className="mb-3">Ingredients</h3>
              <div className="ingredients-list p-3 bg-light rounded">
                {recipe.ingredients}
              </div>
            </Col>
            <Col md={6}>
              <h3 className="mb-3">Instructions</h3>
              <div className="instructions-list p-3 bg-light rounded">
                {recipe.instructions}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RecipeDetail;