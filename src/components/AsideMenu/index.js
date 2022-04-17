import React, {useEffect, useRef, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import {useDispatch, useSelector} from 'react-redux';
import {changePropValue, restartGameStore} from '../../redux/actions/gameActions';
import config from '../../config';
import useTimer from './useTimer';

const AsideMenu = () => {
  const dispatch = useDispatch();
  const game = useSelector(state => state.game);

  const {time, pauseHandler} = useTimer();

  useEffect(() => {
    if (game.gameWon && !game.score) {
      dispatch(changePropValue('score', time));
    }
  }, [game.gameWon, game.score]);

  const cheatHandler = (event) => {
    event.preventDefault();

    const password = prompt('Password: ', '');

    if (password === '111') {
      dispatch(changePropValue('cheatOn', true));
    }
  }

  const handleTheme = (event) => {
    const theme = event.target.textContent.match(/^[\w]+/g)[0].trim();
    dispatch(changePropValue('theme', theme));
  }


  let nextTheme = '';
  if (game.theme === config.themes.LIGHT) {
    nextTheme = config.themes.DARK;
  } else {
    nextTheme = config.themes.LIGHT;
  }

  const isDark = game.theme === config.themes.DARK;
  let headerBlockDark = isDark && 'header-block-dark';
  let menuBtnDark = isDark && 'menu-btn-dark';

  return (
    <div className="aside-menu">
      <div className="menu-header">
        <div className={`header-block ${headerBlockDark}`}>
          <FontAwesomeIcon icon={faFlag} style={{fontSize: '30px'}}/>
          <div>
            {`${game.flags.set}/${game.flags.all}`}
          </div>
        </div>

        <div className={`header-block ${headerBlockDark}`}>
          <FontAwesomeIcon icon={faClock} style={{fontSize: '30px'}}/>
          <div>{time}</div>
        </div>
      </div>

      {/* Cheat Button */}
      <div>
        <button
          className={`menu-btn ${menuBtnDark}`}
          onClick={cheatHandler}>Cheat for test</button>
      </div>
      {/* End Cheat Button */}

      <div>
        <button
          className={`menu-btn ${menuBtnDark}`}
          onClick={handleTheme}>{nextTheme} theme</button>
      </div>

      <div className="menu-footer">
        <button
          className={`menu-btn ${menuBtnDark}`}
          onClick={() => dispatch(restartGameStore())}
        >
          Restart
        </button>
        <button
          className={`menu-btn ${menuBtnDark}`}
          onClick={() => dispatch(changePropValue('isStartGame', false))}
        >
          Change difficult
        </button>
        <button
          className={`menu-btn ${menuBtnDark}`}
          onClick={pauseHandler}
        >
          Pause
        </button>
      </div>

    </div>
  );
}

export default AsideMenu;