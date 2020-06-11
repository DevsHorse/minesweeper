import React from 'react';

class StartMenu extends React.Component {

  constructor(props) {
    super();
  }

  handleChoose = (event) => {
    const WXHReg = /^([0-9]{1,2}x[0-9]{1,2})\s/;
    const wOfH = /[0-9]{1,2}/g;
    const widthXHeight = event.target.textContent.match(WXHReg)[0];
    const boardWidth = widthXHeight.match(wOfH)[0];
    const boardHeight = widthXHeight.match(wOfH)[1];
    
    this.props.handleGameStatus({
      width: boardWidth,
      height: boardHeight
    });
  }

  componentDidMount = () => {
    if (this.props.isRestart) {
      this.props.handleGameStatus({
        width: this.props.isRestart.width,
        height: this.props.isRestart.height
      });
    }
  }

  render() {

    const currentTheme = this.props.theme.currentTheme;
    let darkTheme = currentTheme === 'light' ? '' : 'game-difficult-dark';    

    return (
      <div className="container game-difficult-container">
        <div className="start-menu">
          <div className={`game-difficult ${darkTheme}`} onClick={this.handleChoose} >
            <div>8x8 </div>
            <div className="game-difficult-mines">
              10 <span  className="game-difficult-mines-span">mines</span>
            </div>
          </div>
          <div className={`game-difficult ${darkTheme}`} onClick={this.handleChoose} >
          <div>16x16 </div>
            <div className="game-difficult-mines">
              40 <span  className="game-difficult-mines-span">mines</span>
            </div>
          </div>
          <div className={`game-difficult ${darkTheme}`} onClick={this.handleChoose} >
          <div>30x16 </div>
            <div className="game-difficult-mines">
              99 <span  className="game-difficult-mines-span">mines</span>
            </div>
          </div>
          <div className={`game-difficult ${darkTheme}`}>
              soon...
          </div>
        </div>
      </div>
    );
  }
}

export default StartMenu;