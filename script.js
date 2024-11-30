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
const cloudsContainer = document.getElementById('clouds');

function createCloud(top, width, height, duration) {
  const cloud = document.createElement('div');
  cloud.classList.add('cloud');
  cloud.style.top = `${top}px`;
  cloud.style.width = `${width}px`;
  cloud.style.height = `${height}px`;
  cloud.style.animationDuration = `${duration}s`;
  cloudsContainer.appendChild(cloud);
}

// 动态生成多层次云朵
for (let i = 0; i < 5; i++) {
  createCloud(
    Math.random() * window.innerHeight, // 随机高度
    100 + Math.random() * 100, // 随机宽度
    60 + Math.random() * 50, // 随机高度
    20 + Math.random() * 10 // 随机动画时长
  );
}
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
        // 碰撞时改变图片
        player.src = './images/active.png'; // 替换为得分图片
  
        // 恢复原始图片
        setTimeout(() => {
          player.src = './images/player.png'; // 替换为原始图片
        }, 300); // 300ms 后恢复原始图片
  
        // 删除道具
        if (gameContainer.contains(item)) {
          gameContainer.removeChild(item);
        }
        fallingItems.splice(index, 1);
  
        // 更新分数
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
      }
  
      // 检测是否到达底部
      if (itemRect.top > window.innerHeight) {
        if (gameContainer.contains(item)) {
          gameContainer.removeChild(item);
        }
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
