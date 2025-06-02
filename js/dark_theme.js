document.addEventListener("DOMContentLoaded", function () {
    const themeToggleBtn = document.querySelector(".btn-darkmode");
    const body = document.body;
    let userSetTheme = localStorage.getItem("theme");

    function setTheme(mode, isUserChoice = false) {
        const isDarkMode = mode === "dark";
        body.classList.toggle("scheme_dark", isDarkMode);
        themeToggleBtn.dataset.theme = isDarkMode ? "dark" : "light";

        if (isUserChoice) {
            localStorage.setItem("theme", mode);
        } else {
            localStorage.removeItem("theme"); // Очищаем, если тема устанавливается по системе
        }
    }

    // Устанавливаем тему в зависимости от пользователя или системы
    function applyInitialTheme() {
        if (userSetTheme) {
            setTheme(userSetTheme, true);
        } else {
            setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        }
    }

    // Следим за изменением системной темы
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
            setTheme(e.matches ? "dark" : "light");
        }
    });

    // Обработчик кнопки смены темы
    themeToggleBtn.addEventListener("click", function () {
        const newTheme = body.classList.contains("scheme_dark") ? "light" : "dark";
        setTheme(newTheme, true);
    });

    applyInitialTheme();
});
