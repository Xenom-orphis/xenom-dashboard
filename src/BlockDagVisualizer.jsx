// BlockDAGViewer.js
import React, { useEffect, useRef, useState } from 'react';
import Graph from 'graphology';
import Sigma from 'sigma';
import blockImg from '/crypto-block.svg';
const BlockDAGViewer = ({ blocks }) => {
    const containerRef = useRef(null);
    const [isPaused, setIsPaused] = useState(true);
    const [currentBlocks, setCurrentBlocks] = useState(blocks);
    const [timeframeStart, setTimeframeStart] = useState(0);
    const [selectedBlock, setSelectedBlock] = useState(null); // State for clicked block info
    const timeframe = 10;

    const togglePlayPause = () => setIsPaused(!isPaused);
    console.log(blocks)
    useEffect(() => {
        if (!isPaused) {
            setCurrentBlocks(blocks);
        }
    }, [blocks, isPaused]);

    useEffect(() => {
        const graph = new Graph();

        const visibleBlocks = currentBlocks.slice(timeframeStart, timeframeStart + timeframe);

        visibleBlocks.forEach(block => {

            const { hash, selectedParentHash, mergeSetBluesHashes, childrenHashes, isChainBlock } = block.verboseData;
            const {daaScore, parentsByLevel, nonce, extra } = block.header

            // Add each block node with an SVG image if it doesn't exist
            if (!graph.hasNode(hash)) {
                graph.addNode(hash, {
                    label: hash,
                    size: 20,
                    image: {
                        url: blockImg ,
                        scale: 1.5,
                        clip: 0.85
                    },
                    x: Math.random(), // Random position for demonstration
                    y: Math.random(),
                    data: { hash, selectedParentHash, mergeSetBluesHashes, childrenHashes, isChainBlock , daaScore, parentsByLevel, nonce}

                });
            }

            parentsByLevel.flat().forEach(parentHash => {
                if (!graph.hasNode(parentHash)) {
                    graph.addNode(parentHash, {
                        label: parentHash,
                        size: 20,
                        image: {
                            url: "/crypto-block.svg",
                            scale: 1.5,
                            clip: 0.85
                        },
                        x: Math.random(),
                        y: Math.random(),
                        data: { hash, selectedParentHash, mergeSetBluesHashes, childrenHashes, isChainBlock , daaScore, parentsByLevel, nonce}


                    });
                }
                if (!graph.hasEdge(parentHash, hash)) {
                    graph.addDirectedEdge(parentHash, hash, { color: "#a88204", size: 1 });
                }
            });
        });

        // Initialize Sigma instance with the graph
        const sigmaInstance = new Sigma(graph, containerRef.current, {
            renderEdges: true,
            renderLabels: false
        });

        // Add click listener for nodes to display block information
        sigmaInstance.on('clickNode', (event) => {

            const nodeData = graph.getNodeAttributes(event.node);

            setSelectedBlock(nodeData.data); // Set selected block data for sidebar
        });

        return () => sigmaInstance.kill();
    }, [currentBlocks, timeframeStart]);

    return (
        <div style={{display: 'flex'}}>
            <div style={{marginBottom: '10px'}}>
                <button className="circular" onClick={togglePlayPause}>{isPaused ? 'Play' : 'Pause'}</button>

                <label style={{marginLeft: '10px'}}>
                    Timeframe Start:
                    <input
                        type="range"
                        min="0"
                        max={Math.max(0, blocks.length - timeframe)}
                        value={timeframeStart}
                        onChange={(e) => setTimeframeStart(parseInt(e.target.value, 10))}
                        style={{width: '300px', marginLeft: '10px'}}
                    />
                </label>
            </div>
            {/* Sidebar for displaying block info */}
            {selectedBlock && isPaused && (
                <div className="column" onClick={ () => setSelectedBlock(null) }>
                    <h3>Block Information</h3>
                    <p><strong>Block Hash:</strong> {selectedBlock.hash}</p>
                    <p><strong>Block Parents:</strong> {selectedBlock.parentsByLevel.reverse()[0].join(', ')}</p>
                    <p><strong>Block Merge Set:</strong> {selectedBlock.mergeSetBluesHashes?.join(', ')}</p>
                    <p><strong>Block Children:</strong> {selectedBlock.childrenHashes?.join(', ')}</p>
                    <p><strong>Is Block In Chain:</strong> {selectedBlock.isChainBlock ? 'Yes' : 'No'}</p>
                    <p><strong>Block Color:</strong> {selectedBlock.color || 'Blue'}</p>
                    <p><strong>Block DAA Score:</strong> {selectedBlock.daaScore}</p>
                </div>
            )}

            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    height: '80vh',
                    background: '#000',
                    margin: '0'
                }}
            />

        </div>
    );
};

export default BlockDAGViewer;
