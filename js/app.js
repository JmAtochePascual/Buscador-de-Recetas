// Selectores
const categoriasSelectElement = document.querySelector('#categorias');

// Carga las categorias 
const cargarCategorias = () => {
  const URL = `https://www.themealdb.com/api/json/v1/1/categories.php`;

  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      mostrarCategorias(data.categories);
    });
};


// Muestra las categorias en el select
const mostrarCategorias = (categorias) => {
  categorias.forEach((categoria) => {
    const optionElement = document.createElement('option');
    optionElement.value = categoria.strCategory;
    optionElement.textContent = categoria.strCategory;
    categoriasSelectElement.appendChild(optionElement);
  });
};


// Carga las recetas
const cargarRecetas = () => {
  const categoria = categoriasSelectElement.value;
  const URL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;

  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.meals);
    });
};
// Cargar Eventos
document.addEventListener('DOMContentLoaded', () => {
  cargarCategorias();
  categoriasSelectElement.addEventListener('change', cargarRecetas);
});