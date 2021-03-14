import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
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

import { signOut } from "../../helper/index";
import { TopNav } from "../../components/index";

import "./Groups.scss";

const myStorage = window.localStorage;

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});


const rows = [
  {
    name: 'Nostalgia'
  },
  {
    name: 'SSBU'
  },
  {
    name: 'Youtube Algorithm'
  },
  {
    name: 'Twitch'
  },
  {
    name: 'Back in my day...'
  }
];

const Groups = () => {
  const classes = useStyles();
  const history = useHistory();

  const [token, changeLogInStatus] = useState(myStorage.getItem('cryptoMiner'));
  const [username] = useState(myStorage.getItem('loggedIn'));

  const handleSignOut = () => {
    signOut();
    changeLogInStatus(false);
    history.push("/memes/");
  }

  const signIn = [
    {
      key: 0,
      text: "Sign In",
      iconImg: <VpnKeyIcon />,
      onClick: () => history.push("/u/sign-in")
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
      onClick: () => history.push(`/u/${username}`)
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
      onClick: () => history.push('/m/upload')
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

  return (
    <div className="groups-container" >
      <TopNav variant='contained' buttons={token ? myAccount : signIn} />
      {/* <div className="create-group" >
        <Button variant='contained' style={{ background: "orange", color: "#616161" }}>Create Group</Button>
      </div> */}
      <div className="grided-groups">
        <TableContainer component={Paper}>
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell><b>Names</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell onClick={() => history.push(`/groups/${row.name.toLowerCase().split(" ").join("_")}`)} component="th" scope="row">
                    {row.name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default Groups;
