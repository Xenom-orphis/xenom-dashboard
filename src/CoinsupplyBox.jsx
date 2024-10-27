
import moment from 'moment';
import {useEffect, useState} from "react";
import {numberWithCommas} from "./helper.jsx";
import {getCoinSupply, getHalving} from './kaspa-api-client';
import {API_SERVER, KASPA_UNIT} from "./explorer_constants";


const CBox = () => {
    const [circCoins, setCircCoins] = useState("-");
    const [blockReward, setBlockReward] = useState("-");
    const [halvingDate, setHalvingDate] = useState("-");
    const [halvingAmount, setHalvingAmount] = useState("-");

    const initBox = async () => {
        if (localStorage.getItem("cacheCircCoins")) {
            setCircCoins(localStorage.getItem("cacheCircCoins"))
        }

        if (localStorage.getItem("cacheBlockReward")) {
            setBlockReward(localStorage.getItem("cacheBlockReward"))
        }

        if (localStorage.getItem("cacheHalvingDate")) {
            setHalvingDate(localStorage.getItem("cacheHalvingDate"))
        }

        if (localStorage.getItem("cacheHalvingAmount")) {
            setHalvingAmount(localStorage.getItem("cacheHalvingAmount"))
        }


        const coinSupplyResp = await getCoinSupply()
        getBlockReward();

        getHalving().then((d) => {
            setHalvingDate(moment(d.next_halving_timestamp * 1000).format("YYYY-MM-DD HH:mm"))
            setHalvingAmount(d.next_halving_amount.toFixed(2))
            localStorage.setItem("cacheHalvingDate", moment(d.next_halving_timestamp * 1000).format("YYYY-MM-DD HH:mm"))
            localStorage.setItem("cacheHalvingAmount", d.next_halving_amount.toFixed(2))
        })

        setCircCoins(Math.round(coinSupplyResp / 100000000))
        localStorage.setItem("cacheCircCoins", Math.round(coinSupplyResp / 100000000))
    }

    useEffect(() => {
        initBox();

        const updateCircCoins = setInterval(async () => {

            const coinSupplyResp = await getCoinSupply()
            setCircCoins(Math.round(coinSupplyResp / 100000000))

        }, 10000)


        return async () => {
            clearInterval(updateCircCoins)
        };
    }, [])

    async function getBlockReward() {
        await fetch(`${API_SERVER}/info/blockreward`)
            .then((response) => response.json())
            .then(d => {
                setBlockReward(d.block_reward.toFixed(2))
                localStorage.setItem("cacheBlockReward", d.block_reward.toFixed(2))

            })
            .catch(err => console.log("Error", err))
    }


    useEffect(() => {
        document.getElementById('coins').animate([
            // keyframes
            {opacity: '1'},
            {opacity: '0.6'},
            {opacity: '1'},
        ], {
            // timing options
            duration: 300
        });
    }, [circCoins])


    return <>
        <div className="cardBox mx-0">
            <table style={{fontSize: "1rem"}}>
                <tr>
                    <td colspan='2' className="text-center" style={{"fontSize": "4rem"}}>

                        <div id="light1" className="cardLight"/>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" className="text-center">
                        <h3>Coin supply</h3>
                    </td>
                </tr>
                <tr>
                    <td className="cardBoxElement align-top">
                        Total
                    </td>
                    <td className="">
                        <div id="coins">{numberWithCommas(circCoins)} {KASPA_UNIT}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td className="cardBoxElement align-top">Max <span className="approx">(approx.)</span></td>
                    <td className="pt-1">28,700,000,000 {KASPA_UNIT}</td>
                </tr>
                <tr>
                    <td className="cardBoxElement align-top">Mined</td>
                    <td className="pt-1">{(circCoins / 28700000000 * 100).toFixed(2)} %</td>
                </tr>
                <tr>
                    <td className="cardBoxElement align-top">Block reward</td>
                    <td className="pt-1">${blockReward} {KASPA_UNIT}</td>
                </tr>
                <tr>
                    <td className="cardBoxElement align-top">Reward reduction
                        {/* <OverlayTrigger overlay={<Tooltip id="halvinginfo">Here is some information about the chromatic halving..</Tooltip>}>
                            <span>
                            <FaInfoCircle />
                            </span>
                        </OverlayTrigger> */}
                    </td>
                    <td className="pt-1"><>{halvingDate}<br/>
                        <div className="text-end w-100 pe-3 pt-1" style={{fontSize: "small"}}>to {halvingAmount} {KASPA_UNIT}
                        </div></>
                    </td>
                </tr>
            </table>
        </div>
    </>
}


export default CBox
