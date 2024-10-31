
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
    const [blocks, setBlocks] = useState([]);
    const [isConnected, setIsConnected] = useState(0);

    const API_SERVER = "https://explorer.xenom-morphis.tech";

    const addBlock = (newBlock) => {
        setBlocks((prevBlocks) => {
            // Create a Set to track unique hashes
            const uniqueHashes = new Set(prevBlocks.map(block => block.header.hash));

            // Check if the new block's hash is already in the Set
            if (!uniqueHashes.has(newBlock.header.hash)) {
                // If not, add the new block
                const updatedBlocks = [...prevBlocks, newBlock];
                // Update localStorage with the new blocks
                localStorage.setItem("cacheBlocks", JSON.stringify(updatedBlocks));
                return updatedBlocks;
            }

            // If the hash is already present, return the previous blocks unchanged
            return prevBlocks;
        });
    };

    useEffect(() => {
        // function resizeBackground() {
        //     const background = document.getElementById('background');
        //     const width = window.innerWidth;
        //      const height = window.innerHeight;
        //
        //     // Adjust background-size based on window size
        //     if (width > 768) {
        //         background.style.backgroundSize = 'cover';
        //     } else {
        //         background.style.backgroundSize = 'cover';
        //         background.style.backgroundSize = height/ width * 100 + '%'
        //     }
        // }
        //
        // window.addEventListener('resize', resizeBackground);
        // window.addEventListener('load', resizeBackground); // To set the initial size on load
        //

        const socket = new WebSocket(SOCKET_SERVER);

        socket.onopen = () => {
            setIsConnected(true);
            socket.send('start-stream'); // Send a message to request last blocks

        };

        socket.onclose = () => {
            setIsConnected(false);
        };

        socket.onmessage = (event) => {

            try {

                const data = JSON.parse(event.data);
                console.log(data);
                if ('latest-block' in data) {


                    data['latest-block'].blocks.map(addBlock)





                    // socket.send('join-room');


                } else if ('bluescore' in data) {
                    //  setBlueScore(data.blueScore);
                } else if ('new-block' in data) {
                    console.log('New Block', data);
                    // addBlock(data)
                } else {
                    console.warn(`Unknown event: ${JSON.stringify(data)}`);
                }

            } catch (e) {
                console.log(e)
            }

        };


        const interval2 = setInterval( () => {
            localStorage.removeItem("cacheBlocks")
            setBlocks([])
        },1000 * 60 * 3)
        return () => {

            clearInterval(interval2)
        };
    }, [addBlock]);




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
              <BlockOverview lines={22} small blocks={blocks}/>
          </div>

      </div>

  )
}

export default App
