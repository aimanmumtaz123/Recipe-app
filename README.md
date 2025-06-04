# 🍽️ Recipe Management App

A full-stack Recipe Management web application built with **React**, **React Router DOM**, **Bootstrap 5**, and **JSON Server**. This app allows users to easily create, read, update, delete, and search recipes. Images can be uploaded via Imgur, and the app includes client-side form validation and responsive UI.

## 🚀 Features

- 🔍 **Search Recipes** by title or ingredients
- ➕ **Add New Recipes** with title, ingredients, instructions, and image
- 📝 **Edit Existing Recipes** and update images
- 🗑️ **Delete Recipes** with a confirmation prompt
- 🖼️ **Image Upload Support** via Imgur API
- ✅ **Form Validations** with live error feedback
- 🧭 **Routing & Navigation** with React Router DOM
- 📱 **Responsive Design** using Bootstrap 5
- 🔄 **Data Persistence** with JSON Server (fake REST API)

## 🛠️ Tech Stack

- **Frontend:** React, Bootstrap 5, React Router DOM
- **Backend:** JSON Server (for development)
- **Image Upload:** Imgur API
- **Icons:** Lucide React
```bash
git clone https://github.com/yourusername/recipe-app.git
cd recipe-app
npm install
npx json-server --watch db.json --port 5000
npm run dev
