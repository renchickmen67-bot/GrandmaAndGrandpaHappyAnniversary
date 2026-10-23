const giftsData = [
  { photo: "images/photo10.jpg", text: "Спасибо за ваши теплые объятия и мудрые советы! Мы вас очень любим!" },
  { photo: "images/p8.jpg", text: "Пусть каждый день будет наполнен радостью, как в тот день, когда вы встретились." },
  { photo: "images/p7.jpg", text: "Вы — наша опора и пример настоящей семьи. С годовщиной!" },
  { photo: "images/p0.jpg", text: "Желаем здоровья и долгих лет вместе, чтобы мы могли чаще собираться всей семьей!" },
  { photo: "images/p4.jpg", text: "Ваша история любви вдохновляет нас каждый день. Спасибо, что вы есть!" },
  { photo: "images/p2.jpg", text: "Пусть в вашем доме всегда царит уют, а сердца бьются в унисон!" },
  { photo: "images/p6.jpg", text: "С каждым годом ваша любовь становится только крепче. Мы гордимся вами!" },
  { photo: "images/p1.jpg", text: "Спасибо за все моменты, которые мы провели вместе. Вы — лучшие!" },
  { photo: "images/p3.jpg", text: "Пусть впереди будет еще много счастливых дней и годовщин!" },
  { photo: "images/p5.jpg", text: "Вы научили нас главному — ценить семью и друг друга. Спасибо!" }
];

const canvas = document.getElementById('canvas');
let ctx;
let width, height;
let petals = [];
let hearts = []; // Массив для активных сердец
const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// --- НАСТРОЙКИ ЛИМИТОВ (чтобы не нагружать телефон) ---
const MAX_PETALS = isMobile ? 30 : 60;       // Лимит лепестков
const HEARTS_PER_CLICK = isMobile ? 10 : 20; // Сколько сердец добавить за клик
const MAX_ACTIVE_HEARTS = isMobile ? 50 : 100; // Лимит одновременно летящих сердец

if (canvas) {
  ctx = canvas.getContext('2d', { alpha: false });
  
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resize);
  resize();

  // Инициализация лепестков
  for (let i = 0; i < MAX_PETALS; i++) {
    petals.push(new Petal());
  }
}

// === КЛАССЫ АНИМАЦИИ ===

class Petal {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * width;
    this.y = -Math.random() * 60;
    const baseSize = width > 768 ? 12 : 8; 
    this.size = baseSize + Math.random() * 8;
    this.speedY = 0.5 + Math.random() * 0.6;
    this.drift = (Math.random() - 0.5) * 1.5;
    
    // Цвет лепестка (нежно-розовый)
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
    
    // Сердце летит вверх и немного в сторону
    this.speedY = -(1.0 + Math.random() * 0.8);
    this.drift = (Math.random() - 0.5) * 2.0;
    
    this.life = 1.0;      // Прозрачность (от 1 до 0)
    this.decay = 0.004;   // Скорость исчезновения
    
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
    
    // Удаляем сердце, если оно полностью исчезло или улетело далеко вверх
    if (this.life <= 0 || this.y < -100) {
      return false;
    }
    return true;
  }

  draw() {
    const s = this.size;
    const alpha = Math.max(0, this.life);
    // Получаем RGB из строки цвета
    const rgb = this.color.match(/\d+/g);
    if (!rgb) return;
    
    ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Рисуем сердце через path
    ctx.beginPath();
    ctx.moveTo(s * 0.5, s * 0.4);
    ctx.bezierCurveTo(s * 0.2, s * 0.1, s * 0.05, s * 0.3, s * 0.15, s * 0.5);
    ctx.bezierCurveTo(s * 0.3, s * 0.7, s * 0.5, s * 0.9, s * 0.7, s * 0.7);
    ctx.bezierCurveTo(s * 0.85, s * 0.5, s * 0.95, s * 0.3, s * 0.75, s * 0.1);
    ctx.bezierCurveTo(s * 0.6, s * 0.15, s * 0.5, s * 0.3, s * 0.5, s * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

// === ФУНКЦИИ ДЛЯ КНОПОК И МЕНЮ ===

// 1. Функция добавления сердец
window.addExtraHearts = function() {
  if (!canvas) return;
  
  // Если уже слишком много сердец, не добавляем новые, пока старые не исчезнут
  if (hearts.length >= MAX_ACTIVE_HEARTS) {
    console.log('Лимит сердец достигнут, ждем исчезновения старых');
    return;
  }

  const count = Math.min(HEARTS_PER_CLICK, MAX_ACTIVE_HEARTS - hearts.length);
  
  for (let i = 0; i < count; i++) {
    // Создаем сердце в случайной точке по ширине экрана
    const startX = Math.random() * width;
    const startY = height - 50; // Чуть выше низа экрана
    hearts.push(new Heart(startX, startY));
  }
};

// 2. Функция переключения меню
window.toggleMenu = function() {
  const menuLayer = document.getElementById('menu-layer');
  if (!menuLayer) return;
  
  if (menuLayer.classList.contains('active')) {
    menuLayer.classList.remove('active');
  } else {
    menuLayer.classList.add('active');
    renderGifts(); // Генерируем карточки только когда открыли меню (экономия ресурсов)
  }
};

// 3. Генерация карточек подарков
function renderGifts() {
  const container = document.getElementById('gifts-container');
  if (!container) return;

  // Если карточки уже есть, не дублируем их
  if (container.children.length > 0) return;

  giftsData.forEach((gift, index) => {
    const card = document.createElement('div');
    card.className = 'gift-card';
    
    // Добавляем ленточку и бантик через HTML
    card.innerHTML = `
      <div class="ribbon"></div>
      <div class="bow"></div>
      <div class="hover-hint">Нажми, чтобы открыть</div>
      
      <!-- Скрытая карточка с фото и текстом -->
      <div class="inline-card">
        <img src="${gift.photo}" alt="Подарок" class="inline-photo" onerror="this.style.display='none'; this.parentElement.innerHTML='<span style=\"color:#777\">Нет фото</span>'">
        <div class="inline-wishes">
          ${gift.text}
        </div>
        <button style="padding:10px 20px; background:#333; color:white; border:none; border-radius:6px; cursor:pointer; margin-top:10px;">Закрыть</button>
      </div>
    `;

    // Логика открытия карточки
    card.querySelector('.inline-card button').onclick = (e) => {
      e.stopPropagation();
      card.classList.remove('open');
    };

    card.onclick = () => {
      card.classList.toggle('open');
    };

    container.appendChild(card);
  });
}

// === ГЛАВНЫЙ ЦИКЛ АНИМАЦИИ ===
function animate() {
  // Очищаем холст только прозрачным цветом (чтобы не мерцало)
  ctx.clearRect(0, 0, width, height);

  // Обновляем и рисуем лепестки
  petals.forEach(p => {
    p.update();
    p.draw();
  });

  // Обновляем и рисуем сердца
  // Фильтруем массив: оставляем только живые сердца
  hearts = hearts.filter(h => {
    h.update();
    h.draw();
    return h.life > 0 && h.y > -100;
  });

  requestAnimationFrame(animate);
}

// Запуск анимации
if (canvas) {
  animate();
}
