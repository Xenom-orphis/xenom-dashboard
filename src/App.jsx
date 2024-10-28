
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
function App() {
    const [blocks, setBlocks] = useState([]);
    const [blueScore, setBlueScore] = useState(0);
    const [isConnected, setIsConnected] = useState();
    const API_SERVER = "https://explorer.xenom-morphis.tech";
    const addBlock = (newBlock) => {

        setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
    };

    const blockData = blocks;



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

        let blockArr = []
        const socket = new WebSocket(SOCKET_SERVER);

        socket.onopen = () => {
            setIsConnected(true);
            socket.send(JSON.stringify({ event: 'last-blocks' })); // Send a message to request last blocks
            socket.send(JSON.stringify({ event: 'join-room', room: 'bluescore' }));
        };

        socket.onclose = () => {
            setIsConnected(false);
        };

        socket.onmessage = (event) => {

            try {

                    const data = JSON.parse(event.data);

                    if ('last-blocks' in data) {


                            data['last-blocks'].blocks.map( v => {
                                blockArr.push(v)


                        });
                        if(blockArr.length > 300){
                            blockArr.reverse().splice(0, 200);
                        }
                         [...new Map(blockArr.map(block => [block.header.daaScore, block])).values()].map(addBlock);

                       // socket.send('join-room');


                    } else if ('bluescore' in data) {
                        setBlueScore(data.blueScore);
                    } else if ('new-block' in data) {
                        console.log('New Block', data);
                        addBlock(data)
                    } else {
                        console.warn(`Unknown event: ${JSON.stringify(data)}`);
                    }

            } catch (e) {
                console.log(e)
            }

        };

        const interval = setInterval( () =>  {
            socket.send('last-blocks' )
        }, 800 )
        return () => {
            clearInterval(interval)

        };
    }, []);
  return (

      <div className="wrapper">
          <div className="section " id="background" style={{backgroundImage: `url(${viteLogo})`}}>

          </div>

          <LastBlocksContext.Provider value={{blocks, isConnected}}>
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
          </LastBlocksContext.Provider>

          <div className="section-graph">

              <BlockDagVisualizer blocks={blockData}/>
          </div>

          <LastBlocksContext.Provider value={{blocks, isConnected}}>
          <div className="section">
              <BlockOverview lines={22} small blocks={blocks}/>
          </div>
          </LastBlocksContext.Provider>
      </div>

  )
}

export default App
