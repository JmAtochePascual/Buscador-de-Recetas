// Selectores
const categoriasSelectElement = document.querySelector('#categorias');
const resultadoElement = document.querySelector('#resultado');
const modalElement = new bootstrap.Modal('#modal', {});
// const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

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
    recetaButton.onclick = () => consultarReceta(idMeal);

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


// Consultar receta por ID
const consultarReceta = (id) => {
  const URL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      mostrarRecetaModal(data.meals[0]);
    });
};


//  Muestra una receta en el DOM
const mostrarRecetaModal = (receta) => {
  const { idMeal, strInstructions, strMeal, strMealThumb } = receta;

  const modalTitle = document.querySelector('.modal .modal-title');
  const modalBody = document.querySelector('.modal .modal-body');
  const modalImage = document.querySelector('.modal .modal-image');

  modalTitle.textContent = strMeal;
  modalBody.innerHTML = `
  <img class="img-fluid" src="${strMealThumb}" alt="Imagen de la receta ${strMeal}"/>
  <h3 class="my-3">Instrucciones</h3>
  <p>${strInstructions}</p>
  <h3 class="my-3">Ingredientes y Cnatidades</h3>
  `;

  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group');

  // Mostrar ingredientes
  for (let i = 1; i <= 20; i++) {
    const ingrediente = receta[`strIngredient${i}`];
    const cantidad = receta[`strMeasure${i}`];

    if (ingrediente) {
      const ingredienteElement = document.createElement('li');
      ingredienteElement.classList.add('list-group-item');
      ingredienteElement.textContent = `${ingrediente} - ${cantidad}`;

      listGroup.appendChild(ingredienteElement);
    }
  }

  modalBody.appendChild(listGroup);

  const modalFooter = document.querySelector('.modal-footer');
  limpiarHTML(modalFooter);

  // Bortones de favoritos y cerrar
  const btnFavoritos = document.createElement('button');
  btnFavoritos.classList.add('btn', 'btn-danger', 'col');
  btnFavoritos.textContent = 'Agregar a favoritos';
  btnFavoritos.onclick = () => agregarFavorito(receta);

  const btnCerrar = document.createElement('button');
  btnCerrar.classList.add('btn', 'btn-secondary', 'col');
  btnCerrar.textContent = 'Cerrar';
  btnCerrar.onclick = () => modalElement.hide();

  modalFooter.append(btnFavoritos, btnCerrar);

  modalElement.show();
};

// Agreagar a favoritos
const agregarFavorito = (receta) => {
  const favoritos = obtenerFavoritos();

  if (!validarFavorito(receta, favoritos)) {
    const newFavoritos = [...favoritos, receta];
    localStorage.setItem('favoritos', JSON.stringify(newFavoritos));
  };
};

// Obtiene los favoritos del local storage
const obtenerFavoritos = () => JSON.parse(localStorage.getItem('favoritos')) || [];

// Valida si la receta ya esta en favoritos
const validarFavorito = (receta, favoritos) => favoritos.some((favorito) => favorito.idMeal === receta.idMeal);

// Cargar Eventos
document.addEventListener('DOMContentLoaded', () => {
  cargarCategorias();
  categoriasSelectElement.addEventListener('change', consultarRecetas);
});