import moment from "moment";
import {useContext, useEffect, useRef, useState} from "react";
import LastBlocksContext from "./LastBlocksContext.js";
import {SOCKET_SERVER} from "./explorer_constants.js";





const BlockOverview = (props) => {
    const [blocks, setBlocks] = useState([]);
    const [isConnected, setIsConnected] = useState();
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
            setBlocks([])
        },1000 * 60 * 3)
        return () => {

            clearInterval(interval2)
        };
    }, [addBlock]);

    const [tempBlocks, setTempBlocks] = useState([]);
    const [keepUpdating, setKeepUpdating] = useState(true);

    const keepUpdatingRef = useRef()
    keepUpdatingRef.current = keepUpdating

    const onClickRow = (e) => {
        navigate(`/blocks/${e.target.parentElement.id}`)
    }

    useEffect(() => {
        if (keepUpdatingRef.current) {
            setTempBlocks(blocks);
        }
    }, [blocks])
    // Step 1: Get current time and calculate cutoff for last 10 seconds
    const currentTime = Date.now();
    const cutoffTime = currentTime - 10000; // 1 seconds ago

// Step 2: Filter blocks within the last 10 seconds
    const recentBlocks = blocks.filter(block => block.header.timestamp >= cutoffTime);

// Step 3: Calculate the average blocks per second over the last 10 seconds
    const blocksPerSecond = recentBlocks.length / 10;


    localStorage.setItem('BPS', blocksPerSecond.toFixed(2));


    return <div className="block-overview">
        <div className="d-flex flex-row w-100">
        <h2> Latest Blocks (BPS avg. 10 secs) {blocksPerSecond.toFixed(2)}</h2>
        </div>

        <div className="block-overview-content">
            <table className={`styled-table w-100`}>
                <thead>
                <tr>
                    <th>Timestamp</th>
                    {props.small ? <></> : <th>BlueScore</th>}
                    <th>TXs</th>
                    <th width="100%">Hash</th>
                </tr>
                </thead>
                <tbody>
                {[...tempBlocks].sort((a, b) => b.header.timestamp - a.header.timestamp).slice(0, props.lines).map((x, index) => <tr
                    id={index} key={index} onClick={onClickRow}>
                    <td className="table-timestamp">{moment(parseInt(x.header.timestamp)).format("YYYY‑MM‑DD HH:mm:ss")}</td>
                    {props.small ? <></> : <td>{x.header.blueScore}</td>}
                    <td>{x.transactions.length}</td>
                    <td className="hashh">{x.header.hash}</td>
                </tr>)}
                </tbody>
            </table>
        </div>
    </div>

}

export default BlockOverview;