const prod = {
  url: {
    API_URL: 'https://qa-dot-vw-vwm-bi-anagp-p-evalpro-l44.nw.r.appspot.com/',
    // API_URL: 'https://audi-qa-dot-vw-vwm-bi-anagp-p-evalpro-l44.nw.r.appspot.com',
  },
};
const dev = {
  url: {
    // API_URL: 'http://localhost:3000',
    API_URL: 'https://qa-dot-vw-vwm-bi-anagp-p-evalpro-l44.nw.r.appspot.com/'
    // API_URL: 'https://audi-qa-dot-vw-vwm-bi-anagp-p-evalpro-l44.nw.r.appspot.com',
  },
};
// eslint-disable-next-line import/prefer-default-export
export const config = process.env.NODE_ENV === 'production' ? prod : dev;
// # sourceMappingURL=constants.js.map

// export const colorPrincipal =
//   process.env.NEXT_PUBLIC_SISTEMA === 'VW' ? 'vw_dark_blue' : 'audi_black';

export const colorPrincipal = 'audi_black'
//   process.env.NEXT_PUBLIC_SISTEMA === 'VW' ? 'vw_dark_blue' : 'audi_black';
