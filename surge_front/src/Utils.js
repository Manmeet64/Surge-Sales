// rotateCards Function
export function rotateCards() {
  const cards = document.querySelectorAll(".card");
  let angle = 0;

  cards.forEach((card, index) => {
    if (card.classList.contains("away")) {
      card.style.transform = `translateY(-120vh) rotate(-48deg)`;
      card.style.opacity = "0";
    } else {
      card.style.transform = `rotate(${angle}deg)`;
      card.style.opacity = "1";
      angle = angle - 10;
      card.style.zIndex = cards.length - index;
    }
  });
}

// Debounce Function
export function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
