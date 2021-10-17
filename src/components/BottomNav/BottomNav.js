import "./BottomNav.scss";

const BottomNav = (props) => {
  return (
    <div className={`Bottom-Nav`}>
      {props && props.buttons && props.buttons.map(btn => btn)}
    </div>
  )
}

export default BottomNav;
