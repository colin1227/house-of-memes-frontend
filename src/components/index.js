import TopNav from "./TopNav/TopNav";
import BottomNav from "./BottomNav/BottomNav";
import renders from "./renders/renders";
import LoadingSVG from "./loadingSVG/loadingSVG";
import SearchBar from "./SearchBar/SearchBar.tsx";
/*
TODO:
Step 1, import components here to export from here:

content
  - video
  - image
  - audio
Hashtags
LinkWithoutPreview
LinkWithPreview
MobileVideoViewer
Settings
TestVideoViewer
UserProfile

Step 2, change imports of all components to this file(./src/components/index.js).

Step 3, move Sign in and Sign up to this file and use them as modals.

*/


export { renders, TopNav,  BottomNav, LoadingSVG, SearchBar };
