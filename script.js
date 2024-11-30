// script.js
const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');

let score = 0;
let currentLane = 1; // 0: 左, 1: 中, 2: 右
const lanes = [window.innerWidth / 6, window.innerWidth / 2, (5 * window.innerWidth) / 6];
let fallingItems = [];
let gameInterval;
let itemInterval;
let lastTouchTime = 0;

document.addEventListener('touchstart', (e) => {
  const currentTime = new Date().getTime();
  if (currentTime - lastTouchTime < 300) {
    e.preventDefault();
  }
  lastTouchTime = currentTime;
}, { passive: false });
// 更新玩家位置
function updatePlayerPosition() {
  player.style.left = `${lanes[currentLane] - player.offsetWidth / 2}px`;
}

// 生成掉落道具
function createFallingItem() {
  const item = document.createElement('div');
  item.classList.add('falling-item');
  const laneIndex = Math.floor(Math.random() * 3); // 随机选择路径
  item.style.left = `${lanes[laneIndex] - 15}px`;
  item.style.top = '0px';
  gameContainer.appendChild(item);
  fallingItems.push(item);
}

// 更新道具位置
function updateFallingItems() {
  fallingItems.forEach((item, index) => {
    const itemRect = item.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    // 道具下落
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

    // 检测是否到达底部
    if (itemRect.top > window.innerHeight) {
      gameContainer.removeChild(item);
      fallingItems.splice(index, 1);
    }
  });
}

// 按钮控制
leftButton.addEventListener('click', () => {
  currentLane = Math.max(0, currentLane - 1); // 左移一栏
  updatePlayerPosition();
});

rightButton.addEventListener('click', () => {
  currentLane = Math.min(2, currentLane + 1); // 右移一栏
  updatePlayerPosition();
});

// 初始化游戏
function startGame() {
  updatePlayerPosition();
  gameInterval = setInterval(updateFallingItems, 50);
  itemInterval = setInterval(createFallingItem, 1000);
}

startGame();
