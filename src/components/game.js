import React, {useEffect} from 'react';
import Board from './board';
import AsideMenu from './aside-menu';
import {useDispatch, useSelector} from 'react-redux';
import {changePropValue, gameInitStore, restartGameStore} from '../redux/actions/gameActions';

const Game = () => {
  const dispatch = useDispatch();
  const game = useSelector(state => state.game);
  
  useEffect(() => {
    if (game.boardWidth === 0) {
      initBoard();
    }
  }, []);
  
  useEffect(() => {
    if (game.idInitCell && game.cells[game.idInitCell].opened === false) {
      handleClick(game.idInitCell, 'click');
    }
    if (game.flags.all && game.flags.set === game.flags.all && !game.gameWon) {
      handleWon();
    }
  });

  useEffect(() => {
    if (game.isRestartGame) {
      initBoard();
      dispatch(changePropValue('isRestartGame', false));
    }
  }, [game.isRestartGame])

  const handleClick = (id, clickType) => {
    
    if (!game.gameInit) {
      gameInit(id);
      return;
    }

    if (game.gameOver) {
      return;
    }

    let currentCell = game.cells[id];

    if ( clickType === 'contextmenu' ) {
      handleRightClick(id);
      return;
    }

    if (!currentCell.opened) {
      if (!currentCell.flagged) {
        if (currentCell.mined) {

          handleGameOver(id);
        } else {
          currentCell.opened = true;

          if (!currentCell.minesAround > 0) {
            let cellsAround = getMinesOrCellsAround(game.cells, currentCell.id, game.mines, 'cells');

            for( let i = 0; i < cellsAround.length; i++) {
              let cell = cellsAround[i];
              if (
                !game.cells[cell].flagged && 
                !game.cells[cell].opened
              ) {
                handleClick(cell, 'click');
              }
            }
          }
        }
      }
    }

    dispatch(changePropValue('cells', {
      ...game.cells,
      [id]: currentCell
    }));
  }

  const handleRightClick = (id) => {
    let currentCell = game.cells[id];

    if (game.gameOver || currentCell.opened) {
      return;
    }

    let newflags = {
      ...game.flags
    };

    if (!currentCell.flagged && game.flags.set < game.flags.all) {
      currentCell.flagged = true;
      newflags.set += 1;
    } else if (currentCell.flagged) {
      currentCell.flagged = false;
      newflags.set -= 1;
    } else {
      return;
    }

    dispatch(changePropValue('cells', {
      ...game.cells,
      [id]: currentCell
    }));
    dispatch(changePropValue('flags', newflags));
  }

  const handleGameOver = (id) => {
    let newMineCells = {};

    for (let key of Object.keys(game.cells)) {
      if (game.cells[key].mined) {
        newMineCells[key] = game.cells[key];
        newMineCells[key].opened = true;
        if (id === key) {
          newMineCells[key].loss = true;
        }
      }
     
    }

    dispatch(changePropValue('cells', {
      ...game.cells,
      ...newMineCells
    }));
    dispatch(changePropValue('gameOver', true));
  }

  const handleWon = () => {
  
    let closedCellsCount = 0;
    
    for (let key of Object.keys(game.cells)) {
      if (!game.cells[key].opened) {
        closedCellsCount++;
      }
    }

    if (closedCellsCount - game.flags.all === 0) {
      dispatch(changePropValue('gameWon', true));
    }
  }

  const initBoard = () => {
    const sizes = getBoardAndCellSize();
    const newBoardWidth = sizes.boardWidth;
    const cellsObject = getCells({});

    dispatch(changePropValue('boardWidth', newBoardWidth));
    dispatch(changePropValue('cellSize', sizes.cellSize));
    dispatch(changePropValue('cells', cellsObject));
  }

  const gameInit = (id) => {

    const minesObject = getRandomMines(id);
    const cellsObject = getCells(minesObject, id);

    for (let cell of Object.keys(cellsObject)) {
        if (!cellsObject[cell].mined) {

          const newMinesAround = getMinesOrCellsAround(cellsObject, cell, minesObject, 'mines');
          cellsObject[cell].minesAround = newMinesAround;
        }
    }

    dispatch(gameInitStore(cellsObject, id, minesObject));
  }

  const getBoardAndCellSize = () => {
    let newCellSize = 90;

    if (game.gameDifficult.width === '16') {
      newCellSize = 45;
    }  else if (game.gameDifficult.width === '30') {
      newCellSize = 35;
    }
  
    return {
      cellSize: newCellSize,
      boardWidth: +game.gameDifficult.width * newCellSize + (game.gameDifficult.width * 2)
    }    
  }

  const getRandomMines = (id) => {

    const randomize = (side) => {
      if (side === 'col') {
        return Math.floor(Math.random() * +game.gameDifficult.width + 1);
      } else if (side === 'row') {
        return Math.floor(Math.random() * +game.gameDifficult.height + 1);
      }
    };

    let mines = 0;

    if (game.gameDifficult.width === '8') {
      mines = 10;
    } else if (game.gameDifficult.width === '16') {
      mines = 40;
    } else if (game.gameDifficult.width === '30') {
      mines = 99;
    }
console.log('id', id);
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

  const getCells = (minesObject, id) => {

    let cellsObject = {};

    for (let row = 1; row <= game.gameDifficult.height; row++) {
      for (let col = 1; col <= game.gameDifficult.width; col++) {
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

  const getMinesOrCellsAround = (cellsObject, cell, minesObject, mode) => {
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

    arroundCells.forEach(item => {

      let reg = new RegExp(
        `^(0\/)|(\/0)|(${+game.gameDifficult.width + 1}\/)|(\/${+game.gameDifficult.height + 1})`,
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

  const handleCheat = () => {
    dispatch(changePropValue('cheatOn', true));
  } 

  const handleWonScore = (time) => {
    dispatch(changePropValue('score', time));
  }

  const restartGame = (event) => {
    event.preventDefault();
    dispatch(restartGameStore());
  }

  const handlePause = (isPause) => {
    dispatch(changePropValue('pause', isPause));
  }

  return (
    <div className="container">
      <Board handleClick={handleClick} />

      <AsideMenu
        handleCheat={handleCheat}
        handleWonScore={handleWonScore}
        restartGame={restartGame}
        handlePause={handlePause}
      />
    </div>
  );
}

export default Game;