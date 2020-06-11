import React from 'react';
import Cell from './cell';

class Board extends React.Component {
  constructor(props) {
    super();
  }

  getCell = () => {
    let cellArray = [];

    for (let key of Object.keys(this.props.gameState.cells)) {
  
      cellArray.push(
        <Cell 
          key={key}
          cellOptions={this.props.gameState.cells[key]}
          isGameOver={this.props.gameOver}
          styleOptions={{width: this.props.gameState.cellSize, height: this.props.gameState.cellSize}}
          handleClick={this.props.handleClick}
          cheatOn={this.props.cheatOn}
          theme={this.props.theme}
        />
      );
    }

    return cellArray;
  }

  render () {

    const gameOver = this.props.gameOver ? <div className='game-over-or-won'>Game Over</div> : null;
    const gameWon = this.props.gameWon ? <div className='game-over-or-won'>You won! <br />Time: {this.props.score}</div>: null;
    const gamePause = this.props.pause ? <div className='game-pause'>Pause</div>: null;

    const currentTheme = this.props.theme.currentTheme;
    let darkTheme = currentTheme === 'light' ? '' : 'board-dark';   


    return (
      <div className={`board ${darkTheme}`} style={{minWidth: this.props.gameState.boardWidth}}>

        {this.getCell()}
        {gameOver}
        {gameWon}
        {gamePause}

      </div>
    );
  }
}

export default Board;