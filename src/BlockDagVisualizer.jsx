import  {useContext, useEffect, useRef, useState} from 'react';
import Graph from 'graphology';
import Sigma from 'sigma';
import LastBlocksContext from "./LastBlocksContext.js";

const BlockDAGVisualizer = (  { blockData}  ) => {
    const containerRef = useRef(null);
    //const {blocks} = useContext(LastBlocksContext)
    useEffect(() => {
        // Initialize graphology graph
        const graph = new Graph();

        // Add nodes and edges from block data
        blockData.forEach(block => {
            const { hash, parentsByLevel } = block.header;

            // Add the block as a node if it doesn't exist
            if (!graph.hasNode(hash)) {
                graph.addNode(hash, {
                    label: hash,
                    size: 10,
                    color: "#456",
                    x: Math.random(), // Random position for demonstration
                    y: Math.random()
                });
            }

            // Add edges for each parent in parentsByLevel
            parentsByLevel.flat().forEach(parentHash => {
                if (!graph.hasNode(parentHash)) {
                    graph.addNode(parentHash, {
                        label: parentHash,
                        size: 6,
                        color: "#ff3636",
                        x: Math.random(),
                        y: Math.random()
                    });
                }
                if (!graph.hasEdge(parentHash, hash)) {
                    graph.addDirectedEdge(parentHash, hash, { color: "#a88204", size: 1 });
                }
            });
        });

        // Initialize Sigma with the container and graph
        const sigmaInstance = new Sigma(graph, containerRef.current, {
            renderEdges: true,
            renderLabels: false
        });

        // Clean up on unmount
        return () => sigmaInstance.kill();
    }, [blockData]);

    return (
        <>
            <h1>BlockDAG Visualization</h1>

    <div
        ref={containerRef}
            style={{
                width: '100%',
                height: '100vh',
                background: 'black',
                margin: '0'
            }}
        />
        </>
    );
};

export default BlockDAGVisualizer;
