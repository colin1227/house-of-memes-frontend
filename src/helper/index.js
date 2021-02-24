import { formats, lorem } from "../constants/vars.json";

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
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

export { reducer, allowedFormats, loremArray };
