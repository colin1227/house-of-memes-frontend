import { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import axios from "axios";
// import { Button } from '@material-ui/core';

import "./GroupPage.scss";

import constants from '../../constants/vars.json';
import { signOut } from "../../helper/index";

import { TopNav } from "./../../components/index";

import muteImg from "../../media/mutedImg.png";
import unmutedImg from "../../media/unmutedImg.png";
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import PublishIcon from '@material-ui/icons/Publish';
import SettingsIcon from '@material-ui/icons/Settings';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import renderMemes from '../../components/MemeViewer/MemeViewer';

const instance = axios.create({
  proxyHeaders: false,
  credentials: false
});

const url = constants.local ? 'http://localhost:9000': 'https://thingv1.herokuapp.com';
const myStorage = window.localStorage;

const GroupPage = (props) => {
  const history = useHistory();
  const [memeUrls, changeMemes] = useState([]);
  const [formatList, changeFormat] = useState([]);
  const [descriptions, changeDescription] = useState([]);
  const [muted, toggleMute] = useState(true);
  const [loaded, loadVid] = useState(false);
  const [token, changeLogInStatus] = useState(myStorage.getItem('cryptoMiner'));
  const [username] = useState(myStorage.getItem('loggedIn'));
  // TODO: useState instead

  const muteButton =
    <img key={-1} alt="sound toggle" className="sound-toggle" onClick={() => toggleMute(!muted)} type="image" src={muted ? muteImg : unmutedImg} />;
  const signIn = [
    {
      key: 0,
      text: "Sign In",
      iconImg: <VpnKeyIcon />,
      onClick: () => history.push({ pathname: "/u/sign-in", state: props.locations })
    },
    {
      key: 1,
      text: "Groups",
      iconImg: <PeopleOutlineIcon />,
      onClick: () => history.push("/groups")
    }
  ];
  const myAccount = [
    {
      key: 0,
      text: "Account",
      iconImg: <PermIdentityIcon />,
      onClick: () => history.push(`/u/${username}`)
    },
    {
      key: 1,
      text: "Groups",
      iconImg: <PeopleOutlineIcon />,
      onClick: () => history.push("/groups")
    },
    {
      key: 2,
      text: "Upload",
      iconImg: <PublishIcon />,
      onClick: () => history.push('/memes/upload')
    },
    {
      key: 3,
      text: "Settings",
      iconImg: <SettingsIcon />,
      onClick: () => history.push('/settings')
    },
    {
      key: 4,
      text: "Sign Out",
      iconImg: <ExitToAppIcon />,
      onClick: () => handleSignOut(),
    }
  ];


const handleImportMemes = useCallback(async(n=2) => {
  try {
      const result = await instance.get(`${url}/m/imports/${n}${token ? `?token=${token}` : ''}`);
      if (result.data.token) myStorage.setItem('cryptoMiner', result.data.token);
      changeMemes([
        ...memeUrls, 
        ...result.data.memeExport.names.map((name) => `${url}/m/meme/${name}`)
      ]);

      changeFormat([
        ...formatList,
        ...result.data.memeExport.formats
      ]);

      changeDescription([
        ...descriptions,
        ...result.data.memeExport.description
      ]);

      loadVid(true);
    } catch(err) {
      console.log(err);
   }
},[memeUrls, formatList, descriptions, token]);


const handleSignOut = () => {
  signOut();
  changeLogInStatus(false);
  history.push("/memes/");
}

useEffect(() => {
  if (0 >= memeUrls.length) {
    handleImportMemes(10);
  }
}, [memeUrls, formatList, handleImportMemes]);



  return (
    <div className="group-page-container">
      <TopNav muteButton={muteButton} buttons={ token ? myAccount : signIn } />
      <div className="group-container">
        <div className="white-space-height" />
        {
          loaded &&
           memeUrls.map((url, i) => {
            const memeAttributes = {
              index: i,
              url,
              format: formatList[i], 
              muted,
              autoplay: false,
              loaded,
              background: false
            }
              return (
                <div className="meme-container" key={i}>
                  {descriptions[i] ?
                    <div>
                      <div className="description-header">{descriptions[i]}</div>
                    </div>
                  :
                    false
                  }
                  {/* pretty sure this is a bad practice */}
                  <div className="meme-div">
                    {renderMemes(memeAttributes)}
                  </div>
                </div>
              )
            })
        }
      </div>
    </div>
  )
}

export default GroupPage;
