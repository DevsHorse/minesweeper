import {GAME} from '../actions/gameActions';


const activeGameProps = {
  boardWidth: 0,
  cellSize: 0,
  gameOver: false,
  gameWon: false,
  gameInit: false,
  cheatOn: false,
  pause: false,
  score: '',
  idInitCell: '',
  flags: {
    set: 0,
    all: 0
  },
  cells: {},
  mines: {},
};

const initialState = {
  isStartGame: false,
  gameDifficult: {width: '', height: ''},
  theme: 'light',
  isRestartGame: false,
  ...activeGameProps,
};

export default function gameReducer(state = initialState, action) {
  switch (action.type) {
    case GAME.CHANGE_PROP_VALUE:
      return {
        ...state,
        [action.propName]: action.value
      }
    case GAME.CHANGE_PROPS_VALUES:
      return {
        ...state,
        ...action.payload
      }
    case GAME.RESTART_GAME:
      return {
        ...state,
        ...activeGameProps,
        isRestartGame: true,
      }
    case GAME.CLEAR_GAME:
      return {
        ...initialState,
        theme: state.theme,
      }
    default: return state;
  }
};