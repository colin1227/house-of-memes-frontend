import { formats, lorem } from "../constants/vars.json";
const myStorage = window.localStorage;

const signOut = () => {
  myStorage.removeItem('loggedIn');
  myStorage.removeItem('cryptoMiner');

}

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error('shit');
  }
}

const loremArray = () => {
  return lorem.split('.').map((s) => s);
}

const allowedFormats = () => {
  let allFormats = [];
  Object.keys(formats).forEach(group => {
    formats[group].forEach(type => {
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
