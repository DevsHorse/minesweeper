import React from 'react';
import Cell from '../Cell';
import {useSelector} from 'react-redux';
import config from '../../config';


const Board = ({onCellClick}) => {
  const game = useSelector(state => state.game);

  return (
    <div className={`board ${game.theme === config.themes.DARK && 'board-dark'}`} style={{minWidth: game.boardWidth}}>

      {Object.keys(game.cells).map(key => (
        <Cell
          key={key}
          cellOptions={game.cells[key]}
          handleClick={onCellClick}
        />
      ))}

      {game.gameOver && (
        <div className='game-over-or-won'>Game Over</div>
      )}

      {game.gameWon && (
        <div className='game-over-or-won'>You won! <br />Time: {game.score}</div>
      )}

      {game.pause && (
        <div className='game-pause'>Pause</div>
      )}

    </div>
  );
}

export default Board;