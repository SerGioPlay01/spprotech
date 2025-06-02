document.addEventListener("DOMContentLoaded", function () {
    const text = "SP × ProТехнологии";
    const typingElement = document.getElementById("typing-text");
    let index = 0;

    function typeText() {
        if (index < text.length) {
            typingElement.textContent += text[index];
            index++;
            setTimeout(typeText, 50); // Скорость печати (100ms)
        } else {
            setTimeout(() => document.querySelector(".preloader").classList.add("hidden"), 1000);
        }
    }

    typeText();

    // Убираем прелоадер после полной загрузки страницы
    window.addEventListener("load", function () {
        setTimeout(() => document.querySelector(".preloader").classList.add("hidden"), 1000);
    });
});
