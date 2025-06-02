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
let redScoreElement;
let blackScoreElement;



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

  redScoreElement = createP('Score: ');
  redScoreElement.position(700, 450);
  redScoreElement.style("color: red;");

  blackScoreElement = createP('Score: ');
  blackScoreElement.position(700, 200);
  blackScoreElement.style("color: black;");
}

function draw() {
  background(220);

  //show "game over" message after someone wins with fireworks
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

  calculateRedScore();
  calculateBlackScore();

  displayRedScore();
  displayBlackScore();

}

function displayGrid() {

  // draws the board
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      fill(247, 219, 167);
      square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
      
      //highlights the king's castle
      if (x > 2 && x < 6 && y < 3 || y > 6 && x > 2 && x < 6) {
        fill(212, 163, 115);
        square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

function displayRiver() {

  //draws river across the middle
  for (let x = 0; x < cols; x++) {
    image(water, x * CELL_SIZE, 4 * CELL_SIZE + 35, CELL_SIZE, CELL_SIZE);
  }
}

function calculateRedScore() {

  //calculates black's score after every capture
  redScore = 0;
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      if (board[y][x] === 'rp') {
        redScore += 1;
      }
      else if (board[y][x] === 'rcan') {
        redScore += 4.5;
      }
      else if (board[y][x] === 'rc') {
        redScore += 9;
      }
      else if (board[y][x] === 'rh') {
        redScore += 4;
      }
      else if (board[y][x] === 're') {
        redScore += 2.5;
      }
      else if (board[y][x] === 'rg') {
        redScore += 2;
      }
    }
  }
}

function calculateBlackScore() {

  //calculates red's score after every capture
  blackScore = 0;
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      if (board[y][x] === 'p') {
        blackScore += 1;
      }
      else if (board[y][x] === 'can') {
        blackScore += 4.5;
      }
      else if (board[y][x] === 'c') {
        blackScore += 9;
      }
      else if (board[y][x] === 'h') {
        blackScore += 4;
      }
      else if (board[y][x] === 'e') {
        blackScore += 2.5;
      }
      else if (board[y][x] === 'g') {
        blackScore += 2;
      }
    }
  }
}

function displayRedScore() {

  //displays red score
  if (redScore >= blackScore) {
    let newRedScore = redScore - blackScore;
    redScoreElement.html(newRedScore);
  }

  else {
    let newRedScore = redScore - blackScore;
    redScoreElement.html(newRedScore);
  }
}

function displayBlackScore() {

  //displays black score
  if (blackScore >= redScore) {
    let newBlackScore = blackScore - redScore;
    blackScoreElement.html(newBlackScore);
  }

  else {
    let newBlackScore = blackScore - redScore;
    blackScoreElement.html(newBlackScore);
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
        playMoveSound();
        calculateBlackScore();
        calculateRedScore();
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

function playMoveSound() {

  //creates piece moving sound
  let sound = createAudio("movementsound.mp3");
  sound.play();
}

function moveKing(oldX, oldY, newX, newY) {

  //moves a piece only if move is legal
  let piece = board[oldY][oldX];
  let targetPiece = board[newY][newX];

  //if piece is a king, it can only move 1 square
  if (Math.abs(oldX - newX) === 1 && Math.abs(oldY - newY) === 1 ||
   Math.abs(oldX - newX) > 1 && Math.abs(oldY - newY) ===0 ||
   Math.abs(oldX - newX) === 0 && Math.abs(oldY - newY) > 1) {
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
    let minY = Math.min(newY, otherKingY);
    let maxY = Math.max(newY, otherKingY);
    let inBetween = 0;
    for (let y = minY + 1; y < maxY; y++) {
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

function clearPath(oldX, oldY, newX, newY) {

  //check for piece blocking the destination
  if (oldX === newX) {
    let minY = Math.min(oldY, newY);
    let maxY = Math.max(oldY, newY);
    for (let y = minY + 1; y < maxY; y++) {
      if (board[y][oldX] !== 0) {
        return false;
      }
    }
  }

  else if (oldY === newY) {
    let minX = Math.min(oldX, newX);
    let maxX = Math.max(oldX, newX);
    for (let x = minX + 1; x < maxX; x++) {
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
  }

  else if (!blackKingAlive) {
    state = "gameOver";
    winner = "Red Wins!!!";
  }
}