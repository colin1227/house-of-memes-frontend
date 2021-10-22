import "./BottomNav.scss";

const BottomNav = (props) => {
  return (
    <div className={`Bottom-Nav
    ${(props &&
      props.classes) || ""}`}>
      {props && props.buttons}
    </div>
  )
}

export default BottomNav;
