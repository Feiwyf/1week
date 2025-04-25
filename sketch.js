let points = [ 
  [-3, 5], [3, 7], [1, 5], [2, 4], 
  [4, 3], [5, 2], [6, 2], [8, 4], 
  [8, -1], [6, 0], [0, -3], [2, -6], 
  [-2, -3], [-4, -2], [-5, -1], [-6, 1], 
  [-6, 2]
]; // 用來儲存點座標的陣列

let song;
let fft;
let positions = [];

function preload() {
  song = loadSound('sunset-beach-259654.mp3'); // 載入音樂檔案
}

function setup() {
  createCanvas(windowWidth, windowHeight); // create a canvas with screen size
  frameRate(2); // 設定每秒幀數為 2，減慢顏色變化速度
  song.play(); // 播放音樂
  fft = new p5.FFT(); // 創建 FFT 物件來分析音頻

  // 初始化每個圖案的位置
  let offsets = [
    {x: -300, y: -300}, {x: -100, y: -300}, {x: 100, y: -300}, {x: 300, y: -300},
    {x: -300, y: -100}, {x: -100, y: -100}, {x: 100, y: -100}, {x: 300, y: -100},
    {x: -300, y: 100}, {x: -100, y: 100}, {x: 100, y: 100}, {x: 300, y: 100},
    {x: -300, y: 300}, {x: -100, y: 300}, {x: 100, y: 300}, {x: 300, y: 300}
  ];
  for (let offset of offsets) {
    positions.push({x: width / 2 + offset.x, y: height / 2 + offset.y});
  }
}

function draw() {
  background(255); // 設定背景為白色
  strokeWeight(2); // 設定線條寬度

  let spectrum = fft.analyze(); // 獲取音頻頻譜數據
  let bass = fft.getEnergy('bass'); // 獲取低音能量
  let scaleFactor = map(bass, 0, 255, 1, 3); // 將低音能量映射到縮放因子

  for (let i = 0; i < positions.length; i++) {
    let moveFactorX = map(bass, 0, 255, -width / 4, width / 4) + random(-50, 50); // 將低音能量映射到 X 軸移動因子，並加入隨機變化
    let moveFactorY = map(bass, 0, 255, -height / 4, height / 4) + random(-50, 50); // 將低音能量映射到 Y 軸移動因子，並加入隨機變化

    // 更新位置並確保不超過視窗範圍
    positions[i].x = constrain(positions[i].x + moveFactorX, 0, width);
    positions[i].y = constrain(positions[i].y + moveFactorY, 0, height);

    fill(random(255), random(255), random(255)); // 設定填充顏色為隨機顏色
    beginShape();
    // 迴圈遍歷陣列中的每個點，並用線條連接它們
    for (let j = 0; j < points.length; j++) {
      vertex(points[j][0] * 10 * scaleFactor + positions[i].x, points[j][1] * 10 * scaleFactor + positions[i].y);
    }
    endShape(CLOSE);
  }
}
