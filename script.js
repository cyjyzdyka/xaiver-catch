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
let fallingSpeed = 2; // 初始速度，像素/帧
let speedIncrementInterval = 5000; // 每隔 5 秒加速一次

const cloudsContainer = document.getElementById('clouds');
const startButton = document.getElementById('start-button');

startButton.addEventListener('click', () => {
  startButton.style.display = 'none';
  gameContainer.style.display = 'block';
  startGame();
});

let health = 5; // 初始血量

function updateHealth() {
  const healthDots = document.querySelectorAll('.health-dot');
  healthDots.forEach((dot, index) => {
    if (index < health) {
      dot.classList.remove('inactive'); // 血量有效
    } else {
      dot.classList.add('inactive'); // 血量扣减变透明
    }
  });

  if (health <= 0) {
    endGame(); // 游戏结束
  }
}
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
const itemImages = {
    food: [
        './images/donut.png',
        './images/hamburger.png',
        './images/pizza.png',
        './images/hot-pot.png',
        './images/biryani.png',
        './images/french-fries.png'
        // 添加更多图片路径
    ],
    bomb:[
       './images/bomb.png'
    ]
};
  
function createFallingItem() {
    const item = document.createElement('img');
    item.classList.add('falling-item');
  
    // 随机决定是食物还是炸弹
    const isFood = Math.random() < 0.8; // 80% 概率是食物
    if (isFood) {
      item.classList.add('food');
      const randomIndex = Math.floor(Math.random() * itemImages.food.length);
      item.src = itemImages.food[randomIndex];
    } else {
      item.classList.add('bomb');
      const randomIndex = Math.floor(Math.random() * itemImages.bomb.length);
      item.src = itemImages.bomb[randomIndex];
    }
  
    const laneIndex = Math.floor(Math.random() * 3);
    item.style.left = `${lanes[laneIndex] - 25}px`;
    item.style.top = '0px';
  
    gameContainer.appendChild(item);
    fallingItems.push(item);
  }
// 更新道具位置
function updateFallingItems() {
    fallingItems.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const playerRect = player.getBoundingClientRect();
  
      // 道具下落，使用 fallingSpeed 控制速度
      item.style.top = `${itemRect.top + fallingSpeed}px`;

  
      // 检测碰撞
      if (
        itemRect.bottom >= playerRect.top &&
        itemRect.left < playerRect.right &&
        itemRect.right > playerRect.left
      ) {
        if (item.classList.contains('food')) {
          // 碰到食物
          player.src = './images/active.png';
          score++;
          scoreDisplay.textContent = `Score: ${score}`;
        } else if (item.classList.contains('bomb')) {
          // 碰到炸弹
          player.src = './images/hurt.png';
          health--;
          updateHealth();
          
        }
  
        // 恢复原始图片
        setTimeout(() => {
          player.src = './images/player.png';
        }, 300);
  
        // 删除道具
        if (gameContainer.contains(item)) {
          gameContainer.removeChild(item);
        }
        fallingItems.splice(index, 1);
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
function endGame() {
    clearInterval(gameInterval);
    clearInterval(itemInterval);
  
    // 显示模态框
    const modal = document.getElementById('game-over-modal');
    const finalScore = document.getElementById('final-score');
    finalScore.textContent = score; // 显示最终得分
    modal.style.display = 'flex'; // 显示模态框
  }
  
  // 添加重新开始按钮的功能
  document.getElementById('restart-button').addEventListener('click', () => {
    location.reload(); // 重新加载页面
  });
startGame();
