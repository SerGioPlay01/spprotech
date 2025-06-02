document.getElementById("homeButton").addEventListener("click", function () {
    document.body.style.opacity = "0"; // Плавное исчезновение страницы
    setTimeout(() => {
        window.location.href = "/"; // Переход на главную (измените, если нужно)
    }, 50); // Задержка перед переходом (0.3 сек)
});
