const categorySelectElement = document.querySelector('#categorias');
const favoritesElement = document.querySelector('.favoritos');
const modalElement = new bootstrap.Modal('#modal', {});
const resultElement = document.querySelector('#resultado');

const getCategories = async () => {
  const URL = `https://www.themealdb.com/api/json/v1/1/categories.php`;

  try {
    const response = await fetch(URL);
    const data = await response.json();
    showCategories(data.categories);
  } catch (error) {
    console.error(error, 'Error al cargar las categorias');
  };
};

const showCategories = (categories) => {
  categories.forEach((category) => {
    const optionElement = document.createElement('option');
    optionElement.value = category.strCategory;
    optionElement.textContent = category.strCategory;
    categorySelectElement?.appendChild(optionElement);
  });
};

const getRecepies = async () => {
  const category = categorySelectElement.value;
  const URL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;

  try {
    const response = await fetch(URL);
    const data = await response.json();
    showRecipies(data.meals);
  } catch (error) {
    console.error(error, 'Error al cargar las recetas');
  };
};

const showRecipies = (recepies = []) => {
  cleanHtml(resultElement);

  const titleElement = document.createElement('h3');
  titleElement.classList.add('text-center', 'text-black', 'my-5');
  titleElement.textContent = recepies.length ? 'Resultados' : 'No hay resultados, intenta con otra categoría';
  resultElement.appendChild(titleElement);

  recepies.forEach((recepy) => {
    const { idMeal, strMeal, strMealThumb } = recepy;

    const resultContainerElement = document.createElement('div');
    resultContainerElement.classList.add('col-md-4');

    const recepyCard = document.createElement('div');
    recepyCard.classList.add('card', 'mb-4', 'shadow-sm');

    const recepyImage = document.createElement('img');
    recepyImage.classList.add('card-img-top');
    recepyImage.alt = `Imagen de la receta ${strMeal}`;
    recepyImage.src = strMealThumb;

    const recepyBody = document.createElement('div');
    recepyBody.classList.add('card-body');

    const recepyHead = document.createElement('h3');
    recepyHead.classList.add('card-title', 'mb-3');
    recepyHead.textContent = strMeal;

    const recepyButton = document.createElement('button');
    recepyButton.classList.add('btn', 'btn-danger', 'w-100');
    recepyButton.textContent = 'Ver receta';
    recepyButton.onclick = () => getRecipy(idMeal);

    recepyBody.append(recepyHead, recepyButton);
    recepyCard.append(recepyImage, recepyBody);
    resultContainerElement.appendChild(recepyCard);
    resultElement.appendChild(resultContainerElement);
  });
};

const cleanHtml = (element) => {
  while (element.firstChild) {
    element.firstChild.remove();
  };
};

const getRecipy = async (id) => {
  const URL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

  try {
    const response = await fetch(URL);
    const data = await response.json();
    showModal(data.meals[0]);
  } catch (error) {
    console.error(error, 'Error al cargar la receta');
  };
};

const showModal = (recepy) => {
  // const { idMeal, strInstructions, strMeal, strMealThumb } = recepy;
  const { strInstructions, strMeal, strMealThumb } = recepy;

  const titleModal = document.querySelector('.modal .modal-title');
  const bodyModal = document.querySelector('.modal .modal-body');
  // const modalImage = document.querySelector('.modal .modal-image');

  titleModal.textContent = strMeal;
  bodyModal.innerHTML = `
  <img class="img-fluid" src="${strMealThumb}" alt="Imagen de la receta ${strMeal}"/>
  <h3 class="my-3">Instrucciones</h3>
  <p>${strInstructions}</p>
  <h3 class="my-3">Ingredientes y Cnatidades</h3>
  `;

  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group');

  for (let i = 1; i <= 20; i++) {
    const ingrediente = recepy[`strIngredient${i}`];
    const cantidad = recepy[`strMeasure${i}`];

    if (ingrediente) {
      const ingredienteElement = document.createElement('li');
      ingredienteElement.classList.add('list-group-item');
      ingredienteElement.textContent = `${ingrediente} - ${cantidad}`;

      listGroup.appendChild(ingredienteElement);
    };
  };

  bodyModal.appendChild(listGroup);

  const modalFooter = document.querySelector('.modal-footer');
  cleanHtml(modalFooter);

  const btnFavoritos = document.createElement('button');
  btnFavoritos.classList.add('btn', 'btn-danger', 'col');
  favoritesElement ? btnFavoritos.textContent = 'Quitar de favoritos' : btnFavoritos.textContent = 'Agregar a favoritos';

  btnFavoritos.onclick = () => {
    if (favoritesElement) {
      deleteFavorites(recepy)
      modalElement.hide();
      return;
    }

    addFavorite(recepy);
  };

  const btnCerrar = document.createElement('button');
  btnCerrar.classList.add('btn', 'btn-secondary', 'col');
  btnCerrar.textContent = 'Cerrar';
  btnCerrar.onclick = () => modalElement.hide();

  modalFooter.append(btnFavoritos, btnCerrar);

  modalElement.show();
};

const addFavorite = (receta) => {
  const favoritos = getFavorites();

  if (!validarFavorito(receta, favoritos)) {
    const newFavoritos = [...favoritos, receta];
    localStorage.setItem('favoritos', JSON.stringify(newFavoritos));
    showToast('Receta agregada a favoritos');
    return;
  } else {
    showToast('Esta receta ya existe en favoritos');
  }
};

const getFavorites = () => JSON.parse(localStorage.getItem('favoritos')) || [];

const validarFavorito = (receta, favoritos) => favoritos.some((favorito) => favorito.idMeal === receta.idMeal);

const showToast = (mensaje) => {
  const toast = document.querySelector('#toast');
  const toastBody = document.querySelector('.toast-body');
  const bsToast = new bootstrap.Toast(toast);
  toastBody.textContent = mensaje;

  bsToast.show();
};

const showFavorities = () => {
  const favoritos = getFavorites();

  if (favoritos.length) {
    showRecipies(favoritos);
    return;
  }
  const titulo = document.createElement('h3');
  titulo.classList.add('text-center', 'text-black', 'my-5');
  titulo.textContent = 'No hay recetas favoritas';
  favoritesElement.appendChild(titulo);
};

const deleteFavorites = (receta) => {
  const favoritos = getFavorites();
  const newFavoritos = favoritos.filter((favorito) => favorito.idMeal !== receta.idMeal);
  showRecipies(newFavoritos);

  localStorage.setItem('favoritos', JSON.stringify(newFavoritos));
  showToast('Receta eliminada de favoritos');
};

document.addEventListener('DOMContentLoaded', () => {
  getCategories();
  categorySelectElement?.addEventListener('change', getRecepies);
  if (favoritesElement) showFavorities();
});