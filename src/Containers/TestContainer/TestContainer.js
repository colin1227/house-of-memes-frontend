// libs
import { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@mui/material/Button';

// scss
import "./TestContainer.scss";

// helper functions and vars
import { signOut } from "../../helper/index";
import likedTiktoks from "../../constants/allMyTiktoks";

// components
import { NavigationBar, TopNav } from "../../components/index";

// icons / images
import muteImg from "../../media/mutedImg.png";
import unmutedImg from "../../media/unmutedImg.png";
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PanoramaIcon from '@material-ui/icons/Panorama';
import PublishIcon from '@material-ui/icons/Publish';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import TiktokEmbed from '../../components/tiktokEmebed/tiktokEmbed';

// storage
const myStorage = window.localStorage;

const TestContainer = () => {  
  const history = useHistory();
  const [token, changeLogInStatus] = useState(myStorage.getItem('HoMCookie'));
  const [username] = useState(myStorage.getItem('loggedIn'));
  // const [searchTerm, handleSearch] = useState('');
  const [hashtagButtons] = useState(["funny", "skit", "cats", "dogs", "birds", "reptiles", "hornyjail", "dance", "music", "vibin", "cars", "sentimental"]);
  // searchTerm(confirm) -> handleHashtagButtons
  const [classStates, handleClassState] = useState([false, false, false, false, false, false, false, false, false, false, false]);
  const [windowWidth] = useState(window.innerWidth);

  const [i, changeI] = useState(myStorage.getItem("i") || 0);

  const confirmNextMeme = () => {
    changeI(i + 1);
  }

  const returnToLastMeme = () => {
    changeI(i - 1);
  }

  const editClassState = (index) => {
    const newClassStates = classStates;
    newClassStates[index] = !classStates[index];
    handleClassState(newClassStates);
  }

  const eraseClassStates = () => {
    handleClassState(classStates.map( _ => false));
  }

  // Button Changes
  const [muted, toggleMute] = useState(true);
  const [buttonsHeldDown, changeButtonsHeldDown] = useState([]);
  const buttonsHeldDownRef = useRef(buttonsHeldDown);

  // timestamps for buttons
  const [buttonTimestampsHeldDown, changeButtonTimestampsHeldDown] = useState([]);
  const buttonTimestampsHeldDownRef = useRef(buttonTimestampsHeldDown);

  const handleSignOut = () => {
    signOut();
    changeLogInStatus(false);
    history.push("/memes/");
  }

  const handleKeyDown = (code) => {
    changeButtonsHeldDown(currentlyHeldButtons => [...currentlyHeldButtons, code]);
    buttonsHeldDownRef.current = [...buttonsHeldDownRef.current, code];
    changeButtonTimestampsHeldDown(currentlyHeldTimestamps => [ ...currentlyHeldTimestamps, Math.floor(Date.now() / 10) ]);
    buttonTimestampsHeldDownRef.current = [
      ...buttonTimestampsHeldDownRef.current,
      Math.floor(Date.now() / 10)
    ];
  }

  const handleKeyUp = () => {
    changeButtonsHeldDown(prvbtns => prvbtns.splice(1, 1));
    buttonsHeldDownRef.current = buttonsHeldDownRef.current.splice(1, 1);
    
    changeButtonTimestampsHeldDown(tStamp => tStamp.splice(1, 1));
    buttonTimestampsHeldDownRef.current = buttonTimestampsHeldDownRef.current.splice(1, 1);
  }

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      const pressed = buttonsHeldDownRef.current.includes(e.code);
      
      if (!pressed && e.code === "KeyM") {
        // mute
        handleKeyDown(109);
      } else if (!pressed && e.code === "Space") {
        // pause
        handleKeyDown(32);
      } else if (!pressed && e.code === "ArrowUp") {
        // volume up
        handleKeyDown(117);

      } else if (!pressed && e.code === "ArrowDown") {
        // volume down
        handleKeyUp(115);
      }
    });

    document.addEventListener("keyup", (e) => {

      if (e.code === "KeyM") {
        // mute
        handleKeyUp(109);
      } else if (e.code === "Space") {
        // pause
        handleKeyUp(32);
      } else if (e.code === "ArrowUp") {
        // volume up
        handleKeyUp(117);
      } else if (e.code === "ArrowDown") {
        // volume down
        handleKeyUp(115);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const muteButton =
    <img key={-1} alt="sound toggle" className="sound-toggle" onClick={() => toggleMute(!muted)} type="image" src={muted ? muteImg : unmutedImg} />;

  const signIn = [
    {
      key: 0,
      text: "Sign In",
      iconImg: <VpnKeyIcon />,
      onClick: () => history.push({ pathname: "/users/sign-in", state: { lastUrl: window.location.pathname } })
    }
  ];

  const myAccount = [
    {
      key: 0,
      text: myStorage.getItem('loggedIn'),
      iconImg: <PermIdentityIcon />,
      onClick: () => history.push(`/users/${username}`)
    },
    {
      key: 1,
      text: "Upload",
      iconImg: <PublishIcon />,
      onClick: () => history.push('/memes/upload')
    },
    {
      key: 2,
      text: "Sign Out",
      iconImg: <ExitToAppIcon />,
      onClick: () => handleSignOut(),
    }
  ];

  const mobileNav = [
    <div key={-1} className="mobile-nav">
      <Button
        key={0}
        onClick={ token ?
          () => history.replace(`/users/${username}`) :
          () => history.replace('users/sign-in')}>
        <PermIdentityIcon />
      </Button>
      <Button
        key={1}
        onClick={() => history.push('/memes/upload')}>
        <PublishIcon />
      </Button>
      <Button
        key={2}
        onClick={() => history.push('/memes/')}>
        <PanoramaIcon />
      </Button>
    </div>
  ]

  const makeButtons = (btnTexts) => {
    let buttons = [];

    for (let i = 0; i < btnTexts.length; i++) {
      buttons.push(<Button
        variant='contained'
        key={0 + i}
        className={classStates[i] ? "clicked" : ""}
        disabled={classStates[i]}
        onClick={() => editClassState(i)}
      >{btnTexts[i]}</Button>)
    }
    return buttons;
  }

  const hashTags = [
    <div
      key={0}
      className="assigners" >
        <h3 className={"default-font-black text-center"}>Assign hashtags</h3>
        <div className={'hashtags'}>
          {makeButtons(hashtagButtons)}
        </div>
        <div className={"meme-status-control"}>
          <Button
          variant='contained'
          key={-3}
          onClick={() => returnToLastMeme()}>Previous</Button>
          <Button
            variant='contained'
            key={-2}
              onClick={() => eraseClassStates()}>cancel</Button>
          <Button
            variant='contained'
            key={-1}
              onClick={() => confirmNextMeme()}>Confirm</Button>
        </div>
    </div>
  ]

  return(
  <div 
    className='Viewer-Container'>
    {
      windowWidth >= 632 ?
      <TopNav
        variant='contained'
        muteButton={muteButton}
        buttons={token ? myAccount : signIn} />
      :
      false
    }
    <div className="content">
      <div className="content-description-pannel">
        <div className="space-taker-upper"/>
      </div>
      <div className="content-observation-pannel">
        {<TiktokEmbed
          videoIdentifier={likedTiktoks[i]}
          />}
      </div>
      {
        windowWidth > 632 &&
        <div className="content-comment-pannel">
          <NavigationBar buttons={hashTags} />
        </div>
      }
    </div>
    {windowWidth <= 632 &&
        <NavigationBar variant='contained' buttons={mobileNav} />
    }
  </div>
  )
};

export default TestContainer;
