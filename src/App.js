import React, {useEffect} from 'react';
import Game from './pages/Game';
import './styles/main.css';
import './styles/main-dark.css';
import {Redirect, Route, Switch, useHistory} from 'react-router-dom';
import Intro from './pages/Intro';
import {useDispatch, useSelector} from 'react-redux';
import {clearGame} from './redux/actions/gameActions';


const App = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {isStartGame, theme} = useSelector(state => state.game);

  useEffect(() => {
    if (isStartGame) {
      history.push('/game');
    } else {
      history.push('/intro');
      dispatch(clearGame());
    }
  }, [isStartGame]);

  return (
    <div className={`App ${theme}`}>
      <Switch>
        <Route exact path="/intro">
          <Intro />
        </Route>
        <Route path="/game">
          <Game />
        </Route>
        <Redirect to={"/intro"}/>
      </Switch>
    </div>
  );
}

export default App;
