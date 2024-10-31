import moment from "moment";
import {useContext, useEffect, useRef, useState} from "react";
import LastBlocksContext from "./LastBlocksContext.js";
import {SOCKET_SERVER} from "./explorer_constants.js";





const BlockOverview = (props) => {
    const {blocks, lastBlockId} = props;
    const [isConnected, setIsConnected] = useState();


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