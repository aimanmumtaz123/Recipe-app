import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Search, Clock, Book, Upload } from 'lucide-react';
import { fetchRecipes } from '../services/api';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRecipes = async () => {
      try {
        setLoading(true);
        const data = await fetchRecipes();
        setRecipes(data);
        setFilteredRecipes(data);
        setError(null);
      } catch (err) {
        setError('Failed to load recipes. Please try again later.');
        console.error('Error fetching recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    getRecipes();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRecipes(recipes);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    const results = recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTermLower) ||
      recipe.ingredients.toLowerCase().includes(searchTermLower)
    );
    setFilteredRecipes(results);
  }, [searchTerm, recipes]);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center my-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Button onClick={() => window.location.reload()} variant="primary">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title text-center mb-4">Recipe Collection</h1>
      
      <div className="search-container mb-4">
        <InputGroup>
          <InputGroup.Text>
            <Search size={18} />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search recipes by title or ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search recipes"
          />
        </InputGroup>
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="text-center my-5">
          <h3>No recipes found</h3>
          <p className="text-muted mb-4">Try a different search term or add a new recipe</p>
          <Button as={Link} to="/create" variant="primary" size="lg">
            Add New Recipe
          </Button>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredRecipes.map((recipe) => (
            <Col key={recipe.id}>
              <Card className="recipe-card h-100">
                <div className="overflow-hidden">
                  {recipe.imageUrl ? (
                    <Card.Img 
                      variant="top" 
                      src={recipe.imageUrl} 
                      alt={recipe.title}
                      className="recipe-image"
                    />
                  ) : (
                    <div className="recipe-image-placeholder d-flex align-items-center justify-content-center">
                      <div className="text-center text-muted">
                        <Upload size={32} className="mb-2" />
                        <small>No image</small>
                      </div>
                    </div>
                  )}
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{recipe.title}</Card.Title>
                  <Card.Text>
                    {truncateText(recipe.ingredients, 100)}
                  </Card.Text>
                  <div className="mt-auto pt-3">
                    <Button 
                      as={Link} 
                      to={`/recipe/${recipe.id}`} 
                      variant="primary" 
                      className="w-100"
                    >
                      View Recipe
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default RecipeList;