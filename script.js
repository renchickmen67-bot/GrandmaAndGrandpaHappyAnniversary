const giftsData = [
  { photo: "images/photo10.jpg", text: "Спасибо за ваши тёплые объятия и мудрые советы! Мы вас очень любим!" },
  { photo: "images/p8.jpg", text: "Пусть каждый день будет наполнен радостью, как в тот день, когда вы встретились." },
  { photo: "images/p7.jpg", text: "Вы — наша опора и пример настоящей семьи. С годовщиной!" },
  { photo: "images/p0.jpg", text: "Желаем здоровья и долгих лет вместе, чтобы мы могли чаще собираться всей семьёй!" },
  { photo: "images/p4.jpg", text: "Ваша история любви вдохновляет нас каждый день. Спасибо, что вы есть!" },
  { photo: "images/p2.jpg", text: "Пусть в вашем доме всегда царит уют, а сердца бьются в унисон!" },
  { photo: "images/p6.jpg", text: "С каждым годом ваша любовь становится только крепче. Мы гордимся вами!" },
  { photo: "images/p1.jpg", text: "Спасибо за все моменты, которые мы провели вместе. Вы — лучшие!" },
  { photo: "images/p3.jpg", text: "Пусть впереди будет ещё много счастливых дней и годовщин!" },
  { photo: "images/p5.jpg", text: "Вы научили нас главному — ценить семью и друг друга. Спасибо!" }
];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { alpha: false });
let width, height;

const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const petalCount = isMobile ? 30 : 60;
const heartCountPerClick = isMobile ? 15 : 30;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
window.addEventListener('resize', resize);
resize();

class Petal {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * width;
    this.y = -Math.random() * 60;
    const baseSize = width > 768 ? 12 : 8; 
    this.size = baseSize + Math.random() * 8;
    this.speedY = 0.5 + Math.random() * 0.6;
    this.drift = (Math.random() - 0.5) * 1.5;
    const r = 240 + Math.random() * 15;
    const g = 185 + Math.random() * 20;
    const b = 190 + Math.random() * 20;
    this.color = `rgba(${r}, ${g}, ${b}, 0.9)`;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.05;
  }
  update() {
    this.y += this.speedY;
    this.x += this.drift;
    this.rotation += this.rotSpeed;
    if (this.y > height) this.reset();
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size / 1.3, this.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class Heart {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    const baseSize = width > 768 ? 20 : 14;
    this.size = baseSize + Math.random() * 10; 
    this.speedY = -(1.0 + Math.random() * 0.8);
    this.drift = (Math.random() - 0.5) * 2.0;
    this.life = 1.0;
    this.decay = 0.004;

    const r = 255;
    const g = 90 + Math.random() * 50;
    const b = 100 + Math.random() * 40;
    this.color = `rgba(${r}, ${g}, ${b}, 0.95)`;
    this.rotation = 0;
    this.rotSpeed = (Math.random() - 0.5) * 0.06;
  }

  update() {
    this.y += this.speedY;
    this.x += this.drift;
    this.rotation += this.rotSpeed;
    this.life -= this.decay;
    
    if (this.life <= 0 || this.y < -100) {
      return false;
    }
    return true;
  }

  draw() {
    const s = this.size;
    const alpha = Math.max(0, this.life);
    // Исправлено: корректно извлекаем RGB из this.color
    const match = this.color.match(/\d+/g);
    if (!match || match.length < 3) return;
    const [r, g, b] = match.slice(0, 3);

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.beginPath();
    ctx.moveTo(0, s * 0.4);
    ctx.bezierCurveTo(0, -s * 0.1, -s * 0.35, -s * 0.3, -s * 0.45, 0);
    ctx.bezierCurveTo(-s * 0.35, s * 0.3, 0, s * 0.6, s * 0.45, 0);
    ctx.bezierCurveTo(s * 0.35, -s * 0.3, s * 0.35, -s * 0.1, 0, s * 0.4);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

// ИСПРАВЛЕНО: инициализация массивов
const petals = [];
for (let i = 0; i < petalCount; i++) {
  petals.push(new Petal());
}

const extraHearts = [];

function addExtraHearts() {
  for (let i = 0; i < heartCountPerClick; i++) {
    const startX = Math.random() * width;
    const startY = Math.random() * height;
    extraHearts.push(new Heart(startX, startY));
  }
}

function toggleMenu() {
  const menu = document.getElementById('menu-layer');
  if (!menu) return;
  menu.classList.toggle('active');
  if (menu.classList.contains('active')) {
    menu.scrollTop = 0;
  }
}

const giftsContainer = document.getElementById('gifts-container');
if (giftsContainer) {
  giftsData.forEach((gift, index) => {
    const card = document.createElement('div');
    card.className = 'gift-card';
    // ИСПРАВЛЕНО: правильные обратные кавычки и синтаксис шаблонов
    card.innerHTML = `
      <div class="ribbon"></div>
      <div class="bow"></div>
      <div class="hover-hint">Жми!</div>
      <div class="confetti-container-local"></div>
      <div class="inline-card" id="inline-card-${index}">
        <img src="${gift.photo}" alt="Подарок" class="inline-photo">
        <p class="inline-wishes">${gift.text}</p>
      </div>
    `;
    card.onclick = () => openGiftCard(gift, card, index);
    giftsContainer.appendChild(card);
  });
}

function openGiftCard(data, triggerCard, index) {
  const inlineCard = document.getElementById(`inline-card-${index}`);
  if (!inlineCard) return;

  triggerCard.classList.add('open');
  createLocalConfetti(triggerCard);
}

function createLocalConfetti(cardEl) {
  const layer = cardEl.querySelector('.confetti-container-local');
  if (!layer) return;
  const rect = cardEl.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  while (layer.firstChild) layer.removeChild(layer.firstChild);

  for (let i = 0; i < 40; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = centerX + 'px';
    c.style.top = centerY + 'px';
    c.style.width = (8 + Math.random() * 4) + 'px';
    c.style.height = c.style.width;
    c.style.background = `hsl(${Math.random() * 360}, 70%, 55%)`;
    c.style.animationDuration = (1.0 + Math.random() * 0.4) + 's';
    layer.appendChild(c);
  }
}

function animate() {
  ctx.fillStyle = '#fbf0e6';
  ctx.fillRect(0, 0, width, height);

  petals.forEach(p => { p.update(); p.draw(); });

  for (let i = extraHearts.length - 1; i >= 0; i--) {
    if (!extraHearts[i].update()) {
      extraHearts.splice(i, 1);
    } else {
      extraHearts[i].draw();
    }
  }

  requestAnimationFrame(animate);
}

animate();
