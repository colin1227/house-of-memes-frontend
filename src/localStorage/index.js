import keys from "./keys";

// text bar
const addHashtagItem = (item) => {
  let storedHashtagItems = JSON.parse(window.localStorage.getItem(keys.HASHTAG_ITEMS_KEY));
  storedHashtagItems = [...storedHashtagItems, item];
  window.localStorage.setItem(keys.HASHTAG_ITEMS_KEY, JSON.stringify(storedHashtagItems));
}

// add hashtag to tiktok.
const addHashtagAssignments = (hashtag) => {
  let storedHashtagAssignments = JSON.parse(window.localStorage.getItem(keys.HASHTAG_ASSIGNMENTS_LIST_KEY));
  storedHashtagAssignments = [...storedHashtagAssignments, hashtag];
  window.localStorage.setItem(keys.HASHTAG_ASSIGNMENTS_LIST_KEY, JSON.stringify(storedHashtagAssignments));
}

// erase all hashtags associated to a tiktok.
const clearHashtagAssignments = () => {
  const assignmentsIndex = JSON.parse(window.localStorage.getItem(keys.ASSIGNMENTS_INDEX_KEY));
  let storedHashtagAssignments = JSON.parse(window.localStorage.getItem(keys.HASHTAG_ASSIGNMENTS_LIST_KEY));
  storedHashtagAssignments[assignmentsIndex] = [];
  window.localStorage.setItem(keys.HASHTAG_ASSIGNMENTS_LIST_KEY, JSON.stringify(storedHashtagAssignments));
}

// new render of page but already have data.
const queryHashTagAssignments = (index) => {
  const storedHashtagAssignments = JSON.parse(window.localStorage.getItem(keys.HASHTAG_ASSIGNMENTS_LIST_KEY));
  return storedHashtagAssignments[index];
}

// find current meme to assign hashtags to.
const queryAssignmentIndex = () => {
  return JSON.parse(window.localStorage.getItem(keys.ASSIGNMENTS_INDEX_KEY));
}



const incrementAssignmentIndex = () => {
  let storedAssignmentIndex = JSON.parse(window.localStorage.getItem(keys.ASSIGNMENTS_INDEX_KEY));
  storedAssignmentIndex += 1;
  window.localStorage.setItem(keys.ASSIGNMENTS_INDEX_KEY, JSON.stringify(storedAssignmentIndex));
}

const decrementAssignmentIndex = () => {
  let storedAssignmentIndex = JSON.parse(window.localStorage.getItem(keys.ASSIGNMENTS_INDEX_KEY));
  storedAssignmentIndex -= 1;
  window.localStorage.setItem(keys.ASSIGNMENTS_INDEX_KEY, JSON.stringify(storedAssignmentIndex));
}

// delete button
// const removeHashtagItem = (item) => {
//   let storedHashtagItems = JSON.parse(window.localStorage.getItem(keys.HASHTAG_ITEMS_KEY));
//   storedHashtagItems = storedHashtagItems.filter(hItem => hItem !== item);
//   window.localStorage.setItem(keys.HASHTAG_ITEMS_KEY, JSON.stringify(storedHashtagItems));
// }
// const changeAssignmentIndex = (index) => {
//   window.localStorage.setItem(keys.ASSIGNMENTS_INDEX_KEY, JSON.stringify(index));
// }

const localStorageFunctions = {
  
  addHashtagItem,

  addHashtagAssignments,
  clearHashtagAssignments,
  queryHashTagAssignments,


  queryAssignmentIndex,
  incrementAssignmentIndex,
  decrementAssignmentIndex,
};

export default localStorageFunctions;
