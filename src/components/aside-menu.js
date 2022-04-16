import React, {useEffect, useRef, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import {useDispatch, useSelector} from 'react-redux';
import {changePropValue, changeTimeValue} from '../redux/actions/gameActions';

const AsideMenu = ({handlePause, handleWonScore, handleCheat, restartGame}) => {
  const dispatch = useDispatch();
  const game = useSelector(state => state.game);

  const [startTime, setStartTime] = useState(new Date().getTime());
  const [timePassed, setTimePassed] = useState('');
  const [time, setTime] = useState('00:00');
  const [init, setInit] = useState(true);

  let timer = useRef(null);

  useEffect(() => {
    if (init && game.gameInit && !game.isRestartGame) {
      timer.current = setTimeout(() => {
        const newDate = new Date().getTime();
        const time = Math.floor((newDate - startTime) / 1000);
        const seconds = time % 60;
        const minutes = Math.floor(time / 60);
        setTimePassed(newDate - startTime);
        setTime((minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') +seconds);
      }, 1000);
    } else {
      clearInterval(timer.current);
    }

    if (game.gameOver || game.gameWon) {
      clearInterval(timer.current);
    }
  }, [init, game.gameInit, game.isRestartGame, game.gameOver, game.gameWon])

  useEffect(() => {
    if (game.isRestartGame) {
      setStartTime(new Date().getTime());
      setTimePassed('')
      setTime('00:00');
      setInit(true);
    }
  }, [game.isRestartGame])

  const handleDifficult = (event) => {
    event.preventDefault();
    dispatch(changePropValue('isStartGame', false));
  }

  const pauseHandler = () => {
    if (init) {
      handlePause(true);
      setInit(false);
    } else {

      let timeDifference = new Date().getTime() - startTime - timePassed;

      handlePause(false);
      setInit(true);
      setStartTime(startTime + timeDifference);
    }
  }

  useEffect(() => {
    if (game.gameWon && !game.score) {
      handleWonScore(time);
    }
  }, [game.gameWon, game.score]);

  const getFlagsCounter = () => {
    const setMines = game.flags.set;
    const allMines = game.flags.all;
    return (`${setMines}/${allMines}`);
  };

  const cheatHandler = (event) => {
    event.preventDefault();

    const password = prompt('Password: ', '');

    if (password === '111') {
      handleCheat();
    } 
  }

  const handleTheme = (event) => {
    const theme = event.target.textContent.match(/^[\w]+/g)[0].trim();
    dispatch(changePropValue('theme', theme));
  }

  let nextTheme = '';
  if (game.theme === 'light') {
    nextTheme = 'dark';
  } else {
    nextTheme = 'light';
  }

  const currentTheme = game.theme;
  let headerBlockDark = currentTheme === 'light' ? '' : 'header-block-dark';
  let menuBtnDark = currentTheme === 'light' ? '' : 'menu-btn-dark';

  return (
    <div className="aside-menu">
      <div className="menu-header">
        <div className={`header-block ${headerBlockDark}`}>
          <FontAwesomeIcon icon={faFlag} style={{fontSize: '30px'}}/>
          <div>
            {getFlagsCounter()}
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
          onClick={restartGame}
        >
          Restart
        </button>
        <button
          className={`menu-btn ${menuBtnDark}`}
          onClick={handleDifficult}
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