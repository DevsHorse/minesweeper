
export const GAME = {
  CHANGE_PROP_VALUE: 'CHANGE_PROP_VALUE',
  CHANGE_PROPS_VALUES: 'CHANGE_PROPS_VALUES',
  RESTART_GAME: 'RESTART_GAME',
  CLEAR_GAME: 'CLEAR_GAME',
};


export const changePropValue = (propName, value) => {
  return {
    type: GAME.CHANGE_PROP_VALUE,
    propName,
    value,
  }
}

export const changePropsValues = (payload) => {
  return {
    type: GAME.CHANGE_PROPS_VALUES,
    payload,
  }
}


export const startGame = (difficultOptions) => dispatch => {
  dispatch(changePropsValues({
    gameDifficult: {
      width: difficultOptions.width,
      height: difficultOptions.height
    },
    isStartGame: true,
  }));
};


export const gameInitStore = (cellsObject, cellId, minesObject) => dispatch => {
  const flagsAll = Object.keys(minesObject).length;

  dispatch(changePropsValues({
    cells: cellsObject,
    gameInit: true,
    idInitCell: cellId,
    flags: {
      set: 0,
      all: flagsAll,
    },
    mines: minesObject
  }));
}

export const restartGameStore = () => {
  return {type: GAME.RESTART_GAME};
}

export const clearGame = () => {
  return {type: GAME.CLEAR_GAME};
}