import React, {useRef, useEffect, useContext, useState, useTransition} from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import {
    AccumulativeShadows,
    Center,
    Environment,
    OrbitControls,
    RandomizedLight,
    Sphere,
    useTexture
} from '@react-three/drei';
import * as d3 from 'd3';

import data from './../data.json';
import * as PropTypes from "prop-types";




const BlockDAGChart = () => {

    const [isPaused, setIsPaused] = useState(false);
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    const [currentBlocks, setCurrentBlocks] = useState(data);
    setTimeout( () => {
        setIsPaused(true)
    }, 2000)
    useEffect(() => {
        const blocks1 = JSON.parse(localStorage.getItem('cacheBlocks'));
        if (!isPaused) {
            setCurrentBlocks(blocks1);
        }
    }, [ isPaused]);


    const red = new THREE.Color("hsl(0, 100%, 50%)");
    const blue = new THREE.Color("hsl(254, 100%, 50%)");
    const togglePlayPause = () => setIsPaused(!isPaused);
    const nodesMap = new Map(currentBlocks.map(block => [block.header.hash, {
        id: block.header.hash,
        parents: block.header.parentsByLevel.flat(),
        color: block.verboseData.mergeSetBluesHashes.includes(block.header.hash) ?   blue : red
    }]));

    nodesMap.forEach(node => {
        node.parents.forEach(parentId => {
            if (!nodesMap.has(parentId)) {
                nodesMap.set(parentId, { id: parentId, parents: [] });
            }
        });
    });

    const nodes = Array.from(nodesMap.values());
    const links = nodes.flatMap(node =>
        node.parents.map(parentId => ({ source: parentId, target: node.id }))
    );

    const nodePositions = useRef(new Map());
    const linkPositions = links.map(link => ({
        source: nodePositions.current.get(link.source) || new THREE.Vector3(),
        target: nodePositions.current.get(link.target) || new THREE.Vector3(),
    }));

    useEffect(() => {
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(15))
            .force('charge', d3.forceManyBody().strength(-200))
            .force('center', d3.forceCenter(0, 0, 0))
            .stop();

        for (let i = 0; i < 300; ++i) simulation.tick();

        nodes.forEach(node => {
            nodePositions.current.set(
                node.id,
                new THREE.Vector3(node.x, node.y, node.z || Math.random() * 10 - 5)
            );
        });
    }, [links, nodes]);
    THREE.ColorManagement.enabled = true


    function SphereZ({node})  {
        const geometry = new THREE.SphereGeometry( 15, 32, 16 );
        const material = new THREE.MeshLambertMaterial( { color: "hsl(255, 100%, 50%)" , opacity: 1, emissive: node.color ,shininess: 70, reflectivity:1, refractionRatio:0.98 } );
        const goldMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color("hsl(254, 100%, 70%)"),
            metalness: 1.0, // Full metalness
            roughness: 0.4  // Adjust roughness for desired shininess
        });
        return (
            <mesh  position={nodePositions.current.get(node.id)} geometry={geometry} material={goldMaterial} />
        )
    }


    clicked ? alert('hi') : ''

    function Env() {


        return <Environment preset={'night'} background={false} backgroundIntensity={100} blur={0.75} />
    }

    return (
        <div>
            <button className="circular" onClick={togglePlayPause}>{isPaused ? 'Play' : 'Pause'}</button>

            <Canvas shadows={"soft"} camera={{position: [0, 0, 100], fov: 50}}>
                <OrbitControls autoRotate={false}  enablePan={true} enableZoom={true}
                               minPolarAngle={Math.PI / 2.1} maxPolarAngle={Math.PI / 2.1}/>
                <Env />
                <group position={[0, -0.65, 0]}>
                    {nodes.map((node, index) => (

                       <SphereZ node={node} key={index} />

                    ))}


                </group>






                {/* Render Nodes as Colorful Metal Spheres */}

                {/* Render Parent-Child Links */}
                {links.map((link, index) => {
                    const sourcePos = nodePositions.current.get(link.source);
                    const targetPos = nodePositions.current.get(link.target);

                    if (sourcePos && targetPos) {
                        const points = [sourcePos, targetPos];
                        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

                        return (
                            <line key={index} geometry={lineGeometry}>
                                <lineBasicMaterial attach="material" color="grey" linewidth={2}/>
                            </line>
                        );
                    }

                    return null;
                })}
            </Canvas>
        </div>
    )
        ;
};

export default BlockDAGChart;
