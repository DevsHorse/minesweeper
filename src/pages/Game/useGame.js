import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useMemo} from 'react';
import GameBoard from '../../components/Board/gameBoard';
import {changePropValue, gameInitStore} from '../../redux/actions/gameActions';


const useGame = () => {
  const dispatch = useDispatch();
  const game = useSelector(state => state.game);

  const initBoardCallback = (sizes, newBoardWidth, cellsObject) => {
    dispatch(changePropValue('boardWidth', newBoardWidth));
    dispatch(changePropValue('cellSize', sizes.cellSize));
    dispatch(changePropValue('cells', cellsObject));
  }

  const initGameCallback = (cellId, minesObject, cellsObject) => {
    dispatch(gameInitStore(cellsObject, cellId, minesObject));
  }

  const handleClickCallback = (cellId, currentCell) => {
    dispatch(changePropValue('cells', {
      ...game.cells,
      [cellId]: currentCell
    }));
  }

  const handleRightClickCallback = (cellId, currentCell, newFlags) => {
    dispatch(changePropValue('cells', {
      ...game.cells,
      [cellId]: currentCell
    }));
    dispatch(changePropValue('flags', newFlags));
  }

  const handleGameOverCallback = (newMineCells) => {
    dispatch(changePropValue('cells', {
      ...game.cells,
      ...newMineCells
    }));
    dispatch(changePropValue('gameOver', true));
  }

  const handleGameWonCallback = () => {
    dispatch(changePropValue('gameWon', true));
  }

  const gameBoard = useMemo(() => new GameBoard(game, {
    initBoard: initBoardCallback,
    initGame: initGameCallback,
    handleClick: handleClickCallback,
    handleRightClick: handleRightClickCallback,
    handleGameOver: handleGameOverCallback,
    handleGameWon: handleGameWonCallback
  }), [game]);

  useEffect(() => {
    if (game.boardWidth === 0) {
      gameBoard.initBoard();
    }
  }, []);

  useEffect(() => {
    if (game.isRestartGame) {
      gameBoard.initBoard();
      dispatch(changePropValue('isRestartGame', false));
    }
  }, [game.isRestartGame]);

  useEffect(() => {
    if (game.idInitCell && game.cells[game.idInitCell].opened === false) {
      gameBoard.handleClick(game.idInitCell, 'click');
    }
  }, [game.idInitCell, game.cells]);

  useEffect(() => {
    if (game.flags.all && game.flags.set === game.flags.all && !game.gameWon) {
      gameBoard.handleGameWon();
    }
  }, [game.flags, game.gameWon]);

  return {onCellClick: gameBoard.handleClick};
}

export default useGame;