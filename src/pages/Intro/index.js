import React from 'react';
import config from '../../config';
import DifficultTile from '../../components/DifficultTile';
import {startGame} from '../../redux/actions/gameActions';
import {useDispatch} from 'react-redux';

const Intro = () => {
  const dispatch = useDispatch();

  return (
    <div className="container game-difficult-container">
      <div className="start-menu">
        {config.gameFields.map(field => (
          <DifficultTile field={field} onClick={() => dispatch(startGame(field))} />
        ))}
      </div>
    </div>
  );
}

export default Intro;