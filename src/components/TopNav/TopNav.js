import { useState } from 'react';
import "./TopNav.scss";
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';

import { Button } from '@material-ui/core';

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

const TopNav = ({ muteButton, buttons }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openState, changeOpenState] = useState(false);
  const handleOpen = (event) => {
    changeOpenState(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    changeOpenState(false);
    setAnchorEl(false);
  };
  return (
    <div 
      className="topNavBar"
    >
      {muteButton}
      <Button
        key={-3}
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        onMouseOver={(e) => handleOpen(e)}
        className="main-menu"
      >
        <ListItemIcon>
          <ViewHeadlineIcon fontSize="small" />
        </ListItemIcon>
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={openState}
        MenuListProps={{ onMouseLeave: handleClose }}
      >
      {buttons && buttons.map((btn, l) => {

        return (
          <StyledMenuItem
            key={btn.key}
            
            onClick={btn.onClick}>
            <ListItemIcon>
              {btn.iconImg}
            </ListItemIcon>
            <ListItemText
              primary={btn.text}
              className={l ? "grey-text" : ""} />
          </StyledMenuItem>
        )
      })}
    </StyledMenu>
  </div>)
}

export default TopNav;
