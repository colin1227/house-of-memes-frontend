import { useEffect, useState, forceUpdate } from 'react';


import "./TopNav.scss";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';

import { Button, Modal } from '@material-ui/core';

import { signOut } from '../../helper/index';

const useStyles = makeStyles(() => ({
  modal: {
    position: 'absolute',
    height: "fit-content",
    width: 400,
    backgroundColor: "rgb(255, 255, 255)",
    border: '2px solid #000',
    margin: 'auto',
    padding: '3%',
    color: "white",
    fontFamily: 'Quicksand',
    outline: 0
  },
}));

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
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openState, changeOpenState] = useState(false);
  const [modalOpen, changeModalState] = useState(false);
  const [modalDimensions, changeModalDimensions] = useState({})

  useEffect(() => {
    const modalButtonRetrieve = document.getElementsByClassName('main-menu')[0];
    const modalButton = modalButtonRetrieve.getBoundingClientRect();
    changeModalDimensions({
      top: modalButton.top,
      bottom: modalButton.bottom,
      left: modalButton.left,
      right: modalButton.right })
  }, [])

  const handleOpen = (event) => {
    changeOpenState(true);
    setAnchorEl(event.currentTarget);
  };

  document.addEventListener( "touchend",(e) => {
    // clientX , clientY
    const tapX = e.changedTouches[0].clientX;
    const tapY = e.changedTouches[0].clientY;
    // if click is within the bounds of button
    if (modalDimensions.top < tapY &&
      tapY > modalDimensions.bottom &&
      modalDimensions.left < tapX &&
      tapX > modalDimensions.right) {
        handleClose();
      }
  }, false)

  const handleClose = () => {
    changeOpenState(false);
    setAnchorEl(false);
  };

  const openModal = () => {
    changeModalState(true);
  }

  const confirmSignOut = () => {
    signOut();
    changeModalState(false);
    window.location.reload(false);
  }

  const confirmCancel = () => {
    changeModalState(false);
  }

  return (
    <div 
      className="Top-nav-bar"
    >
      <Modal
        open={modalOpen}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className={classes.modal}
      >
        <div>
          <h2>
            Sign Out?
          </h2>
          <Button
            primary
            onClick={() => confirmSignOut()}>
            Confirm
          </Button>
          <Button
            secondary
            onClick={() => confirmCancel()}
            >
            Cancel
          </Button>
        </div>
      </Modal>
      {muteButton}
      <Button
        key={-3}
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        onTouchEnd={(e) => openState ? handleClose() : handleOpen(e)}
        onMouseOver={(e) => handleOpen(e)}
        className="main-menu"
      >
        <ListItemIcon>
          <ViewHeadlineIcon fontSize="small" />
        </ListItemIcon>
      </Button>

      <div className="head-title default-font">
        House of Memes
      </div>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={openState}
        MenuListProps={{
          onTouchEnd: handleClose,
          onMouseLeave: handleClose,
        }}
      >
      {buttons && buttons.map((btn, l) => {

        return (
          <StyledMenuItem
            key={btn.key}
            onTouchEnd={btn.text === "Sign Out" ? () => openModal() : btn.onClick}
            onClick={btn.text === "Sign Out" ? () => openModal() : btn.onClick}>
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
