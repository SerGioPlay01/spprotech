document.addEventListener("DOMContentLoaded", function () {
    const lazyImages = document.querySelectorAll("img[loading='lazy']");

    if ("IntersectionObserver" in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src; // Загружаем изображение
                    img.removeAttribute("loading"); // Удаляем атрибут lazy
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    } else {
        // Fallback для старых браузеров
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
});
