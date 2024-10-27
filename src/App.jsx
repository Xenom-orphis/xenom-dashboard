
import viteLogo from '/vite.svg'
import './App.css'
import CoinsupplyBox from "./CoinsupplyBox.jsx";
import BlockDAGBox from "./BlockDAG.jsx";

function App() {

  const API_SERVER = "https://explorer.xenom-morphis.tech";

  return (

      <>
          <div style={{backgroundImage: `url(${viteLogo})`}} className="logo"></div>
          <div className="col">
          <BlockDAGBox></BlockDAGBox>
            <CoinsupplyBox className="coinsupply">

            </CoinsupplyBox>
          </div>
      </>

  )
}

export default App
