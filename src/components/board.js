import React from 'react';
import Cell from './cell';
import {useSelector} from 'react-redux';

const Board = ({handleClick}) => {
  const game = useSelector(state => state.game);


  const getCell = () => {
    let cellArray = [];

    for (let key of Object.keys(game.cells)) {
  
      cellArray.push(
        <Cell 
          key={key}
          cellOptions={game.cells[key]}
          handleClick={handleClick}
        />
      );
    }

    return cellArray;
  }

  const gameOver = game.gameOver ? <div className='game-over-or-won'>Game Over</div> : null;
  const gameWon = game.gameWon ? <div className='game-over-or-won'>You won! <br />Time: {game.score}</div>: null;
  const gamePause = game.pause ? <div className='game-pause'>Pause</div>: null;

  let darkTheme = game.theme === 'light' ? '' : 'board-dark';

  return (
    <div className={`board ${darkTheme}`} style={{minWidth: game.boardWidth}}>

      {getCell()}
      {gameOver}
      {gameWon}
      {gamePause}

    </div>
  );
}

export default Board;