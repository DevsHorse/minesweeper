import React from 'react';
import StartMenu from './start-menu';
import Game from './game';
import './main.css';


class App extends React.Component {

  constructor() {
    super();
  }

  state = {
    gameDifficult: {
      width: '',
      height: ''
    },
    isStartGame: false,
    isRestart: null
  }

  handleGameStatus = (gameDifficultProps, init, restart) => {
    this.setState({
      gameDifficult: {
        width: gameDifficultProps.width ? gameDifficultProps.width : '',
        height: gameDifficultProps.height ? gameDifficultProps.height : ''
      },
      isStartGame: init === false ? init : true,
      isRestart: restart ? restart : null
    })
  }

  render() {

    const gamePage =
      this.state.isStartGame ?
      (<Game
        handleGameStatus={this.handleGameStatus}
        gameDifficult={this.state.gameDifficult}
      />) :
      (<StartMenu
        handleGameStatus={this.handleGameStatus}
        isRestart={this.state.isRestart}
      />);

    return (
      <div className="App">
          {gamePage}   
      </div>
    );
  }
}

export default App;
