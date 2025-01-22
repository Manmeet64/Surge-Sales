import React from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
    const { nodes, materials } = useGLTF("/mascot.glb");

    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.model.geometry}
                material={materials.CustomMaterial}
                rotation={[Math.PI / 2, 0, 0]}
                scale={[2.5, 2.5, 2.5]}
                position={[0, -2.2, 0]}
            />
        </group>
    );
}

useGLTF.preload("/mascot.glb");
