import "./BottomNav.scss";

const BottomNav = (props) => {
  return (
    <div className="bottomNav">
      {props && props.buttons && props.buttons.map(btn => btn)}
    </div>
  )
}

export default BottomNav;
