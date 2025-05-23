//Compsci 30 Major Project
//Angus Li
//Chinese Chess

const CELL_SIZE = 70;
let rows = 10;
let cols = 9;
let pieceSelected = false;
let pieceSelectedType = 0;
let redKing;
let greenKing;
let selectedX = -1;
let selectedY = -1;
let selectedPieceType = 0;
let state = "redTurn";
let winner;
let redScore = 49;
let blackScore = 20;
let newRedScore;
let newBlackScore;
let theFireworks = [];

let board = [
  ['c', 'h', 'e', 'g', 'k', 'g', 'e', 'h', 'c'],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 'can', 0, 0, 0, 0, 0, 'can', 0],
  ['p', 0, 'p', 0, 'p', 0, 'p', 0, 'p'],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ['rp', 0, 'rp', 0, 'rp', 0, 'rp', 0, 'rp'],
  [0, 'rcan', 0, 0, 0, 0, 0, 'rcan', 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ['rc', 'rh', 're', 'rg', 'rk', 'rg', 're', 'rh', 'rc']
];

function preload() {
  //load images for pieces and river
  redKing = loadImage("redking.png");
  blackKing = loadImage("blackking.png");

  redPawn = loadImage("redpawn.png");
  blackPawn = loadImage("blackpawn.png");

  redCannon = loadImage("redcannon.png");
  blackCannon = loadImage("blackcannon.png");

  redChariot = loadImage("redchariot.png");
  blackChariot = loadImage("blackchariot.png");

  redHorse = loadImage("redhorse.png");
  blackHorse = loadImage("blackhorse.png");

  redElephant = loadImage("redelephant.png");
  blackElephant = loadImage("blackelephant.png");

  redGuard = loadImage("redguard.png");
  blackGuard = loadImage("blackguard.png");

  water = loadImage("blue-water.avif");

  //load sound effects
  audioMove = createAudio("movementsound.mp3");
}

function setup() {
  createCanvas(CELL_SIZE * cols, CELL_SIZE * rows);

  //creates link to "how to play"
  let link = createA('https://www.ymimports.com/pages/how-to-play-xiangqi-chinese-chess', 'How to Play');
  link.position(-350, 100);

  let displayRedScore = createP(newRedScore);
  displayRedScore.position(700, 500);
  let displayBlackScore = createP(newBlackScore);
  displayBlackScore.position(700, - 500);
}

function draw() {
  background(220);

  //show "game over" message after someone wins
  if (state === "gameOver") {
    textAlign(CENTER, CENTER);
    textSize(32);
    fill("black");
    text(winner, width / 2, height / 2);
    return;
  }

  displayGrid();
  displayRiver();
  displayPieces();
  displayRedScore();
  displayBlackScore();
}

function displayGrid() {

  // draws a grid of 9 x 9
  fill(247, 219, 167);
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
    }
  }
}

function displayRiver() {
  //draws river just for the background
  for (let x = 0; x < cols; x++) {
    image(water, x * CELL_SIZE, 4 * CELL_SIZE + 35, CELL_SIZE, CELL_SIZE);
  }
}

function displayRedScore() {
  if(redScore - blackScore >= 0) {
    newRedScore = "score: +" + (redScore - blackScore);

  }
  else {
    newRedScore = "score: -" + (redScore - blackScore);
  }
}
function displayBlackScore() {
  if (blackScore - redScore >= 0) {
    newBlackScore = "score: +" + (blackScore - redScore);
  }
  else {
    newBlackScore = "score: -" + (blackScore - redScore);
  }
}

function displayPieces() {

  //displays pieces using images
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {

      if (board[y][x] === 'rk') {
        image(redKing, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }

      else if (board[y][x] === 'k') {
        image(blackKing, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
            
      else if (board[y][x] === 'rp') {
        image(redPawn, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }

      else if (board[y][x] === 'p') {
        image(blackPawn, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }

      else if (board[y][x] === 'can') {
        image(blackCannon, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }

      else if (board[y][x] === 'rcan') {
        image(redCannon, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }

      else if (board[y][x] === 'rc') {
        image(redChariot, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }

      else if (board[y][x] === 'c') {
        image(blackChariot, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }

      else if (board[y][x] === 'rh') {
        image(redHorse, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }

      else if (board[y][x] === 'h') {
        image(blackHorse, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }

      else if (board[y][x] === 're') {
        image(redElephant, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }

      else if (board[y][x] === 'e') {
        image(blackElephant, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }

      else if (board[y][x] === 'rg') {
        image(redGuard, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }

      else if (board[y][x] === 'g') {
        image(blackGuard, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

function mousePressed() {

  //piece selection and piece capturing
  let x = Math.floor(mouseX/CELL_SIZE);
  let y = Math.floor(mouseY/CELL_SIZE);
  if (x >= 0 && x < cols && y >= 0 && y < rows) {
    let clickedPiece = board[y][x];
    if (pieceSelected) {
      let pieceMoved = false;

      if (pieceSelectedType === 'rk' || pieceSelectedType === 'k') {
        pieceMoved = moveKing(selectedX, selectedY, x, y);
      }
      else if (pieceSelectedType === 'rc' || pieceSelectedType === 'c') {
        pieceMoved = moveChariot(selectedX, selectedY, x, y);
      }
      else if (pieceSelectedType === 'rp') {
        pieceMoved = moveRedPawn(selectedX, selectedY, x, y);
      }
      else if (pieceSelectedType === 'p') {
        pieceMoved = moveBlackPawn(selectedX, selectedY, x, y);
      }
      else if (pieceSelectedType === 'rcan' || pieceSelectedType === 'can') {
        pieceMoved = moveCannon(selectedX, selectedY, x, y);
      }
      else if (pieceSelectedType === 'rh' || pieceSelectedType === 'h') {
        pieceMoved = moveHorse(selectedX, selectedY, x, y);
      }
      else if (pieceSelectedType === 'rg' || pieceSelectedType === 'g') {
        pieceMoved = moveGuard(selectedX, selectedY, x, y);
      }
      else if (pieceSelectedType === 're' || pieceSelectedType === 'e') {
        pieceMoved = moveElephant(selectedX, selectedY, x, y);
      }

      pieceSelected = false;

      //alternate turns if moved and if king wasn't captured
      if (pieceMoved) {
        checkForWin();
        audioMove.play();
        if (state !== "gameOver") {
          state = state === "redTurn" ? "blackTurn" : "redTurn";
        }
      }
      else {
        selectedX = -1;
        selectedY = -1;
        selectedPieceType = 0;
        pieceSelectedType = 0;
      }
    }

    else if (clickedPiece !== 0 && (state === "redTurn" && clickedPiece.startsWith("r")) || state === "blackTurn" && !clickedPiece.startsWith("r")) {
      selectedX = x;
      selectedY = y;
      selectedPieceType = clickedPiece;
      pieceSelectedType = clickedPiece;
      pieceSelected = true;
    }
  }
}


function moveKing(oldX, oldY, newX, newY) {

  //moves a piece only if move is legal
  let piece = board[oldY][oldX];
  let targetPiece = board[newY][newX];

  //if piece is a king, it can only move 1 square
  if (!(Math.abs(oldX - newX) <= 1 && Math.abs(oldY - newY) <= 1)) {
    return false;
  }
  
  //the king cannot escape his castle
  //horizontally
  if (newX < 3 || newX > 5) {
    return false;
  }

  //vertically
  if (pieceSelectedType === 'rk') {
    if (newY < 7) {
      return false;
    }
  }
  if (pieceSelectedType === 'k') {
    if (newY > 2) {
      return false;
    }
  }

  //can't capture your own piece
  if (targetPiece !== 0 && sameTeam(piece, targetPiece)) {
    return false;
  }

  //can't face the other king
  let enemyKing = 'k';
  if (piece === 'k') {
    enemyKing = 'rk';
  }

  //look up and down the new collumn from newY, where the king will move
  let otherKingY = -1;
  for (let y = 0; y < rows; y++) {
    if (board[y][newX] === enemyKing) {
      otherKingY = y;
      break;
    }
  }

  if (otherKingY !== -1) {
    let minY = (newY, otherKingY);
    let maxY = (newY, otherKingY);
    let inBetween = 0;
    for(let y = minY + 1; y < maxY; y++) {
      if (board[y][newX] !== 0) {
        inBetween++;
      }
    }

    if (inBetween === 0) {
      return false;
    }
  }

  //moves the piece
  board[newY][newX] = piece;
  board[oldY][oldX] = 0;
  return true;
}

function moveChariot(oldX, oldY, newX, newY) {

  //moves a piece only if move is legal
  let piece = board[oldY][oldX];
  let targetPiece = board[newY][newX];

  //can only move horizontally and veritcally
  if (!(oldX === newX || oldY === newY)) {
    return false;
  }

  //can't capture your own piece
  if (targetPiece !== 0 && sameTeam(piece, targetPiece)) {
    return false;
  }

  //checks for pieces blocking path
  if (!clearPath(oldX, oldY, newX, newY)) {
    return false;
  }

  //moves the piece
  board[newY][newX] = piece;
  board[oldY][oldX] = 0;
  return true;
}

function moveRedPawn(oldX, oldY, newX, newY) {

  //moves a piece only if move is legal
  let piece = board[oldY][oldX];
  let targetPiece = board[newY][newX];

  //check if the pawn is past the halfway point
  let hasCrossedRiver = oldY < 5;

  //can only move one square forward
  if (Math.abs(oldX - newX) + Math.abs(oldY - newY) !== 1) {
    return false;
  }

  //before crossing the river
  if (!hasCrossedRiver && newY >= oldY) {
    return false;
  }

  //can't capture your own piece
  if (targetPiece !== 0 && sameTeam(piece, targetPiece)) {
    return false;
  }

  //moves the piece
  board[newY][newX] = piece;
  board[oldY][oldX] = 0;
  return true;
}

function moveBlackPawn(oldX, oldY, newX, newY) {

  //moves a piece only if move is legal
  let piece = board[oldY][oldX];
  let targetPiece = board[newY][newX];

  //check if the pawn is past the halfway point
  let hasCrossedRiver = oldY >= 5;

  //can only move one square forward
  if (Math.abs(oldX - newX) + Math.abs(newY - oldY) !== 1) {
    return false;
  }

  //before crossing the river
  if (!hasCrossedRiver && newY <= oldY) {
    return false;
  }

  //can't capture your own piece
  if (targetPiece !== 0 && sameTeam(piece, targetPiece)) {
    return false;
  }

  //moves the piece
  board[newY][newX] = piece;
  board[oldY][oldX] = 0;
  return true;
}

function moveCannon(oldX, oldY, newX, newY) {

  //moves a piece only if move is legal
  let piece = board[oldY][oldX];
  let targetPiece = board[newY][newX];

  //can only move horizontally and veritcally
  if (!(oldX === newX || oldY === newY)) {
    return false;
  }

  //counts number of pieces between original spot and destination
  let count = 0;

  if (oldX === newX) {
    //vertically counting
    let minY = Math.min(oldY, newY);
    let maxY = Math.max(oldY, newY);
    for (let y = minY + 1; y < maxY; y++) {
      if (board[y][oldX] !==0) {
        count++;
      }
    }
  }
  else {
    //horizontally
    let minX = Math.min(oldX, newX);
    let maxX = Math.max(oldX, newX);
    for (let x = minX + 1; x < maxX; x++) {
      if (board[oldY][x] !==0) {
        count++;
      }
    }
  }

  if (targetPiece === 0) {
    if (count === 0) {
      board[newY][newX] = piece;
      board[oldY][oldX] = 0;
      return true;
    }
  }
  else if (!sameTeam(piece, targetPiece) && count === 1) {
    board[newY][newX] = piece;
    board[oldY][oldX] = 0;
    return true;
  }
}

function moveHorse(oldX, oldY, newX, newY) {

  //moves a piece only if move is legal
  let piece = board[oldY][oldX];
  let targetPiece = board[newY][newX];

  //can only move one square forward
  if (!(Math.abs(newX - oldX) === 1 && Math.abs(oldY - newY) === 2 || Math.abs(newX - oldX) === 2 && Math.abs(oldY - newY) === 1)) {
    return false;
  }

  //check for the blocking square, called the leg
  let legX;
  let legY;

  if (Math.abs(newX - oldX) === 2 && Math.abs(newY - oldY) === 1) {
    //east and west
    legX = oldX + (newX - oldX) / 2;
    legY = oldY;
  }
  else {
    //north and south
    legX = oldX;
    legY = oldY + (newY - oldY) / 2;
  }

  if (board[legY][legX] !== 0) {
    return false;
  }

  //can't capture your own piece
  if (targetPiece !== 0 && sameTeam(piece, targetPiece)) {
    return false;
  }

  //moves the piece
  board[newY][newX] = piece;
  board[oldY][oldX] = 0;
  return true;

}

function moveElephant(oldX, oldY, newX, newY) {

  //moves a piece only if move is legal
  let piece = board[oldY][oldX];
  let targetPiece = board[newY][newX];

  //can only move one square forward
  if (!(Math.abs(newX - oldX) === 2 && Math.abs(oldY - newY) === 2 )) {
    return false;
  }

  //check for the blocking square, called the leg
  let legX;
  let legY;

  if (newX - oldX === 2 && newY - oldY === -2) {
    //north east
    legX = oldX + 1;
    legY = oldY - 1;
  }
  else if (newX - oldX === -2 && newY - oldY === -2) {
    //north west
    legX = oldX - 1;
    legY = oldY - 1;
  }
  else if (newX - oldX === 2 && newY - oldY === 2) {
    //south east
    legX = oldX + 1;
    legY = oldY + 1;
  }
  else if (newX - oldX === -2 && newY - oldY === 2) {
    //south west
    legX = oldX - 1;
    legY = oldY + 1;
  }

  if (board[legY][legX] !== 0) {
    return false;
  }

  //the elephant is too big to cross the river
  if (pieceSelectedType === 're') {
    if (newY < 5) {
      return false;
    }
  }
  if (pieceSelectedType === 'e') {
    if (newY > 5) {
      return false;
    }
  }

  //can't capture your own piece
  if (targetPiece !== 0 && sameTeam(piece, targetPiece)) {
    return false;
  }

  //moves the piece
  board[newY][newX] = piece;
  board[oldY][oldX] = 0;
  return true;
}

function moveGuard(oldX, oldY, newX, newY) {

  //moves a piece only if move is legal
  let piece = board[oldY][oldX];
  let targetPiece = board[newY][newX];
 
  //the guard can only move one diagonal square
  if (Math.abs(oldX - newX) !== 1 || Math.abs(oldY - newY) !== 1) {
    return false;
  }
   
  //the guards cannot escape the kings castle castle
  //horizontally
  if (newX < 3 || newX > 5) {
    return false;
  }
 
  //vertically
  if (pieceSelectedType === 'rg') {
    if (newY < 7) {
      return false;
    }
  }
  if (pieceSelectedType === 'g') {
    if (newY > 2) {
      return false;
    }
  }
 
  //can't capture your own piece
  if (targetPiece !== 0 && sameTeam(piece, targetPiece)) {
    return false;
  }
 
  //moves the piece
  board[newY][newX] = piece;
  board[oldY][oldX] = 0;
  return true;
}

class Particle {
  //creating firework
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = random(-5, 5);
    this.dy = random(-5, 5);
    this.radius = 2;
    this.r = 255;
    this.g = 0;
    this.b = 0;
    this.opacity = 255;
  }

  display() {
    noStroke();
    fill(this.r, this.g, this.b, this.opacity);
    circle(this.x, this.y, this.radius*2);
  }

  update() {
    //move
    this.x += this.dx;
    this.y += this.dy;

    //fade away over time
    this.opacity--;
  }

  isDead() {
    return this.opacity <= 0;
  }
}


function createFireworks() {

  for (let firework of theFireworks) {
    if (firework.isDead()) {
      //get rid of it
      let index = theFireworks.indexOf(firework);
      theFireworks.splice(index, 1);
    }
    else {
      firework.update();
      firework.display();
    }
  }
  
  for (let i = 0; i < 150; i++) {
    let someFirework = new Particle(0, 0);
    theFireworks.push(someFirework);
  }
}


function clearPath(oldX, oldY, newX, newY) {

  //checks for piece blocking the path for a move

  //vertical movements
  if (oldX === newX) {
    let step = newY > oldY ? 1 : -1;
    for (let y = oldY + step; y !== newY; y += step) {
      if (board[y][oldX] !== 0) {
        return false;
      }
    }
  }

  //horizontal movements
  else if (oldY === newY) {
    let step = newX > oldX ? 1 : -1;
    for (let x = oldX + step; x !== newX; x += step) {
      if (board[oldY][x] !== 0) {
        return false;
      }
    }
  }
  else {
    return true;
  }
}

function clearVertical(oldX, oldY, newX, newY) {

  //checks for piece blocking the vertical path for a move
  if (oldX === newX) {
    let step = newY > oldY ? 1 : -1;
    for (let y = oldY + step; y !== newY; y += step) {
      if (board[y][oldX] !== 0) {
        return false;
      }
    }
  }
}

function clearHorizontal() {

  //checks for piece blocking the horizontal path for a move
  if (oldY === newY) {
    let step = newX > oldX ? 1 : -1;
    for (let x = oldX + step; x !== newX; x += step) {
      if (board[oldY][x] !== 0) {
        return false;
      }
    }
  }
  else {
    return true;
  }

}



function sameTeam(piece1, piece2) {

  //checks if 2 pieces are on the same team
  if (piece1.startsWith('r') && piece2.startsWith('r')) {
    return true;
  }
  if (!piece1.startsWith('r') && !piece2.startsWith('r')) {
    return true;
  }
  else {
    return false;
  }
}

function checkForWin() {

  //checks if any of the kings are still alive
  let redKingAlive = false;
  let blackKingAlive = false;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (board[y][x] === "rk") {
        redKingAlive = true;
      }
      else if (board[y][x] === "k") {
        blackKingAlive = true;
      }
    }
  }

  if (!redKingAlive) {
    state = "gameOver";
    winner = "Black Wins!!!";
    createFireworks();
  }

  else if (!blackKingAlive) {
    state = "gameOver";
    winner = "Red Wins!!!";
    createFireworks();
  }
}