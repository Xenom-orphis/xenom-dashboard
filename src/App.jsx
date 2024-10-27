
import viteLogo from '/vite.svg'
import bkg from '/section.png'
import './App.css'
import CoinsupplyBox from "./CoinsupplyBox.jsx";
import BlockDAGBox from "./BlockDAG.jsx";
import BlockDAGVisualizer from './BlockDAGVisualizer';
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
    let blockArr = []
    const recentBlocks = blocks.slice(-20).reverse();

    const data = {
        nodes: recentBlocks.map(b => ({ id: b.header.hash })),
        links: recentBlocks
            .filter(b => b.header.parentsByLevel[0]) // Ensure there's at least one parent
            .map(b => ({
                source: b.header.hash,
                target: b.header.parentsByLevel[0], // Link to the first parent in the list
            })),
    };

    useEffect(() => {

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
                                if(blockArr.length > 100){
                                    blockArr.reverse().splice(0, 40);
                                }
                            blockArr.map(addBlock);
                            console.log(blockArr.join('\n'));
                        })

                        socket.send('join-room');


                    } else if ('bluescore' in data) {
                        setBlueScore(data.blueScore);
                    } else if ('new-block' in data) {
                        console.log('New Block', data);
                        addBlock(data)
                    } else {
                        console.warn(`Unknown event: ${JSON.stringify(data)}`);
                    }
                    console.warn(blockArr)
            } catch (e) {
                console.log(e)
            }

        };
        const interval = setInterval( () =>  {
            socket.send('last-blocks' )
        }, 1500 )
        return () => {
            clearInterval(interval)

        };
    }, []);
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
          <div className="section">
              <h1>BlockDAG Visualizer</h1>
              <BlockDAGVisualizer data={data}/>
          </div>
          <LastBlocksContext.Provider value={{blocks, isConnected}}>
          <div className="section">
              <BlockOverview lines={22} small blocks={blockArr}/>
          </div>
          </LastBlocksContext.Provider>
      </div>

  )
}

export default App
