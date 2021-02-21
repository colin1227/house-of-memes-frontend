import "./TopNav.scss";

const TopNav = ({ buttons }) => {
  return (
    <div className="topNavBar">
      {buttons && buttons.map(btn => btn)}
    </div>
  )
}

export default TopNav;
