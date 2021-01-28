import "./Waves.scss";

const Waves = (props) => {
  console.log(props.children)
  return (
    <div className="top">
        <div className="inner-header flex" />
            <svg className="waves"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 24 150 28"
              preserveAspectRatio="none"
              shapeRendering="auto">
              <div className="rslt kiddies">
                {/* {
                  props.children
                ||
                  <div>
                    <span className="part1">If you are so <span className='red'>decrepit</span> popped off(got excited) for new airings of the Brady bunch or
                    worse, You were literally in middle school 5 years ago,</span><span className="part2"> this app is <span className="red">not</span> for you.</span>
                  </div>
                } */}
              </div>
              <defs>
                <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
              </defs>
              <g className="parallax">
                <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
                <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
                <div className="bbs">
                </div>
                <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
                <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
              </g>
            </svg>
        <div className="white" />
      </div>
      
  )
}

export default Waves;