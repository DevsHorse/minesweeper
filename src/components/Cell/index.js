import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVirus, faFlag } from '@fortawesome/free-solid-svg-icons';
import config from '../../config';
import {useSelector} from 'react-redux';


const Cell = ({cellOptions, handleClick}) => {
  const game = useSelector(state => state.game);
  const styleOptions = {width: game.cellSize, height: game.cellSize};

  const bgColors = config.cellColors;

  const clickHandler = (event) => {
    event.preventDefault();

    if (cellOptions.opened) {
      return;
    }

    if (game.gameOver) {
      return;
    }

    if (event.type === 'click') {
      handleClick(cellOptions.id, 'click');
    } else if (event.type === 'contextmenu') {
      handleClick(cellOptions.id, 'contextmenu');
    }
  }


  const mined = cellOptions.mined;
  const opened = cellOptions.opened;
  const minesAround = cellOptions.minesAround;
  const flagged = cellOptions.flagged;

  const fz = styleOptions.width < 40 ? '30px' :
    styleOptions.width < 50 ? '40px' :
      '70px';

  const theme = game.theme;
  const closedCellColor = theme === 'light' ? '#BABDB6' : '#777776';

  //Cheat mode settings
  const ifCheatOn = mined ? 'red' : opened ? bgColors[minesAround] : closedCellColor;

  //Default settings
  const isLoss = cellOptions.loss ? 'red' : '#666';
  const isOpened = opened ? minesAround > 0 ? bgColors[minesAround] : theme === 'light' ? bgColors[minesAround] : '#cecece' : closedCellColor;
  const ifCheatOff = mined && opened ? isLoss : isOpened;

  const cellStyle = {
    ...styleOptions,
    backgroundColor: game.cheatOn ? ifCheatOn : ifCheatOff
  };

  const isMined = !mined ? '' :
    (<FontAwesomeIcon
      icon={faVirus}
      style={{fontSize: `${styleOptions.width}`, textAlign: 'center', width: '100%'}}
    />);

  const textContent = minesAround > 0 ? minesAround : isMined;
  const closedCell = cellOptions.opened ? '' : theme === 'light' ? 'cell-closed' : 'cell-closed cell-closed-dark';

  const flagColor = theme === 'light' ? 'flag' : 'flag-dark';

  const isFlagged = !flagged ? null :
    (<FontAwesomeIcon
      className={flagColor}
      icon={faFlag}
      style={{fontSize: `${styleOptions.width}`, textAlign: 'center', width: '100%'}}
    />);

  const cellContent = opened ? textContent : isFlagged;

  let darkTheme = game.theme === 'light' ? 'cell' : 'cell-dark';

  return (
    <div className={darkTheme} style={cellStyle}
         onClick={clickHandler}
         onContextMenu={clickHandler}
    >
      <div className={`cell-content ${closedCell}`} style={{fontSize: `${fz}`}}>
        {cellContent}
      </div>
    </div>
  );
}

export default Cell;