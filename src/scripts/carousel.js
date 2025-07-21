// carousel.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const carouselContainer = document.querySelector('.carousel-container');
    const carouselTrack = document.querySelector('.carousel-track');
    // REMOVED: flipbookFrame and backButton DOM elements

    // --- Configuration ---
    const baseYears = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
    const years = [...baseYears, ...baseYears, ...baseYears];
    const activeItemTolerance = 50;

    // --- State Variables ---
    let currentPosition = 0;
    let targetPosition = 0;
    let isAnimating = false;
    let itemWidth = 0;
    let totalBaseWidth = 0;

    /**
     * Initializes the carousel by generating items, applying colors,
     * and calculating dimensions for infinite scrolling.
     */
    function initializeCarouselItems() {
      const carouselHTML = years.map(year => `
        <div class="carousel-item book-${year}" data-year="${year}">
            <div class="year-label">${year}</div>
        </div>
      `).join('');
      carouselTrack.innerHTML = carouselHTML;

      setTimeout(() => {
        const items = document.querySelectorAll('.carousel-item');
        if (items.length > 0) {
          const style = getComputedStyle(carouselTrack);
          const gap = parseFloat(style.getPropertyValue('gap')) || 0;

          itemWidth = items[0].offsetWidth + gap;
          totalBaseWidth = baseYears.length * itemWidth;

          currentPosition = -totalBaseWidth;
          targetPosition = -totalBaseWidth;
          carouselTrack.style.transform = `translateX(${currentPosition}px)`;
        }
        updateActiveItem();
      }, 0);
    }

    /**
     * Animates the carousel track to move from currentPosition towards targetPosition.
     * Uses requestAnimationFrame for smooth, browser-optimized animation.
     */
    function animateCarousel() {
      if (Math.abs(targetPosition - currentPosition) < 0.5) {
        isAnimating = false;
        currentPosition = targetPosition;
        carouselTrack.style.transform = `translateX(${currentPosition}px)`;
        return;
      }

      isAnimating = true;
      currentPosition += (targetPosition - currentPosition) * 0.1;
      carouselTrack.style.transform = `translateX(${currentPosition}px)`;

      requestAnimationFrame(animateCarousel);
      updateActiveItem();
    }

    /**
     * Identifies and marks the carousel item closest to the center as 'active'.
     */
    function updateActiveItem() {
      const containerCenter = carouselContainer.getBoundingClientRect().left + carouselContainer.offsetWidth / 2;
      let closestItem = null;
      let minDistance = Infinity;

      document.querySelectorAll('.carousel-item').forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const distance = Math.abs(itemCenter - containerCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestItem = item;
        }
        item.classList.remove('active');
      });

      if (closestItem) {
        closestItem.classList.add('active');
      }
    }

    /**
     * Handles carousel scrolling logic, including infinite looping.
     * @param {number} delta - The amount to move the targetPosition.
     */
    function handleScroll(delta) {
        targetPosition += delta;

        if (targetPosition > 0) {
            targetPosition -= totalBaseWidth;
            currentPosition -= totalBaseWidth;
            carouselTrack.style.transform = `translateX(${currentPosition}px)`;
        } else if (targetPosition < -totalBaseWidth * 2) {
            targetPosition += totalBaseWidth;
            currentPosition += totalBaseWidth;
            carouselTrack.style.transform = `translateX(${currentPosition}px)`;
        }

        if (!isAnimating) {
            requestAnimationFrame(animateCarousel);
        }
    }

    /**
     * Opens the selected flipbook in a new tab/window.
     * @param {number} year - The year of the flipbook to open.
     */
    function openFlipbook(year) {
        window.open(`views/${year}.html`, '_blank'); 
    }

    // --- Initialize and Attach Events ---

    initializeCarouselItems();

    // Wheel event for desktop scrolling
    carouselContainer.addEventListener('wheel', e => {
        e.preventDefault();
        handleScroll(-e.deltaY * 0.5);
    });

    // Mouse drag functionality
    let isDragging = false;
    let startX = 0;

    carouselContainer.addEventListener('mousedown', e => {
        isDragging = true;
        startX = e.clientX;
        carouselTrack.style.transition = 'none';
    });

    window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        handleScroll((e.clientX - startX) * 2);
        startX = e.clientX;
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            carouselTrack.style.transition = '';
            requestAnimationFrame(animateCarousel);
        }
    });

    // Touch drag functionality for mobile devices
    carouselContainer.addEventListener('touchstart', e => {
        isDragging = true;
        startX = e.touches[0].clientX;
        carouselTrack.style.transition = 'none';
    });

    carouselContainer.addEventListener('touchmove', e => {
        if (!isDragging) return;
        e.preventDefault();
        handleScroll((e.touches[0].clientX - startX) * 2);
        startX = e.touches[0].clientX;
    });

    carouselContainer.addEventListener('touchend', () => {
        if (isDragging) {
            isDragging = false;
            carouselTrack.style.transition = '';
            requestAnimationFrame(animateCarousel);
        }
    });

    // Click handler for carousel items
    carouselTrack.addEventListener('click', e => {
        const clickedItem = e.target.closest('.carousel-item');
        if (clickedItem) {
            const rect = clickedItem.getBoundingClientRect();
            const itemCenter = rect.left + rect.width / 2;
            const containerCenter = carouselContainer.getBoundingClientRect().left + carouselContainer.offsetWidth / 2;

            if (Math.abs(itemCenter - containerCenter) < activeItemTolerance) {
                const year = clickedItem.dataset.year;
                openFlipbook(year);
            } else {
                const offset = (containerCenter - itemCenter);
                targetPosition += offset;
                requestAnimationFrame(animateCarousel);
            }
        }
    });

});
