import  {useContext, useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import LastBlocksContext from "./LastBlocksContext.js";

const BlockDAGVisualizer = ( ) => {
    const svgRef = useRef();
    const {blocks, isConnected} = useContext(LastBlocksContext);
    console.log(blocks)
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();  // Clear previous render

        const width = 1000;
        const height = 600;
        if(blocks.length > 200) {
            blocks.reverse().splice(0, 100)
        }
        const nodes = blocks.map(block => ({ id: block.header.hash, timestamp: block.header.timestamp }));
        const links = blocks.flatMap(block =>
            block.header.parentsByLevel.map(parent => ({ source: parent, target: block.header.hash }))
        );

        // Set up force simulation
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(50))
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = svg.append("g")
            .selectAll("line")
            .data(links)
            .enter()
            .append("line")
            .style("stroke", "#aaa");

        const node = svg.append("g")
            .selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("fill", "#69b3a2");

        node.append("title").text(d => d.id);

        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });

        return () => simulation.stop();
    }, [blocks]);

    return <svg ref={svgRef} width={1000} height={600}></svg>;
};

export default BlockDAGVisualizer;
