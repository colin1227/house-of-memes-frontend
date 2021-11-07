import "./NavigationBar.scss";

const NavigationBar = (props) => {
  return (
    <div className={`Navigation-Bar 
    ${(props &&
      props.classes) || ""}`}>
      {props && props.buttons}
    </div>
  )
}

export default NavigationBar;