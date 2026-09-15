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
