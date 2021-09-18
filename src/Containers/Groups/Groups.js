import { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import axios from "axios";
import { makeStyles, withStyles } from '@material-ui/core/styles';

import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PublishIcon from '@material-ui/icons/Publish';
// import SettingsIcon from '@material-ui/icons/Settings';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import PanoramaIcon from '@material-ui/icons/Panorama';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import vars from '../../constants/vars.js';
import LoadingSVG from "../../components/loadingSVG/loadingSVG";
import { signOut } from "../../helper/index";
import { TopNav } from "../../components/index";
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import LockIcon from '@material-ui/icons/Lock';
import PublicIcon from '@material-ui/icons/Public';

import { Button } from '@material-ui/core';

import "./Groups.scss";

const myStorage = window.localStorage;

const instance = axios.create({
  proxyHeaders: false,
  credentials: false
});

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const useStyles1 = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});


const Groups = () => {
  const classes = useStyles();
  const classes1 = useStyles1();
  const history = useHistory();

  const signIn = [
    {
      key: 0,
      text: "Sign In",
      iconImg: <VpnKeyIcon />,
      onClick: () => history.push("/users/sign-in")
    },
    {
      key: 1,
      text: "Memes",
      iconImg: <PanoramaIcon />,
      onClick: () => history.push("/memes")
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
      text: "Upload",
      iconImg: <PublishIcon />,
      onClick: () => history.push('/memes/upload')
    },
    // {
    //   key: 3,
    //   text: "Settings",
    //   iconImg: <SettingsIcon />,
    //   onClick: () => history.push('/settings')
    // },
    {
      key: 4,
      text: "Sign Out",
      iconImg: <ExitToAppIcon />,
      onClick: () => handleSignOut(),
    }
  ];

  const [token, changeLogInStatus] = useState(myStorage.getItem('cryptoMiner'));
  const [username] = useState(myStorage.getItem('loggedIn'));

  const [availableGroups, changeAvailibleGroups] = useState(['All Groups']);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [publicGroups, changePublicGroups] = useState([]);
  const [privateGroups, changePrivateGroups] = useState([]);
  const [allGroups, changeAllGroups] = useState([]);

  const [isCreatingGroup, changeIsCreatingGroup] = useState(false);

  // TODO: uncomment make this the values of a form for createing a group

  // const [groupName, changeGroupName] = useState('');
  // const [groupType, changeGroupType] = useState('Public');
  // const [postAvailability, changePostAvailability] = useState('');

  const [loaded, isLoaded] = useState(false);

  const [initialize, changeInitialize] = useState(true);

  const [searchTermChanged, changedTerm] = useState(false);
  const [searchTerm, changeSearchedTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (newTerm) => {
    changeSearchedTerm(newTerm);
    changedTerm(true);
  }

  const handleCreatingGroup = () => {
    changeIsCreatingGroup(true);
    console.log('creating group');
  }

  const initialFetchGroups = useCallback(async() => {
    const results = await instance.get(`${vars.apiURL}/groups/${token ? `?token=${token}` : ''}`);
    if (results.status === 200) {
      changePublicGroups(results.data.public);
      changePrivateGroups(results.data.private);
      isLoaded(true);
    }
    if (results.data.public.length && results.data.private.length) {
      changeAvailibleGroups([...availableGroups, 'Public', 'Private']);
    } else if (results.data.public.length) {
      changeAvailibleGroups([...availableGroups, 'Public']);
    } else if (results.data.private.length) {
      changeAvailibleGroups([...availableGroups, 'Private']);
    }

    return results;
  }, [token, availableGroups]);

  const searchFetchGroups = useCallback(async() => {
    const results = await instance.get(`${vars.apiURL}/groups/search/${searchTerm}${token ? `?token=${token}` : ''}`);
    if (results.status === 200) {
      changeAllGroups(results.data.allGroups);
    }
  }, [token, searchTerm]);
  const handleSignOut = () => {
    signOut();
    changeLogInStatus(false);
    history.push("/memes/");
  }

  useEffect(() => {
    if(searchTermChanged) {
      searchFetchGroups(searchTerm);
      changedTerm(false);
    }
  }, [searchTerm, searchTermChanged, searchFetchGroups])

  useEffect(() => {
    if (initialize) {
      initialFetchGroups();
      changeInitialize(false);
    }
  }, [initialFetchGroups, initialize]);

  const groupOptions = () => {
    return (
      <StyledMenu
        className="default-font rm-chair"
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem
          className="default-font"
          key={0}
          selected={0 === selectedIndex}
          onClick={(event) => handleMenuItemClick(event, 0)}
        >
          <ListItemIcon>
            <AllInclusiveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="All Groups" />
        </StyledMenuItem>
        {
          publicGroups.length ?
            <StyledMenuItem
            key={1}
            selected={1 === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, 1)}
          >
            <ListItemIcon>
              <PublicIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              className="default-font"
              primary="Public" />
          </StyledMenuItem>
          :
          false
        }
        {
          privateGroups.length ?
            <StyledMenuItem
              key={2}
              selected={2 === selectedIndex}
              onClick={(event) => handleMenuItemClick(event, 2)}
            >
              <ListItemIcon>
                <LockIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                className="default-font"
                primary="Private" />
            </StyledMenuItem>
          :
          false
        }
     </StyledMenu>
    )
  }

  return (
    <div
      className="Groups-container"
    >
      <TopNav variant='contained' buttons={token ? myAccount : signIn} />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className="creating-group"
        open={Boolean(isCreatingGroup)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={Boolean(isCreatingGroup)}>
          <div className={classes1.paper + " create-group-modal"}>
            <h2
              className="default-font"
              id="transition-modal-title"
            >Create sumthin</h2>
            <p
              className="default-font"
              id="transition-modal-description"
            >Form here including following:</p>
            <ul>
              <li className="default-font">Group Name</li>
              <li className="default-font">private or public</li>
              <li className="default-font">who can post</li>
            </ul>
            <div
              className="create-group-button-container"
            >
              <Button
                variant="contained"
                style={{ backgroundColor: "peachpuff" }}
                className="cancel-me"
                disabled={false}
                type='submit'
                onClick={() => changeIsCreatingGroup(false)}
              >nah
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>

      <div className="groups">
        {
          <div className="dropdown-button-container">
            <List
              component="nav"
              aria-label="Device settings"
            >
              <ListItem
                button
                aria-haspopup="true"
                onMouseOver={(e) => handleClickListItem(e)}
                className="groups-dropdown-button"
              >
                <ListItemText
                  className="default-font"
                  primary={availableGroups[selectedIndex]}
                />
              </ListItem>
            </List>
            <TextField
              className="search-bar"
              id="outlined-basic"
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search"
              variant="outlined"
            />
            <Button
              variant="contained"
              className="add-group"
              onClick={() => handleCreatingGroup()}
            >+</Button>
            {
              groupOptions()
            }
          </div>
        }
        {
          loaded ?
            <div className="grided-groups">
              <TableContainer className="f" component={Paper}>
                <Table
                  className={`${ classes.table} default-font`}
                  size="small"
                  aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b className="default-font bold">{availableGroups[selectedIndex]}</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(selectedIndex === 0 && allGroups.length ?
                      allGroups :
                      selectedIndex === 1 && publicGroups.length ?
                      publicGroups: selectedIndex === 2 && privateGroups.length ?
                      privateGroups : []
                    ).map((name) => (
                      <TableRow key={name}>
                        <TableCell
                          className="default-font row-fade"
                          onClick={() => history.push(`/groups/${name.toLowerCase().split(" ").join("_")}`)}
                          component="th"
                          scope="row">
                          {name}
                        </TableCell>
                      </TableRow>
                    ))}
                    {
                    selectedIndex === 0 && !allGroups.length ?
                      <TableRow key={-1}>
                        <TableCell
                          className="default-font center-text">
                          <b>Search sumthin'...</b>
                        </TableCell>
                      </TableRow>
                      : false
                    }
                    {
                      searchTermChanged ?
                      <TableRow key={-1}>
                        <TableCell
                          className="default-font center-text fading-text">
                          Searching...
                        </TableCell>
                      </TableRow>
                      :
                      false
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          :
            <LoadingSVG />
        }
      </div>
    </div>
  );
}

export default Groups;
