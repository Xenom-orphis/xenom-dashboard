
import viteLogo from '/vite.svg'
import bkg from '/section.png'
import './App.css'
import CoinsupplyBox from "./CoinsupplyBox.jsx";
import BlockDAGBox from "./BlockDAG.jsx";

function App() {

  const API_SERVER = "https://explorer.xenom-morphis.tech";

  return (

      <div className="wrapper">
          <div className="section">
            <div style={{backgroundImage: `url(${viteLogo})`}} className="logo"></div>
          </div>

          <div className="section" >
             <div className="block"  style={{backgroundImage: `url(${bkg})`}}>
              <h2> Xenomorph Blockchain</h2>


              <div className="col">
                  <BlockDAGBox></BlockDAGBox>
                  <CoinsupplyBox className="coinsupply">

                  </CoinsupplyBox>
              </div>

             </div>
          </div>
      </div>

  )
}

export default App
