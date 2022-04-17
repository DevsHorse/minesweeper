import React from 'react';
import Board from '../../components/Board';
import AsideMenu from '../../components/AsideMenu';
import useGame from './useGame';

const Game = () => {
  const {onCellClick} = useGame();

  return (
    <div className="container">
      <Board onCellClick={onCellClick} />
      <AsideMenu />
    </div>
  );
}

export default Game;