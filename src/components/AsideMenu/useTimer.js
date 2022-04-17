import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {changePropValue} from '../../redux/actions/gameActions';


export default () => {
  const dispatch = useDispatch();
  const game = useSelector(state => state.game);

  const [startTime, setStartTime] = useState(null);
  const [timePassed, setTimePassed] = useState('');
  const [time, setTime] = useState('00:00');
  const [init, setInit] = useState(true);

  let timer = useRef(null);

  useEffect(() => {
    if (init && game.gameInit) {
      timer.current = setTimeout(() => {
        let startTimeValue = startTime;
        if (!startTime) {
          startTimeValue = new Date().getTime();
        }
        const newDate = new Date().getTime();
        const time = Math.floor((newDate - startTimeValue) / 1000);
        const seconds = time % 60;
        const minutes = Math.floor(time / 60);
        const newTime = (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') +seconds;

        setTimePassed(newDate - startTimeValue);
        setTime(newTime);
        if (!startTime) {
          setStartTime(startTimeValue);
        }
      }, 1000);
    } else {
      clearTimeout(timer.current);
    }
  }, [init, game.gameInit, startTime, time])

  useEffect(() => {
    if (game.gameOver || game.gameWon) {
      clearTimeout(timer.current);
    }
  }, [game.gameWon, game.gameOver])

  useEffect(() => {
    if (game.isRestartGame) {
      setStartTime(null);
      setTimePassed('')
      setTime('00:00');
      setInit(true);
    }
  }, [game.isRestartGame])


  const pauseHandler = () => {
    if (init) {
      dispatch(changePropValue('pause', true));
      setInit(false);
    } else {

      let timeDifference = new Date().getTime() - startTime - timePassed;

      dispatch(changePropValue('pause', false));
      setInit(true);
      setStartTime(startTime + timeDifference);
    }
  }

  return {time, pauseHandler}
}