
import viteLogo from '/vite.svg'
import './App.css'
import CoinsupplyBox from "./CoinsupplyBox.jsx";

function App() {

  const API_SERVER = "https://explorer.xenom-morphis.tech";

  return (

      <>
          <div style={{backgroundImage: `url(${viteLogo})`}} className="logo"></div>
            <CoinsupplyBox className="coinsupply">

            </CoinsupplyBox>
      </>

  )
}

export default App
