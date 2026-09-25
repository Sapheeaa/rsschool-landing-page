const toggleCheckbox = document.getElementById("theme-toggle");
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem("theme");
// если в памяти выбрана тема дарк, то добавляем к тегу html стили дарк и ставим чекбокс в положение true
if (savedTheme === "dark") {
  htmlElement.classList.add("dark");
  toggleCheckbox.checked = true;
}

//если пользователь нажимает на toggleCheckbox, то добавляем к тегу html стили дарк, сохраняет в памяти выбранную тему
toggleCheckbox.addEventListener("change", function () {
  if (this.checked) {
    htmlElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    htmlElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
});

//модальное окно

let petsData = [];
const modal = document.getElementById("petModal");
const modalBody = document.getElementById("modalBody");
fetch("pets.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    petsData = data;
    renderPets(petsData);
  })
  .catch(function (error) {
    console.error("Ошибка при загрузке pets.json:", error);
  });

function buildModalContent(pet) {
  const inoculationsText = pet.inoculations.join(", "); // объединяем прививки в одну строку через запятую
  const diseasesText = pet.diseases.join(", ");
  const parasitesText = pet.parasites.join(", ");
  return `
  <img src ="${pet.image}" alt ="${pet.name}">
<div>
<h2>${pet.name}</h2>
<p class="modal-breed">${pet.breed}</p>
<p class="modal-description">${pet.description}</p>
 <ul>
    <li><b>Age:</b> ${pet.age}</li>
    <li><b>Inoculations:</b> ${inoculationsText}</li>
    <li><b>Diseases:</b> ${diseasesText}</li>
    <li><b>Parasites:</b> ${parasitesText}</li>
  </ul>
</div>
  `;
}
function openModal(pet) {
  modalBody.innerHTML = buildModalContent(pet);
  modal.classList.add("modal-open");
  document.body.style.overflow = "hidden"; //блокирует прокрутку страницы
}

function closeModal() {
  modal.classList.remove("modal-open");
  document.body.style.overflow = "";
}
function attachCardHandlers() {
  //обработчик для кнопок «Learn more»
  const learnMoreButtons = document.querySelectorAll(".pet-card-button");
  learnMoreButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault(); //без этого кнопка переносила бы в начало документа как раньше
      const card = button.closest(".pet-card") || button.closest(".our__pet__card"); // найти карточку, в которой лежит эта кнопка
      const id = Number(card.dataset.id); // прочитать id карточки и превратить в число и положить в переменную id
      const pet = petsData.find(function (item) {
        // найти питомца в массиве данных
        return item.id === id;
      });
      if (pet) {
        // открыть модальное окно
        openModal(pet);
      }
    });
  });
}
//обработчик закрытия по кнопке крестик и по нажатию на темный фон
const overlay = document.querySelector(".modal-overlay");
const closeButton = document.querySelector(".modal-close");

overlay.addEventListener("click", closeModal);
closeButton.addEventListener("click", closeModal); //closeModal без скобок , чтобы не вызвалось прямо сейчас

//закрытие при нажатии на escape
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && modal.classList.contains("modal-open")) {
    closeModal();
  }
});

//рендер карточек, создали хтмл структуру
const petsGrid = document.getElementById("petsGrid");
let currentCategory = "Both";

function createHtmlCard(pet) {
  return `
  <div class="our__pet__card" data-id="${pet.id}">
  <img src ="${pet.image}" alt="${pet.name}" class="pet-card-image">
  <p>${pet.name}</p>
  <p>${pet.age}<br><br>${pet.breed}<br><br>${pet.description}</p>
  <a href="#" class="pet-card-button button__white_bg">Learn more</a>
  </div>
  `;
}

//рендер карточек
function renderPets(pets) {
  if (!petsGrid) return; //выходим из функции нисего не делаем
  petsGrid.innerHTML = pets.map(createHtmlCard).join(""); //без джоин между карточками были бы запятые
  attachCardHandlers();
}

//фильтр категорий
function filterCards(category) {
  const normalised = category.toLowerCase().replace(/s$/, "");
  if (normalised === "both") {
    return petsData;
  }
  let result = [];
  for (let i = 0; i < petsData.length; i = i + 1) {
    const pet = petsData[i]; // текущий питомец
    if (pet.category === normalised) {
      result.push(pet); //возвращает отфильтрованный массив либюо только коты, либюо только собаки, либо все
    }
  }
  return result;
}

//кнопка переключает категории благодаря функции выше + подсвечивает кнопку категории
function switchCategory(category) {
  //параметр - слово на кнопке
  currentCategory = category;

  document.querySelectorAll(".pet-category-btn").forEach(function (btn) {
    if (btn.textContent.trimEnd() === category) {
      btn.classList.add("active-category-btn");
    } else {
      btn.classList.remove("active-category-btn");
    }
  });
  const filtered = filterCards(category);
  renderPets(filtered);
}
//вешаем обработчик на кнопки категорий
document.querySelectorAll(".pet-category-btn").forEach(function (btn) {
  btn.addEventListener("click", function (event) {
    event.preventDefault; // Отменяем переход по href="#" — иначе страница прыгнет вверх
    switchCategory(btn.textContent.trim());
  });
});

//JSON нужно скачать и распарсить

// fetch("pets.json")
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     petsData = data;
//     renderPets(petsData);
//   })
//   .catch(function (error) {
//     console.error("Ошибка при загрузке pets.json:", error);
//   });
