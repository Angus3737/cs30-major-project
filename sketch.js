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
let state = "starting";
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
  kingMovement = loadImage("imagekingmove.gif");

  redPawn = loadImage("redpawn.png");
  blackPawn = loadImage("blackpawn.png");
  pawnMovement = loadImage("imagepawnmove.gif");

  redCannon = loadImage("redcannon.png");
  blackCannon = loadImage("blackcannon.png");
  cannonMovement = loadImage("imagecannonmove.gif");

  redChariot = loadImage("redchariot.png");
  blackChariot = loadImage("blackchariot.png");
  chariotMovement = loadImage("imagechariotmove.gif");

  redHorse = loadImage("redhorse.png");
  blackHorse = loadImage("blackhorse.png");
  horseMovement = loadImage("imagehorsemove.gif");

  redElephant = loadImage("redelephant.png");
  blackElephant = loadImage("blackelephant.png");
  elephantMovement = loadImage("imageelephantmove.gif");

  redGuard = loadImage("redguard.png");
  blackGuard = loadImage("blackguard.png");
  guardMovement = loadImage("imageguardmove.gif");

  water = loadImage("blue-water.avif");

  //load sound effects
  audioMove = createAudio("movementsound.mp3");

  //starting screen
  startingScreen = loadImage("backgrounddesign.png");
}

function setup() {
  createCanvas(CELL_SIZE * cols, CELL_SIZE * rows);

  //creates link to "how to play"
  let link = createA('https://www.ymimports.com/pages/how-to-play-xiangqi-chinese-chess', 'How to Play');
  link.position(-350, 100);
  link.style("font-size", "25px");

  //creates element for the score
  redScoreElement = createP();
  redScoreElement.position(700, 400);
  redScoreElement.style("color: red;");

  blackScoreElement = createP();
  blackScoreElement.position(700, 250);
  blackScoreElement.style("color: black;");

  //creates element for who's turn it is
  redTurnElement = createP("Red Turn");
  redTurnElement.position(-250, 300);
  redTurnElement.style("font-size", "30px");
  redTurnElement.style("font-weight", "bold");

  blackTurnElement = createP("Black Turn");
  blackTurnElement.position(-250, 300);
  blackTurnElement.style("font-size", "30px");
  blackTurnElement.style("font-weight", "bold");

  //shows user how to access instructions
  easyInstructions = createP("Hold 'i' for easy access instructions");
  easyInstructions.position(-350, 170);

}

function draw() {

  background(220);

  //starting screen
  if (state === "starting") {
    displayStart();
  }

  //show "game over" message after someone wins
  if (state === "gameOver") {
    textAlign(CENTER, CENTER);
    textSize(32);
    fill("black");
    text(winner, width / 2, height / 2);
    return;
  }

  //gameplay
  if (state !== "starting") {
    //displaying the whole board
    displayGrid();
    displayRiver();
    highlightSelectedPiece();
    displayPieces();

    //displaying score and turn
    calculateRedScore();
    calculateBlackScore();

    displayRedScore();
    displayBlackScore();

    displayTurn();
    displayInstructions();
  }
}

function displayStart() {

  //display the starting screen
  background(startingScreen);
  textAlign(CENTER, CENTER);
  textSize(50);
  fill("black");
  text("Chinese Chess", width / 2, height / 2 - 100);
  text("(XiangQi)", width / 2, height / 2);
  textSize(20);
  text("click to begin", width / 2, height / 2 + 130);
  blackTurnElement.style("visibility", "hidden");
  redTurnElement.style("visibility", "hidden");
}

function displayGrid() {

  //draws the board
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

  // //displays red score
  let newRedScore = redScore - blackScore;
  redScoreElement.html("Red Score: " + newRedScore);
}

function displayBlackScore() {

  //displays black score
  let newBlackScore = blackScore - redScore;
  blackScoreElement.html("Black Score: " + newBlackScore);
  
}


function displayTurn() {

  //displays who's turn it is
  if (state === "redTurn") {
    redTurnElement.style("color: red;");
    redTurnElement.style("visibility", "visible");
    blackTurnElement.style("visibility", "hidden");
    
  }

  else if (state === "blackTurn") {
    blackTurnElement.style("color: black;");
    blackTurnElement.style("visibility", "visible");
    redTurnElement.style("visibility", "hidden");

  }
}

function displayInstructions() {

  //displays instructions if 'i' is held down
  if (keyIsDown(73)) {
    background(53, 53, 53);
    image(chariotMovement, 10, 480, 200, 200);
    image(horseMovement, 220, 480, 200, 200);
    image(elephantMovement, 430, 480, 200, 200);
    image(guardMovement, 50, 260, 250, 200);
    image(kingMovement, 350, 260, 250, 200);
    image(cannonMovement, 100, 20, 200, 220);
    image(pawnMovement, 350, 20, 200, 200);

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

function highlightSelectedPiece() {

  //highlights the square of a selected piece
  if (pieceSelected && selectedX !== -1 && selectedY !== -1) {
    noFill();
    strokeWeight(5);
    stroke("green");
    square(selectedX * CELL_SIZE, selectedY * CELL_SIZE, CELL_SIZE);

    //reset square
    strokeWeight(1);
    stroke(0);
  }
}

function mousePressed() {

  if (state === "starting") {
    state = "redTurn";
  }

  //piece selection and piece capturing
  let x = Math.floor(mouseX/CELL_SIZE);
  let y = Math.floor(mouseY/CELL_SIZE);
  if (x >= 0 && x < cols && y >= 0 && y < rows) {
    let clickedPiece = board[y][x];
    // fill("green");
    // square(board[x], board[y], CELL_SIZE);
    if (pieceSelected) {
      let pieceMoved = false;

      if (pieceSelectedType === 'rk' || pieceSelectedType === 'k') {
        pieceMoved = moveKing(selectedX, selectedY, x, y);
      }
      else if (pieceSelectedType === 'rc' || pieceSelectedType === 'c') {
        pieceMoved = moveChariot(selectedX, selectedY, x, y);
      }
      else if (pieceSelectedType === 'rp') {
        pieceMoved = movePawn(selectedX, selectedY, x, y);
      }
      else if (pieceSelectedType === 'p') {
        pieceMoved = movePawn(selectedX, selectedY, x, y);
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

      //if move was made
      if (pieceMoved) {
        checkForWin();
        playMoveSound();
        calculateBlackScore();
        calculateRedScore();

        //alternate turns
        if (state !== "gameOver") {
          if (state === "redTurn") {
            state = "blackTurn";
          }
          else {
            state = "redTurn";
          }
        }
      }
      else {

        //if move invalid, then clear the selection
        selectedX = -1;
        selectedY = -1;
        pieceSelectedType = 0;
      }
    }

    //checks if selected piece belongs to the correct player
    else if (clickedPiece !== 0 && (state === "redTurn" && clickedPiece.startsWith("r")) ||
             state === "blackTurn" && !clickedPiece.startsWith("r")) {
      selectedX = x;
      selectedY = y;
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


function movePawn(oldX, oldY, newX, newY) {

  //red pawns move up
  //moves a piece only if move is legal
  let piece = board[oldY][oldX];
  let targetPiece = board[newY][newX];


  if (pieceSelectedType === "rp") {
    //can only move one square forward
    if (Math.abs(oldX - newX) + Math.abs(oldY - newY) !== 1) {
      return false;
    }

    //check if the pawn is past the halfway point
    let hasRedCrossedRiver = oldY < 5;
    if (!hasRedCrossedRiver && newY >= oldY) {
      return false;
    }
    //cannot move backwards after crossing river
    if (hasRedCrossedRiver && newY > oldY) {
      return false;
    }
  }


  if (pieceSelectedType === "p") {
    //can only move one square forward
    if (Math.abs(oldX - newX) + Math.abs(newY - oldY) !== 1) {
      return false;
    }

    let hasBlackCrossedRiver = oldY >= 5;
    //before crossing the river
    if (!hasBlackCrossedRiver && newY <= oldY) {
      return false;
    }

    //cannot move backwards after crossing river
    if (hasBlackCrossedRiver && newY < oldY) {
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
  return false;
}

function moveHorse(oldX, oldY, newX, newY) {

  //moves a piece only if move is legal
  let piece = board[oldY][oldX];
  let targetPiece = board[newY][newX];

  //moves in an L shape
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