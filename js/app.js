// Selectores
const categoriasSelectElement = document.querySelector('#categorias');
const resultadoElement = document.querySelector('#resultado');

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
const consultarRecetas = () => {
  const categoria = categoriasSelectElement.value;
  const URL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;

  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      mostrarRecetas(data.meals);
    });
};


// Muestra las recetas en el DOM
const mostrarRecetas = (recetas = []) => {
  limpiarHTML(resultadoElement);

  const titulo = document.createElement('h3');
  titulo.classList.add('text-center', 'text-black', 'my-5');
  titulo.textContent = recetas.length ? 'Resultados' : 'No hay resultados, intenta con otra categoría';
  resultadoElement.appendChild(titulo);

  recetas.forEach((receta) => {
    const { idMeal, strMeal, strMealThumb } = receta;

    const resultadoContenedor = document.createElement('div');
    resultadoContenedor.classList.add('col-md-4');

    const recetaCard = document.createElement('div');
    recetaCard.classList.add('card', 'mb-4', 'shadow-sm');

    const recetaImagen = document.createElement('img');
    recetaImagen.classList.add('card-img-top');
    recetaImagen.alt = `Imagen de la receta ${strMeal}`;
    recetaImagen.src = strMealThumb;

    const recetaBody = document.createElement('div');
    recetaBody.classList.add('card-body');

    const recetaHeading = document.createElement('h3');
    recetaHeading.classList.add('card-title', 'mb-3');
    recetaHeading.textContent = strMeal;

    const recetaButton = document.createElement('button');
    recetaButton.classList.add('btn', 'btn-danger', 'w-100');
    recetaButton.textContent = 'Ver receta';

    // Agregar al HTML
    recetaBody.append(recetaHeading, recetaButton);
    recetaCard.append(recetaImagen, recetaBody);
    resultadoContenedor.appendChild(recetaCard);
    resultadoElement.appendChild(resultadoContenedor);
  });
};


// Limpiar HTML
const limpiarHTML = (selector) => {
  while (selector.firstChild) {
    selector.firstChild.remove();
  }
};

// Cargar Eventos
document.addEventListener('DOMContentLoaded', () => {
  cargarCategorias();
  categoriasSelectElement.addEventListener('change', consultarRecetas);
});