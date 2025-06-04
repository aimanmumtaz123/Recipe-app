import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import RecipeForm from './components/RecipeForm';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navigation />
      <Container className="py-4 main-content">
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/create" element={<RecipeForm />} />
          <Route path="/edit/:id" element={<RecipeForm />} />
        </Routes>
      </Container>
      <footer className="footer py-3">
        <Container className="text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} Recipe Vault. All recipes carefully curated.</p>
        </Container>
      </footer>
    </div>
  );
}

export default App;