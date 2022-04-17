

class GameBoard {
  constructor(gameData, callBacks) {
    this.game = gameData;
    this.callBacks = callBacks;
  }

  initBoard = () => {
    const sizes = this.getBoardAndCellSize(this.game.gameDifficult.width);
    const newBoardWidth = sizes.boardWidth;
    const cellsObject = this.getCells({});
    this.callBacks.initBoard(sizes, newBoardWidth, cellsObject)
  }

  initGame = (cellId) => {
    const minesObject = this.getRandomMines(cellId, this.game.gameDifficult);
    const cellsObject = this.getCells(minesObject);

    for (let cell of Object.keys(cellsObject)) {
      if (!cellsObject[cell].mined) {
        cellsObject[cell].minesAround = this.getMinesOrCellsAround(cellsObject, cell, minesObject, 'mines');
      }
    }

    this.callBacks.initGame(cellId, minesObject, cellsObject)
  }

  getBoardAndCellSize = (columnsCount) => {
    let newCellSize = 90;

    if (columnsCount === '16') {
      newCellSize = 45;
    }  else if (columnsCount === '30') {
      newCellSize = 35;
    }

    return {
      cellSize: newCellSize,
      boardWidth: +columnsCount * newCellSize + (columnsCount * 2)
    }
  }

  getCells = (minesObject) => {
    let cellsObject = {};

    for (let row = 1; row <= this.game.gameDifficult.height; row++) {
      for (let col = 1; col <= this.game.gameDifficult.width; col++) {
        let isMined = !!minesObject[col + '/' + row];

        cellsObject[col + '/' + row] = {
          id: col + '/' + row,
          row: row,
          col: col,
          mined: isMined,
          opened: false,
          flagged: false,
          minesAround: 0,
          loss: false
        };
      }
    }

    return cellsObject;
  }

  getRandomMines = (id) => {
    let mines = 0;

    if (this.game.gameDifficult.width === '8') {
      mines = 10;
    } else if (this.game.gameDifficult.width === '16') {
      mines = 40;
    } else if (this.game.gameDifficult.width === '30') {
      mines = 99;
    }

    const regCut = /[0-9]{1,2}/g;
    const clickedRow = +id.match(regCut)[1];
    const clickedCol = +id.match(regCut)[0];

    const arrayOfCellsAround = Object.fromEntries([
      [(clickedCol + 1) + '/' + (clickedRow), true],
      [(clickedCol - 1) + '/' + (clickedRow), true],
      [(clickedCol) + '/' + (clickedRow + 1), true],
      [(clickedCol) + '/' + (clickedRow - 1), true],
      [(clickedCol + 1) + '/' + (clickedRow + 1), true],
      [(clickedCol - 1) + '/' + (clickedRow - 1), true],
      [(clickedCol + 1) + '/' + (clickedRow - 1), true],
      [(clickedCol - 1) + '/' + (clickedRow + 1), true],
      [clickedCol + '/' + clickedRow, true]
    ]);

    let minesObject = {};

    for (let i = 1; i <= mines; i++) {

      let randomCol = this.randomize('col');
      let randomRow = this.randomize('row');

      while (
        minesObject[randomCol + '/' + randomRow]
        ||
        arrayOfCellsAround[randomCol + '/' + randomRow]
        ) {
        randomCol = this.randomize('col');
        randomRow = this.randomize('row');
      }

      minesObject[randomCol + '/' + randomRow] = true;
    }

    return minesObject;
  }

  randomize = (side) => {
    if (side === 'col') {
      return Math.floor(Math.random() * +this.game.gameDifficult.width + 1);
    } else if (side === 'row') {
      return Math.floor(Math.random() * +this.game.gameDifficult.height + 1);
    }
  }


  getMinesOrCellsAround = (cellsObject, cell, minesObject, mode) => {
    let row = cellsObject[cell].row;
    let col = cellsObject[cell].col;

    let aroundCells = [
      (col + 1) + '/' + (row),
      (col - 1) + '/' + (row),
      (col) + '/' + (row + 1),
      (col) + '/' + (row - 1),
      (col + 1) + '/' + (row + 1),
      (col - 1) + '/' + (row - 1),
      (col + 1) + '/' + (row - 1),
      (col - 1) + '/' + (row + 1)
    ];

    let newMinesAround = 0;
    let cellsAround = [];

    for (let cell of aroundCells) {
      let reg = new RegExp(
        `^(0\/)|(\/0)|(${+this.game.gameDifficult.width + 1}\/)|(\/${+this.game.gameDifficult.height + 1})`,
        'g'
      );

      if (!cell.match(reg)) {
        if (mode === 'mines') {
          newMinesAround = minesObject[cell] ?  newMinesAround += 1 : newMinesAround;
        } else {
          cellsAround.push(cell);
        }
      }
    }

    if (mode === 'mines') {
      return newMinesAround;
    } else {
      return cellsAround;
    }
  }


  handleClick = (cellId, clickType) => {

    if (!this.game.gameInit) {
      this.initGame(cellId);
      return;
    }

    if (this.game.gameOver) {
      return;
    }

    let currentCell = this.game.cells[cellId];

    if ( clickType === 'contextmenu' ) {
      this.handleRightClick(cellId);
      return;
    }

    if (!currentCell.opened) {
      if (!currentCell.flagged) {
        if (currentCell.mined) {

          this.handleGameOver(cellId);
        } else {
          currentCell.opened = true;

          if (!currentCell.minesAround > 0) {
            let cellsAround = this.getMinesOrCellsAround(this.game.cells, currentCell.id, this.game.mines, 'cells');

            for( let i = 0; i < cellsAround.length; i++) {
              let cell = cellsAround[i];
              if (
                !this.game.cells[cell].flagged &&
                !this.game.cells[cell].opened
              ) {
                this.handleClick(cell, 'click');
              }
            }
          }
        }
      }
    }

    this.callBacks.handleClick(cellId, currentCell);
  }

  handleRightClick = (cellId) => {
    let currentCell = this.game.cells[cellId];

    if (this.game.gameOver || currentCell.opened) {
      return;
    }

    let newflags = {
      ...this.game.flags
    };

    if (!currentCell.flagged && this.game.flags.set < this.game.flags.all) {
      currentCell.flagged = true;
      newflags.set += 1;
    } else if (currentCell.flagged) {
      currentCell.flagged = false;
      newflags.set -= 1;
    } else {
      return;
    }

    this.callBacks.handleRightClick(cellId, currentCell, newflags);
  }

  handleGameOver = (cellId) => {
    let newMineCells = {};

    for (let key of Object.keys(this.game.cells)) {
      if (this.game.cells[key].mined) {
        newMineCells[key] = this.game.cells[key];
        newMineCells[key].opened = true;
        if (cellId === key) {
          newMineCells[key].loss = true;
        }
      }
    }

    this.callBacks.handleGameOver(newMineCells);
  }

  handleGameWon = () => {
    let closedCellsCount = 0;

    for (let key of Object.keys(this.game.cells)) {
      if (!this.game.cells[key].opened) {
        closedCellsCount++;
      }
    }

    if (closedCellsCount - this.game.flags.all === 0) {
      this.callBacks.handleGameWon();
    }
  }
}

export default GameBoard;