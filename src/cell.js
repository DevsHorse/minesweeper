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

    //Cheat mode settings
    const ifCheatOn = mined ? 'red' : opened ? this.bgColors[minesAround] : '#BABDB6';

    //Default settings  
    const isLoss = this.props.cellOptions.loss ? 'red' : '#666';
    const isOpened = opened ? this.bgColors[minesAround] : '#BABDB6';
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
    const closedCell = this.props.cellOptions.opened ? '' : 'cell-closed';

    const isFlagged = !flagged ? null : 
    (<FontAwesomeIcon 
      icon={faFlag} 
      style={{fontSize: `${this.props.styleOptions.width}`, textAlign: 'center', width: '100%'}} 
    />);

    const cellContent = opened ? textContent : isFlagged;

    return (
      <div className='cell' style={cellStyle}
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