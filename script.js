// script.js
const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');

let score = 0;
let playerX = window.innerWidth / 2;
let fallingItems = [];
let gameInterval;
let itemInterval;

// 更新玩家位置
function updatePlayerPosition() {
  player.style.left = `${playerX}px`;
}

// 生成随机掉落道具
function createFallingItem() {
  const item = document.createElement('div');
  item.classList.add('falling-item');
  item.style.left = `${Math.random() * window.innerWidth}px`;
  item.style.top = '0px';
  gameContainer.appendChild(item);
  fallingItems.push(item);
}

// 更新道具位置
function updateFallingItems() {
  fallingItems.forEach((item, index) => {
    const itemRect = item.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    item.style.top = `${itemRect.top + 5}px`;

    // 检测碰撞
    if (
      itemRect.bottom >= playerRect.top &&
      itemRect.left < playerRect.right &&
      itemRect.right > playerRect.left
    ) {
      gameContainer.removeChild(item);
      fallingItems.splice(index, 1);
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
    }

    // 移除出屏幕的道具
    if (itemRect.top > window.innerHeight) {
      gameContainer.removeChild(item);
      fallingItems.splice(index, 1);
    }
  });
}

// 控制角色移动
function handleTouchMove(event) {
  playerX = event.touches[0].clientX;
  updatePlayerPosition();
}

function handleKeyDown(event) {
  if (event.key === 'ArrowLeft') playerX -= 20;
  if (event.key === 'ArrowRight') playerX += 20;
  playerX = Math.max(0, Math.min(playerX, window.innerWidth - 50)); // 边界控制
  updatePlayerPosition();
}

// 初始化游戏
function startGame() {
  updatePlayerPosition();
  gameInterval = setInterval(updateFallingItems, 50);
  itemInterval = setInterval(createFallingItem, 1000);
}

function stopGame() {
  clearInterval(gameInterval);
  clearInterval(itemInterval);
  alert(`Game Over! Final Score: ${score}`);
}

// 绑定事件
window.addEventListener('touchmove', handleTouchMove);
window.addEventListener('keydown', handleKeyDown);

// 开始游戏
startGame();