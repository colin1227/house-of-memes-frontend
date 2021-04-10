import { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import axios from "axios";
import { makeStyles, withStyles } from '@material-ui/core/styles';
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
import SettingsIcon from '@material-ui/icons/Settings';
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
import loadingSVG from "../../components/loadingSVG/loadingSVG";
import { signOut } from "../../helper/index";
import { TopNav } from "../../components/index";
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import LockIcon from '@material-ui/icons/Lock';
import PublicIcon from '@material-ui/icons/Public';

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
      text: "Account",
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

  const [token, changeLogInStatus] = useState(myStorage.getItem('cryptoMiner'));
  const [username] = useState(myStorage.getItem('loggedIn'));

  const [availableGroups, changeAvailibleGroups] = useState(['All Groups']);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [publicGroups, changePublicGroups] = useState([]);
  const [privateGroups, changePrivateGroups] = useState([]);
  const [allGroups, changeAllGroups] = useState([]);


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
        className="quicksand"
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem
          className="quicksand"
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
              className="quicksand"
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
                className="quicksand"
                primary="Private" />
            </StyledMenuItem>
          :
          false
        }
     </StyledMenu>
    )
  }

  return (
    <div className="groups-container" >
      <TopNav variant='contained' buttons={token ? myAccount : signIn} />
      {/* <div className="create-group" >
        <Button variant='contained' style={{ background: "orange", color: "#616161" }}>Create Group</Button>
      </div> */}

      <div className="groups">
      {
        <div className="dropdown-button-container">
        <List component="nav" aria-label="Device settings">
          <ListItem
            button
            aria-haspopup="true"
            onClick={handleClickListItem}
            className="groups-dropdown-button"
          >
            <ListItemText
              className="quicksand"
              primary={availableGroups[selectedIndex]} />
          </ListItem>
        </List>
        <TextField
          className="search-bar"
          id="outlined-basic"
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search"
          variant="outlined" />
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
                className={`${ classes.table} quicksand`}
                size="small"
                aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b className="quicksand bold">{availableGroups[selectedIndex]}</b>
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
                        className="quicksand row-fade"
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
                        className="quicksand center">
                        Search sumthin'...
                      </TableCell>
                    </TableRow>
                    : false
                  }
                  {
                    searchTermChanged ?
                    <TableRow key={-1}>
                      <TableCell
                        className="quicksand center fader">
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
          loadingSVG()
      }
      </div>
    </div>
  );
}

export default Groups;
