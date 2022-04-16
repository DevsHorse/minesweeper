import React from 'react';
import {useSelector} from 'react-redux';
import config from '../../config';

const DifficultTile = ({field, onClick}) => {
  const theme = useSelector(state => state.game.theme);
  let isAllow = !!field?.width;

  const handleTileClick = () => {
    if (!isAllow) return;
    onClick();
  };

  return (
    <div className={`game-difficult ${theme === config.themes.DARK && 'game-difficult-dark'}`} onClick={handleTileClick}>
      {isAllow && (
        <>
          <div>{field.width}x{field.height}</div>
          <div className="game-difficult-mines">
            {field.mines} <span  className="game-difficult-mines-span">mines</span>
          </div>
        </>
      )}

      {!isAllow && 'Soon...'}
    </div>
  );
};

export default DifficultTile;