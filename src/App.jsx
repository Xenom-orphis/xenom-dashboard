
import viteLogo from '/vite.png'
import bkg from '/section.png'
import './App.css'
import CoinsupplyBox from "./CoinsupplyBox.jsx";
import BlockDAGBox from "./BlockDAG.jsx";
import BlockDagVisualizer from './BlockDagVisualizer.jsx';
import {useEffect, useState} from "react";
import {SOCKET_SERVER} from "./explorer_constants.js";
import BlockOverview from "./BlockOverview.jsx";
import LastBlocksContext from './LastBlocksContext';
import BlockChartDag from "./BlockChartDag.jsx";
function App() {

    const [blueScore, setBlueScore] = useState(0);

    const API_SERVER = "https://explorer.xenom-morphis.tech";






  return (

      <div className="wrapper">
          <div className="section " id="background" style={{backgroundImage: `url(${viteLogo})`}}>

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


          <div className="section-graph">

                <BlockChartDag  />



          </div>


          <div className="section">
              <BlockOverview lines={22} small/>
          </div>

      </div>

  )
}

export default App
