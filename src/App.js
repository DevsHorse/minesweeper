import React from 'react';
import StartMenu from './start-menu';
import Game from './game';
import './main.css';
import './main-dark.css';


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
    theme: 'light',
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

  handleTheme = (theme) => {
    this.setState({theme: theme})
  }

  render() {

    const themeProps = {
      currentTheme: this.state.theme,
      handleTheme: this.handleTheme
    };

    const gamePage =
      this.state.isStartGame ?
      (<Game
        handleGameStatus={this.handleGameStatus}
        gameDifficult={this.state.gameDifficult}
        theme={themeProps}
      />) :
      (<StartMenu
        handleGameStatus={this.handleGameStatus}
        isRestart={this.state.isRestart}
        theme={themeProps}
      />);


      const body = document.querySelector('body');

      if (this.state.theme === 'dark') {
        body.style.background = '#1D1D1D';
      } else {
        body.style.background = '#F7F7F7';
      }


    return (
      <div className='App'>
          {gamePage}   
      </div>
    );
  }
}

export default App;
