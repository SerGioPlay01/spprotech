document.addEventListener('DOMContentLoaded', function () {
    const popupOverlay = document.createElement('div');
    popupOverlay.id = 'popup-overlay';

    const popupContainer = document.createElement('div');
    popupContainer.id = 'popup-container';

    const popupImage = document.createElement('img');

    popupContainer.appendChild(popupImage);
    popupOverlay.appendChild(popupContainer);

    const popupControls = document.createElement('div');
    popupControls.id = 'popup-controls';

    const closeButton = document.createElement('button');
    closeButton.id = 'popup-close-button';
    closeButton.innerHTML = '&times;';

    const zoomInButton = document.createElement('button');
    zoomInButton.id = 'zoom-in-button';
    zoomInButton.textContent = '+';

    const zoomOutButton = document.createElement('button');
    zoomOutButton.id = 'zoom-out-button';
    zoomOutButton.textContent = '−';

    popupControls.appendChild(zoomInButton);
    popupControls.appendChild(zoomOutButton);
    popupControls.appendChild(closeButton);

    popupOverlay.appendChild(popupControls);

    // Блок подсказок
    const popupHints = document.createElement('div');
    popupHints.id = 'popup-hints';
    popupHints.innerHTML = `
    <div class="hint">🔍 Зажмите ЛКМ для увеличения и перемещения</div>
    <div class="hint">🔄 Используйте колесо мыши или жест масштабирования</div>
    <div class="hint">❌ Кликните вне изображения или нажмите ESC для закрытия</div>`;
    popupOverlay.appendChild(popupHints);

    document.body.appendChild(popupOverlay);

    let scale = 1;
    let translateX = 0, translateY = 0;
    let isDragging = false;
    let startX = 0, startY = 0;
    let lastX = 0, lastY = 0;
    let initialTouchDistance = null;
    let initialTouchScale = null;

    const scaleStep = 0.1;
    const maxScale = 3;
    const minScale = 1;

    function updateTransform() {
        popupImage.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    }

    function resetImage() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    }

    function openPopup(imgSrc) {
        popupImage.src = imgSrc;
        resetImage();
        popupOverlay.classList.add('show');
        showHints();
    }

    function closePopup() {
        popupOverlay.classList.remove('show');
        setTimeout(resetImage, 300);
    }

    function showHints() {
        popupHints.classList.add('visible');
        hintsVisible = true;
        setTimeout(() => {
            hideHints();
        }, 5000); // Подсказки исчезают через 5 секунд
    }

    function hideHints() {
        if (hintsVisible) {
            popupHints.classList.remove('visible');
            hintsVisible = false;
        }
    }

    popupOverlay.addEventListener('click', function (e) {
        if (e.target === popupOverlay) {
            closePopup();
        }
    });

    popupContainer.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    popupControls.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    zoomInButton.addEventListener('click', function (e) {
        e.stopPropagation();
        scale = Math.min(scale + scaleStep, maxScale);
        updateTransform();
    });

    zoomOutButton.addEventListener('click', function (e) {
        e.stopPropagation();
        scale = Math.max(scale - scaleStep, minScale);
        if (scale === minScale) {
            resetImage();
        }
        updateTransform();
    });

    closeButton.addEventListener('click', function (e) {
        e.stopPropagation();
        closePopup();
    });

    popupImage.addEventListener('wheel', function (e) {
        e.preventDefault();
        if (e.deltaY < 0) {
            scale = Math.min(scale + scaleStep, maxScale);
        } else {
            scale = Math.max(scale - scaleStep, minScale);
            if (scale === minScale) {
                resetImage();
            }
        }
        updateTransform();
    });

    popupImage.addEventListener('mousedown', function (e) {
        if (e.button === 0 && scale > 1) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            lastX = translateX;
            lastY = translateY;
            popupImage.style.cursor = 'grabbing';
            hideHints();
        }
    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            translateX = lastX + (e.clientX - startX);
            translateY = lastY + (e.clientY - startY);
            updateTransform();
        }
    });

    document.addEventListener('mouseup', function () {
        if (isDragging) {
            resetImage(); // Возвращаем изображение в центр при отпускании ЛКМ
        }
        isDragging = false;
        popupImage.style.cursor = 'grab';
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closePopup();
        }
    });

    popupImage.addEventListener('touchstart', function (e) {
        if (e.touches.length === 1 && scale > 1) {
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            lastX = translateX;
            lastY = translateY;
        } else if (e.touches.length === 2) {
            e.preventDefault();
            initialTouchDistance = getDistance(e.touches[0], e.touches[1]);
            initialTouchScale = scale;
        }
    }, { passive: false });

    popupImage.addEventListener('touchmove', function (e) {
        if (e.touches.length === 1 && isDragging) {
            e.preventDefault();
            translateX = lastX + (e.touches[0].clientX - startX);
            translateY = lastY + (e.touches[0].clientY - startY);
            updateTransform();
        } else if (e.touches.length === 2 && initialTouchDistance !== null) {
            e.preventDefault();
            const currentDistance = getDistance(e.touches[0], e.touches[1]);
            const scaleFactor = currentDistance / initialTouchDistance;
            let newScale = initialTouchScale * scaleFactor;
            scale = Math.min(maxScale, Math.max(minScale, newScale));
            updateTransform();
        }
    }, { passive: false });

    popupImage.addEventListener('touchend', function (e) {
        if (e.touches.length < 2) {
            initialTouchDistance = null;
            initialTouchScale = null;
            isDragging = false;
        }
    });

    function getDistance(touch1, touch2) {
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        return Math.hypot(dx, dy);
    }

    document.querySelectorAll('.popup_img').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            openPopup(link.getAttribute('href'));
        });
    });
});
