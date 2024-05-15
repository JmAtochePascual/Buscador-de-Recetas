// Selectores
const categoriasSelectElement = document.querySelector('#categorias');

// Carga las categorias 
const cargarCategorias = () => {
  const URL = `https://www.themealdb.com/api/json/v1/1/categories.php`;

  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      const categorias = data.categories;
    });
};

// Cargar Eventos
document.addEventListener('DOMContentLoaded', () => {
  cargarCategorias();
});