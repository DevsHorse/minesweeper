import React from 'react';
import Board from './board';
import AsideMenu from './aside-menu';

class Game extends React.Component {
  constructor(props) {
    super();
  }

  state = {
    boardWidth: 0,
    cellSize: 0,
    gameOver: false,
    gameWon: false,
    gameInit: false,
    cheatOn: false,
    pause: false,
    score: '',
    idInitCell: '',
    flags: {
      set: 0,
      all: 0 
    },
    cells: {},
    mines: {}
  }

  componentDidMount() {
    if (this.state.boardWidth === 0) {
      this.initBoard();
    }
  }

  componentDidUpdate() {
    if (this.state.idInitCell && this.state.cells[this.state.idInitCell].opened === false) {
      this.handleClick(this.state.idInitCell, 'click');
    }
    if (this.state.flags.all && this.state.flags.set === this.state.flags.all && !this.state.gameWon) {
      this.handleWon();
    }
  }

  handleClick = (id, clickType) => {
    
    if (!this.state.gameInit) {
      this.gameInit(id);
      return;
    }

    if (this.state.gameOver) {
      return;
    }

    let currentCell = this.state.cells[id];

    if ( clickType === 'contextmenu' ) {
      this.handleRightClick(id);
      return;
    }

    if (!currentCell.opened) {
      if (!currentCell.flagged) {
        if (currentCell.mined) {

          this.handleGameOver(id);
        } else {
          currentCell.opened = true;

          if (!currentCell.minesAround > 0) {
            let cellsAround = this.getMinesOrCellsAround(this.state.cells, currentCell.id, this.state.mines, 'cells');

            for( let i = 0; i < cellsAround.length; i++) {
              let cell = cellsAround[i];
              if (
                !this.state.cells[cell].flagged && 
                !this.state.cells[cell].opened
              ) {
                this.handleClick(cell, 'click');
              }
            }
          }
        }
      }
    }
  
    this.setState({
      cells: {
        ...this.state.cells,
        [id]: currentCell
      } 
    })

  }

  handleRightClick = (id) => {
    let currentCell = this.state.cells[id];

    if (this.state.gameOver || currentCell.opened) {
      return;
    }

    let newflags = {
      ...this.state.flags
    };

    if (!currentCell.flagged && this.state.flags.set < this.state.flags.all) {
      currentCell.flagged = true;
      newflags.set += 1;
    } else if (currentCell.flagged) {
      currentCell.flagged = false;
      newflags.set -= 1;
    } else {
      return;
    }

    this.setState({
      cells: {
        ...this.state.cells,
        [id]: currentCell
      },
      flags: newflags
    });
  }

  handleGameOver = (id) => {
    let newMineCells = {};

    for (let key of Object.keys(this.state.cells)) {
      if (this.state.cells[key].mined) {
        newMineCells[key] = this.state.cells[key];
        newMineCells[key].opened = true;
        if (id === key) {
          newMineCells[key].loss = true;
        }
      }
     
    }

    this.setState({
      cells: {
        ...this.state.cells,
        ...newMineCells
      },
      gameOver: true
    })
  }

  handleWon = () => {
  
    let closedCellsCount = 0;
    
    for (let key of Object.keys(this.state.cells)) {
      if (!this.state.cells[key].opened) {
        closedCellsCount++;
      }
    }

    if (closedCellsCount - this.state.flags.all === 0) {
      this.setState({
        gameWon: true
      });
    }
  }

  initBoard = () => {
    const sizes = this.getBoardAndCellSize();
    const newBoardWidth = sizes.boardWidth;
    const cellsObject = this.getCells({});

    this.setState({
      boardWidth: newBoardWidth,
      cellSize: sizes.cellSize,
      cells: cellsObject
    });
  }

  gameInit = (id) => {

    const minesObject = this.getRandomMines(id);
    const cellsObject = this.getCells(minesObject, id);
    const flagsAll = Object.keys(minesObject).length;

    for (let cell of Object.keys(cellsObject)) {
        if (!cellsObject[cell].mined) {

          const newMinesAround = this.getMinesOrCellsAround(cellsObject, cell, minesObject, 'mines');
          cellsObject[cell].minesAround = newMinesAround;
        }
    }

    this.setState({
      cells: cellsObject,
      gameInit: true,
      idInitCell: id,
      flags: {
        set: 0,
        all: flagsAll
      },
      mines: minesObject
    });
  }

  getBoardAndCellSize() {
    let newCellSize = 90;

    if (this.props.gameDifficult.width === '16') {
      newCellSize = 45;
    }  else if (this.props.gameDifficult.width === '30') {
      newCellSize = 35;
    }
  
    return {
      cellSize: newCellSize,
      boardWidth: +this.props.gameDifficult.width * newCellSize + (this.props.gameDifficult.width * 2)
    }    
  }

  getRandomMines(id) {

    const randomize = (side) => {
      if (side === 'col') {
        return Math.floor(Math.random() * this.props.gameDifficult.width + 1);
      } else if (side === 'row') {
        return Math.floor(Math.random() * this.props.gameDifficult.height + 1);
      }
    };

    let mines = 0;

    if (this.props.gameDifficult.width === '8') {
      mines = 10;
    } else if (this.props.gameDifficult.width === '16') {
      mines = 40;
    } else if (this.props.gameDifficult.width === '30') {
      mines = 99;
    }

    const regCut = /[0-9]{1,2}/g;
    const clickedRow = +id.match(regCut)[1];
    const clickedCol = +id.match(regCut)[0];

    const arrayOfCellsArround = Object.fromEntries([
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

      let randomCol = randomize('col');
      let randomRow = randomize('row');

      while (
        minesObject[randomCol + '/' + randomRow]
        || 
        arrayOfCellsArround[randomCol + '/' + randomRow]
      ) {
        randomCol = randomize('col');
        randomRow = randomize('row');
      };

      minesObject[randomCol + '/' + randomRow] = true;
    }

    return minesObject;
  }

  getCells(minesObject, id) {

    let cellsObject = {};

    for (let row = 1; row <= this.props.gameDifficult.height; row++) {
      for (let col = 1; col <= this.props.gameDifficult.width; col++) {
        let isMined = minesObject[col + '/' + row] ? true : false;

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

  getMinesOrCellsAround = (cellsObject, cell, minesObject, mode) => {
    let row = cellsObject[cell].row;
    let col = cellsObject[cell].col;
    
    let arroundCells = [
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

    arroundCells = arroundCells.forEach(item => {

      let reg = new RegExp(
        `^(0\/)|(\/0)|(${+this.props.gameDifficult.width + 1}\/)|(\/${+this.props.gameDifficult.height + 1})`,
        'g'
      );
  
      if (!item.match(reg)) {
        if (mode === 'mines') {
          newMinesAround = minesObject[item] ?  newMinesAround += 1 : newMinesAround;
        } else {
          cellsAround.push(item);
        }
      } else {
        if (mode === 'mines') {
          newMinesAround = newMinesAround;
        } else {
          return;
        }
      }
    });
   
    if (mode === 'mines') {
      return newMinesAround;
    } else {
      return cellsAround;
    }
  }

  handleCheat = () => {
    this.setState({
      cheatOn: true
    });
  } 

  handleWonScore = (time) => {
    this.setState({
      score: time
    });
  }

  restartGame = (event) => {
    event.preventDefault();

    this.props.handleGameStatus({}, false, {
      width: this.props.gameDifficult.width,
      height: this.props.gameDifficult.height
    });
  }

  handlePause = (isPause) => {
    this.setState({pause: isPause});
  }

  render() {
    return (
      <div className="container">
        <Board
         gameState={this.state} 
         handleClick={this.handleClick} 
         gameOver={this.state.gameOver}
         cheatOn={this.state.cheatOn}
         gameWon={this.state.gameWon}
         score={this.state.score}
         pause={this.state.pause}
         theme={this.props.theme}
        />

        <AsideMenu
         handleGameStatus={this.props.handleGameStatus} 
         gameOver={this.state.gameOver}
         gameWon={this.state.gameWon}
         gameInit={this.state.gameInit} 
         flags={this.state.flags}
         handleCheat={this.handleCheat}
         handleWonScore={this.handleWonScore}
         score={this.state.score}
         restartGame={this.restartGame}
         handlePause={this.handlePause}
         theme={this.props.theme}
        />
      </div>
    );
  }
}

export default Game;