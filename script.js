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
const sliderTrack = document.getElementById("sliderTrack");
const sliderPrev = document.getElementById("sliderPrev");
const sliderNext = document.getElementById("sliderNext");
const modal = document.getElementById("petModal");
const modalBody = document.getElementById("modalBody");

fetch("pets.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    petsData = data;
    renderVisiblePets(petsData);
    renderSlider();
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

function renderSlider() {
  if (!sliderTrack) return; // если слайдера на странице нет — выходим
  const sliderPets = petsData.slice(0, 5); // берём первых 3 питомца
  sliderTrack.innerHTML = sliderPets.map(createIndexCards).join("");
  attachCardHandlers(); // навешиваем обработчики на кнопки «Learn more»
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
  visibleCount = CARDS_PER_STEP; // сброс при смене категории
  document.querySelectorAll(".pet-category-btn").forEach(function (btn) {
    if (btn.textContent.trim() === category) {
      btn.classList.add("active-category-btn");
    } else {
      btn.classList.remove("active-category-btn");
    }
  });
  const filtered = filterCards(category);
  renderVisiblePets(filtered);
}
//вешаем обработчик на кнопки категорий
document.querySelectorAll(".pet-category-btn").forEach(function (btn) {
  btn.addEventListener("click", function (event) {
    event.preventDefault(); // Отменяем переход по href="#" — иначе страница прыгнет вверх
    switchCategory(btn.textContent.trim());
  });
});

//создание карточек на главной
function createIndexCards(pet) {
  return `
  <div class ="pet-card" data-id ="${pet.id}">
  <img src ="${pet.image}" alt ="${pet.name}" class="pet-card-image">
  <p>${pet.name}</p>
  <a href ="#" class="pet-card-button">Learn more</a>
  </div>
  `;
}

// СЛАЙДЕР НА ГЛАВНОЙ
if (sliderTrack && sliderPrev && sliderNext) {
  const CARD_WIDTH = 270;
  const GAP = 40;
  const STEP = CARD_WIDTH + GAP;
  const VISIBLE_COUNT = 3;

  // Стартовая позиция — средняя, чтобы были скрытые карточки слева и справа
  let currentIndex = 1;

  // Сдвигает трек на нужное число пикселей
  function updateSlider() {
    const offset = -currentIndex * STEP;
    sliderTrack.style.transform = `translateX(${offset}px)`;
  }

  // Обновляет активность кнопок
  function updateButtons() {
    const cards = sliderTrack.querySelectorAll(".pet-card");
    const maxIndex = Math.max(0, cards.length - VISIBLE_COUNT);

    if (currentIndex <= 0) {
      sliderPrev.classList.add("disabled");
    } else {
      sliderPrev.classList.remove("disabled");
    }

    if (currentIndex >= maxIndex) {
      sliderNext.classList.add("disabled");
    } else {
      sliderNext.classList.remove("disabled");
    }
  }

  // Клик «→» — сдвиг влево (показать правую карточку)
  sliderNext.addEventListener("click", function () {
    const cards = sliderTrack.querySelectorAll(".pet-card");
    const maxIndex = Math.max(0, cards.length - VISIBLE_COUNT);

    if (currentIndex < maxIndex) {
      currentIndex = currentIndex + 1;
      updateSlider();
      updateButtons();
    }
  });

  // Клик «←» — сдвиг вправо (показать левую карточку)
  sliderPrev.addEventListener("click", function () {
    if (currentIndex > 0) {
      currentIndex = currentIndex - 1;
      updateSlider();
      updateButtons();
    }
  });

  // Применяем стартовое состояние
  updateSlider();
  updateButtons();
}

//кнопка для показа большего кол-ва карточек
let visibleCount = 4;
const CARDS_PER_STEP = 4;
const showMoreBtn = document.getElementById("showMoreBtn");

function renderVisiblePets(pets) {
  const visible = pets.slice(0, visibleCount);
  renderPets(visible);
  if (!showMoreBtn) return;
  // показать/скрыть кнопку
  if (visibleCount < pets.length) {
    showMoreBtn.style.display = "inline-block";
  } else {
    showMoreBtn.style.display = "none";
  }
}

//обработчик кнопки

if (showMoreBtn) {
  showMoreBtn.addEventListener("click", function () {
    visibleCount = visibleCount + CARDS_PER_STEP;
    const filtered = filterCards(currentCategory);
    renderVisiblePets(filtered);
  });
}
