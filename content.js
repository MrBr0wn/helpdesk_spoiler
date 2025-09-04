(function() {
    'use strict';
    
    // Функция для создания спойлера
    function createSpoiler(wikiElement) {
        // Сохраняем оригинальные стили для восстановления
        const originalStyles = {
            display: wikiElement.style.display,
            visibility: wikiElement.style.visibility
        };
        
        // Создаем контейнер для спойлера
        const spoilerContainer = document.createElement('div');
        spoilerContainer.className = 'wiki-spoiler-container';
        
        // Создаем кнопку спойлера
        const spoilerButton = document.createElement('button');
        spoilerButton.className = 'wiki-spoiler-button';
        spoilerButton.innerHTML = `
            <span>📁 Content (click to show)</span>
            <span class="spoiler-arrow">▼</span>
        `;
        
        // Создаем контейнер для контента
        const spoilerContent = document.createElement('div');
        spoilerContent.className = 'wiki-spoiler-content';
        
        // Перемещаем содержимое wikiElement в спойлер
        while (wikiElement.firstChild) {
            spoilerContent.appendChild(wikiElement.firstChild);
        }
        
        // Добавляем элементы в контейнер
        spoilerContainer.appendChild(spoilerButton);
        spoilerContainer.appendChild(spoilerContent);
        
        // Заменяем оригинальный элемент на спойлер
        wikiElement.parentNode.replaceChild(spoilerContainer, wikiElement);
        
        // Обработчик клика на кнопку
        spoilerButton.addEventListener('click', function() {
            const isVisible = spoilerContent.classList.contains('visible');
            const arrow = this.querySelector('.spoiler-arrow');
            
            if (isVisible) {
                spoilerContent.classList.remove('visible');
                arrow.classList.remove('rotated');
                this.querySelector('span').textContent = '📁 Content (click to show)';
            } else {
                spoilerContent.classList.add('visible');
                arrow.classList.add('rotated');
                this.querySelector('span').textContent = '📂 Content (click to hide)';
            }
        });
        
        return spoilerContainer;
    }
    
    // Функция для поиска и обработки div.wiki
    function processWikiElements() {
        const wikiElements = document.querySelectorAll('div.note div.wiki');
        
        if (wikiElements.length > 0) {
            console.log(`Найдено ${wikiElements.length} элементов div.wiki`);
            
            wikiElements.forEach((element, index) => {
                console.log(`Обрабатываем элемент ${index + 1}`);
                createSpoiler(element);
            });
        }
    }
    
    // Запускаем обработку при загрузке страницы
    if (document.readyState === 'complete') {
        document.addEventListener('DOMContentLoaded', processWikiElements);
    } else {
        processWikiElements();
    }
    
    // Также обрабатываем динамически подгружаемый контент
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        const wikiElements = node.querySelectorAll ? 
                            node.querySelectorAll('div.note div.wiki') : [];
                        
                        if (wikiElements.length > 0) {
                            wikiElements.forEach(createSpoiler);
                        }
                        
                        // Если сам добавленный node является div.wiki
                        if (node.matches && node.matches('div.note div.wiki')) {
                            createSpoiler(node);
                        }
                    }
                });
            }
        });
    });
    
    // Начинаем наблюдение за изменениями DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();