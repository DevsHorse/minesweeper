import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVirus, faFlag } from '@fortawesome/free-solid-svg-icons';


class Cell extends React.Component {
  constructor(props) {
    super();
    this.bgColors = [
      '#DEDEDC',
      '#DDFAC3', 
      '#ECEDBF', 
      '#EDDAB4', 
      '#EDC38A', 
      '#F7A1A2', 
      '#FEA785', 
      '#FF7D60', 
      '#FF323C'
    ];
  }

  handleClick = (event) => {
    event.preventDefault();

    if (this.props.cellOptions.opened) {
      return;
    } 

    if (this.props.isGameOver) {
      return;
    }

    if (event.type === 'click') {
      this.props.handleClick(this.props.cellOptions.id, 'click');
    } else if (event.type === 'contextmenu') {
      this.props.handleClick(this.props.cellOptions.id, 'contextmenu');
    }
  }

  render() {

    const mined = this.props.cellOptions.mined;
    const opened = this.props.cellOptions.opened;
    const minesAround = this.props.cellOptions.minesAround;
    const flagged = this.props.cellOptions.flagged;

    const fz = this.props.styleOptions.width < 40 ? '30px' :
      this.props.styleOptions.width < 50 ? '40px' : 
      '70px';
    
    const theme = this.props.theme.currentTheme;
    const closedCellColor = theme === 'light' ? '#BABDB6' : '#777776';

    //Cheat mode settings
    const ifCheatOn = mined ? 'red' : opened ? this.bgColors[minesAround] : closedCellColor;

    //Default settings  
    const isLoss = this.props.cellOptions.loss ? 'red' : '#666';
    const isOpened = opened ? minesAround > 0 ? this.bgColors[minesAround] : theme === 'light' ? this.bgColors[minesAround] : '#cecece' : closedCellColor;
    const ifCheatOff = mined && opened ? isLoss : isOpened;

    const cellStyle = {
      ...this.props.styleOptions,
      backgroundColor: this.props.cheatOn ? ifCheatOn : ifCheatOff
    };

    const isMined = !mined ? '' :
     (<FontAwesomeIcon 
        icon={faVirus} 
        style={{fontSize: `${this.props.styleOptions.width}`, textAlign: 'center', width: '100%'}}
      />);

    const textContent = minesAround > 0 ? minesAround : isMined;
    const closedCell = this.props.cellOptions.opened ? '' : theme === 'light' ? 'cell-closed' : 'cell-closed cell-closed-dark';

    const flagColor = theme === 'light' ? 'flag' : 'flag-dark';

    const isFlagged = !flagged ? null : 
    (<FontAwesomeIcon
      className={flagColor} 
      icon={faFlag} 
      style={{fontSize: `${this.props.styleOptions.width}`, textAlign: 'center', width: '100%'}} 
    />);

    const cellContent = opened ? textContent : isFlagged;

    const currentTheme = this.props.theme.currentTheme;
    let darkTheme = currentTheme === 'light' ? 'cell' : 'cell-dark'; 


    console.log(this.bgColors[0]);
    return (
      <div className={darkTheme} style={cellStyle}
        onClick={this.handleClick}
        onContextMenu={this.handleClick}
      >
        <div className={`cell-content ${closedCell}`} style={{fontSize: `${fz}`}}>
          {cellContent}
        </div>
      </div>
    );
  }
}

export default Cell;