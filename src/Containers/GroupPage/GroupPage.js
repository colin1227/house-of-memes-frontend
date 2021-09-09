import { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import axios from "axios";
// import { Button } from '@material-ui/core';

import "./GroupPage.scss";

import vars from '../../constants/vars.js';
import helperFuncs from '../../constants/helperFuncs';
import { signOut } from "../../helper/index";

import { TopNav } from "./../../components/index";

import muteImg from "../../media/mutedImg.png";
import unmutedImg from "../../media/unmutedImg.png";
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import PublishIcon from '@material-ui/icons/Publish';
import SettingsIcon from '@material-ui/icons/Settings';
import PanoramaIcon from '@material-ui/icons/Panorama';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';


import renderFunctions from '../../components/renders/renders';
import LinkWithPreview from '../../components/LinkWithPreview/LinkWithPreview';
import LinkWithoutPreview from '../../components/LinkWithoutPreview/LinkWithoutPreview';

const instance = axios.create({
  proxyHeaders: false,
  credentials: false
});

const myStorage = window.localStorage;

const GroupPage = (props) => {
  const history = useHistory();
  const [groupName, changeGroupName] = useState('');
  const [memeUrls, changeMemes] = useState([]);
  const [formatList, changeFormat] = useState([]);
  const [links, changeLinks] = useState([]);
  const [previewAvailability, changePreviewAvailability] = useState([]);
  const [previewIds, changePreviewIds] = useState([]);
  const [descriptions, changeDescriptions] = useState([]);
  const [mouseOverId, changeMouseOverId] = useState('');
  const [lastMouseOverId, changeLastMouseOverId] = useState('');
  const [muted, toggleMute] = useState(true);
  const [loaded, loadVid] = useState(false);
  const [token, changeLogInStatus] = useState(myStorage.getItem('cryptoMiner'));
  const [username] = useState(myStorage.getItem('loggedIn'));
  const [once, makeOnce] = useState(true);
  // TODO: useState instead

  const muteButton =
    <img key={-1} alt="sound toggle" className="sound-toggle" onClick={() => toggleMute(!muted)} type="image" src={muted ? muteImg : unmutedImg} />;
  const signIn = [
    {
      key: 0,
      text: "Sign In",
      iconImg: <VpnKeyIcon />,
      onClick: () => history.push({ pathname: "/users/sign-in", state: { lastUrl: window.location.pathname } })
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
      text: myStorage.getItem('loggedIn'),
      iconImg: <PermIdentityIcon />,
      onClick: () => history.push(`/users/${username}`)
    },
    {
      key: 1,
      text: "Memes",
      iconImg: <PanoramaIcon />,
      onClick: () => history.push("/memes")
    },
    {
      key: 2,
      text: "Groups",
      iconImg: <PeopleOutlineIcon />,
      onClick: () => history.push("/groups")
    },
    {
      key: 3,
      text: "Upload",
      iconImg: <PublishIcon />,
      onClick: () => history.push('/memes/upload')
    },
    {
      key: 4,
      text: "Settings",
      iconImg: <SettingsIcon />,
      onClick: () => history.push('/settings')
    },
    {
      key: 5,
      text: "Sign Out",
      iconImg: <ExitToAppIcon />,
      onClick: () => handleSignOut(),
    }
  ];


const handleImportMemes = useCallback(async(group) => {
  try {
      const result = await instance.get(`${vars.apiURL}/groups/${group}${token ? `?token=${token}` : ''}`);
      if (result.data.token) myStorage.setItem('cryptoMiner', result.data.token);

      changeGroupName(result.data.groupName);

      changeMemes([
        ...memeUrls, 
        ...result.data.memes.map((name) => `${vars.apiURL}/memes/${name}`)
      ]);

      changeFormat([
        ...formatList,
        ...result.data.formats
      ]);

      changeLinks([
        ...links,
        ...result.data.links
      ])


      changePreviewAvailability([
        ...previewAvailability,
        ...result.data.previews
      ])

      changePreviewIds([
        ...previewIds,
        ...result.data.previewIds
      ])

      if (result.data && result.data.descriptions) {
        changeDescriptions([
          ...descriptions,
          ...result.data.descriptions
        ]);
      }
      loadVid(true);
    } catch(err) {
      console.log(err);
   }
},[memeUrls, formatList, descriptions, token, links, previewAvailability, previewIds]);


const handleSignOut = () => {
  signOut();
  changeLogInStatus(false);
  history.push("/memes/");
}

const handleMouseOut = (link) => {
  changeMouseOverId('');
  changeLastMouseOverId(link);
}

useEffect(() => {
  if (0 >= memeUrls.length && once) {
    let group = window.location.href.split('/');
    group = group[group.length - 1];
    makeOnce(false);
    handleImportMemes(group);
  }
}, [memeUrls, formatList, handleImportMemes, once]);



  return (
    <div className="group-page-container">
      <TopNav muteButton={muteButton} buttons={ token ? myAccount : signIn } />
      <div className="group-container">
        <div className="white-space-height" />
        <div className="group-name">
          {helperFuncs.capitalizeFirstLetter(groupName)}
        </div>
        {/* TODO: display memes by order of contenttagging
            NOTE: at this point it will be helpfull to know sorting algorithms
            and their Big O notation thing unless they are all in order
            or a list is given to index the correct values(but still
            would be helpful to know Big O stuff).
        */}
        {
          // TODO: make function to only allow linking to certain domains.
          // e.g.: youtube, tiktok, instagram, reddit, steam, google.
          // TODO: modallet users know they are leaving the site.
          loaded &&
            links.map((link, i) => {
              return (
                <div className="meme-container" key={i}>
                  {
                    previewAvailability[i] ?
                      <LinkWithPreview
                        link={link}
                        description={descriptions[i] ? descriptions[i] : link}
                        preview={`${vars.apiURL}/memes/preview/${previewIds[i]}`}
                        changeMouseOverId={changeMouseOverId}
                        handleMouseOut={handleMouseOut}
                        mouseOverId={mouseOverId}
                        lastMouseOverId={lastMouseOverId}
                      />
                    :
                      <LinkWithoutPreview
                        link={link}
                        description={descriptions[i] ? descriptions[i] : link}
                      />
                  }
                </div>
              )
            })
        }
        
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
                  {/* pretty sure this naming convention is a bad practice; rename mem-div at some point because its used else where. */}
                  <div className={`meme-div ${descriptions[i] ? 'described' : ''}`}>
                    {renderFunctions.renderMemes(memeAttributes)}
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
