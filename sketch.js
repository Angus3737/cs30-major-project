

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
let cannonCapture;

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
  link.position(-200, 200);

  //more info in my version
  p = createP('The chariots move the same as rooks');
  p.position(-400, 0);

  p1 = createP('In this version, the river is just for design');
  p1.position(-400, 50);
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
        pieceMoved = moveHorse(selectedX, selectedY, x, y);
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

      else if (clickedPiece !== 0 && (state === "redTurn" && clickedPiece.startsWith("r")) || state === "blackTurn" && !clickedPiece.startsWith("r")) {
        selectedX = x;
        selectedY = y;
        selectedPieceType = clickedPiece;
        pieceSelectedType = clickedPiece;
        pieceSelected = true;
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

  //can't capture your own piece
  if (targetPiece !== 0 && sameTeam(piece, targetPiece)) {
    return false;
  }

  //moves the piece
  board[newY][newX] = piece;
  board[oldY][oldX] = 0;
  return true;

}

function moveHorse(oldX, oldY, newX, newY) {

  //moves a piece only if move is legal
  let piece = board[oldY][oldX];
  let targetPiece = board[newY][newX];

  //can only move one square forward
  if (Math.abs(oldX - newX) !== 1 && Math.abs(oldY - newY) !== 2) {
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

function moveGuard() {

  //moves a piece only if move is legal
  let piece = board[oldY][oldX];
  let targetPiece = board[newY][newX];
 
  //the guard can only move one diagonal square
  if (oldX - newX !== -1 && Math.abs(oldY - newY) !== 1) {
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
  return true;
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
  return true;

}



function sameTeam(piece1, piece2) {

  //checks if 2 pieces are on the same team
  if (piece1.startsWith('r') && piece2.startsWith('r')) {
    return true;
  }
  if (!piece1.startsWith('r') && !piece2.startsWith('r')) {
    return true;
  }
  return false;
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
  }

  else if (!blackKingAlive) {
    state = "gameOver";
    winner = "Red Wins!!!";
  }
}