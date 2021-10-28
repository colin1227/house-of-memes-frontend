import { useCallback, useEffect, useState } from 'react';
import axios from "axios";
import { myStorage, signOut } from "../../helper";
import vars from "../../constants/vars";
import { Button } from 'semantic-ui-react';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import { withRouter } from "react-router";

const UserProfile = () => {
  // TODO: change how this is retrived
  // decoding cookie
  const [username] = useState(myStorage.getItem('loggedIn'));
  const getUserData = useCallback(() => {
    return axios.request({
      method: 'GET',
      url: `${vars.apiURL}/users/${username}`,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }, [username])

  useEffect(() => {
    console.log(getUserData())
  },[getUserData])

  return (
    <div className="user-profile">
      <div>
        <Button
          variant="contained"
          onClick={() => signOut()}
        >
          <ExitToAppIcon/>
        </Button>
        <Button>
          <SettingsIcon />
        </Button>
      </div>
    </div>
  )
}

export default withRouter(UserProfile);