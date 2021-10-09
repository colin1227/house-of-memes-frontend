import vars from "../constants/vars.js";
const myStorage = window.localStorage;

const signOut = () => {
  myStorage.removeItem('loggedIn');
  myStorage.removeItem('HoMCookie');

}

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error('can not reduce');
  }
}

const loremArray = () => {
  return vars.lorem.split('.').map((s) => s);
}

const allowedFormats = () => {
  let allFormats = [];
  Object.keys(vars.formats).forEach(group => {
    vars.formats[group].forEach(type => {
      allFormats.push(type);
    })
  })
  return allFormats;
}

const checkUrl = (url) => {
  if (!url) throw Error('url needed to continue');
  if (!url.includes("https://")) throw Error('url must be secure; no http.');
  return true;
}

export { reducer, allowedFormats, signOut, loremArray, checkUrl };
