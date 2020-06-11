import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faFlag } from '@fortawesome/free-solid-svg-icons';

class AsideMenu extends React.Component {
  constructor(props) {
    super();
    this.state = {
      startTime: new Date().getTime(),
      timePassed: '',
      time: '00:00',
      init: true
    }
  }

  handleDificult = (event) => {
    event.preventDefault();
    this.props.handleGameStatus({}, false);
  }

  handlePause = () => {
    if (this.state.init) {
      this.props.handlePause(true);
      this.setState({
        init: false
      })
    } else {

      let timeDifference = new Date().getTime() - this.state.startTime - this.state.timePassed;

      this.props.handlePause(false);
      this.setState({
        startTime: this.state.startTime + timeDifference,
        init: true
      })
    }
  }

  componentDidUpdate = () => {
    if (this.props.gameWon && !this.props.score) {
      this.props.handleWonScore(this.state.time);
    }
  }

  getFlagsCounter = () => {
    const setMines = this.props.flags.set;
    const allMines = this.props.flags.all;

    return (`${setMines}/${allMines}`);
  };

  handleCheat = (event) => {
    event.preventDefault();

    const password = prompt('Password: ', '');

    if (password === '111') {
      this.props.handleCheat();
    } 
  }

  handleTheme = (event) => {
    const theme = event.target.textContent.match(/^[\w]+/g)[0].trim();
    if (this.props.theme) {
      this.props.theme.handleTheme(theme);
    }
  }

  render () {

    let timer;

    if (this.state.init && this.props.gameInit) {
      timer = setTimeout(() => {
        const newDate = new Date().getTime();
        const time = Math.floor((newDate - this.state.startTime) / 1000);
        const seconds = time % 60;
        const minutes = Math.floor(time / 60);
          this.setState({
            timePassed: newDate - this.state.startTime,
            time: (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') +seconds
          })
      }, 1000);
    } else {
      clearInterval(timer);
    }

    if (this.props.gameOver || this.props.gameWon) {
      clearInterval(timer);
    }

    let nextTheme = '';
    if (this.props.theme && this.props.theme.currentTheme === 'light') {
      nextTheme = 'dark';
    } else {
      nextTheme = 'light';
    }

    const currentTheme = this.props.theme.currentTheme;
    let headerBlockDark = currentTheme === 'light' ? '' : 'header-block-dark';
    let menuBtnDark = currentTheme === 'light' ? '' : 'menu-btn-dark'; 
 
    return (
      <div className="aside-menu">
        <div className="menu-header">
          <div className={`header-block ${headerBlockDark}`}>
          <FontAwesomeIcon icon={faFlag} style={{fontSize: '30px'}}/>
            <div>
              {this.getFlagsCounter()}
            </div>
          </div>

          <div className={`header-block ${headerBlockDark}`}>
          <FontAwesomeIcon icon={faClock} style={{fontSize: '30px'}}/>
            <div>{this.state.time}</div>
          </div>
        </div>

        {/* Cheat Button */}
        <div>
          <button
            className={`menu-btn ${menuBtnDark}`}  
            onClick={this.handleCheat}>Cheat for test</button>
        </div>
        {/* End Cheat Button */}

        <div>
          <button
            className={`menu-btn ${menuBtnDark}`}   
            onClick={this.handleTheme}>{nextTheme} theme</button>
        </div>

        <div className="menu-footer">
          <button
           className={`menu-btn ${menuBtnDark}`} 
           onClick={this.props.restartGame}
          >
            Restart
          </button>
          <button 
            className={`menu-btn ${menuBtnDark}`} 
            onClick={this.handleDificult}
          >
            Change difficult
          </button>
          <button 
            className={`menu-btn ${menuBtnDark}`} 
            onClick={this.handlePause}
          >
            Pause
          </button>
        </div>
        
      </div>
    );
  }
}

export default AsideMenu;