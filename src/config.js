
export default {
  gameFields: [
    {
      width: '8',
      height: '8',
      mines: '10',
    },
    {
      width: '16',
      height: '16',
      mines: '40',
    },
    {
      width: '30',
      height: '16',
      mines: '99',
    },
    {
      width: null,
      height: null,
      mines: null,
    }
  ],
  cellColors: [
    '#DEDEDC',
    '#DDFAC3',
    '#ECEDBF',
    '#EDDAB4',
    '#EDC38A',
    '#F7A1A2',
    '#FEA785',
    '#FF7D60',
    '#FF323C'
  ],
  themes: {
    LIGHT: 'light',
    DARK: 'dark'
  }
}