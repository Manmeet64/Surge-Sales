import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "../Components/Mascot.jsx";
import { Link } from "react-router-dom";

function Landing() {
    return (
        <div className="w-[100%] h-[110vh] flex flex-col justify-center bg-image items-center pt-[32px]">
            <div className="w-[100%] h-[50vh] flex flex-col justify-center items-center gap-16">
                <h1 className="text-7xl font-bold font-poppins text-center text-[#8f41cf]">
                    Surge
                </h1>
                <h3 className="text-3xl font-bold font-poppins text-center text-[#BD68EE] mt-[-40px]">
                    Making Sales Efficient
                </h3>
                <Link
                    to="/script-generator"
                    className="bg-purple-400 px-4 py-2 rounded-md text-xl mt-4 text-white hover:bg-purple-500 duration-300 transition-all ease-in-out absolute top-[190px]"
                >
                    Explore the Sales AI Tool
                </Link>
            </div>
            <Canvas className="w-[100%] h-[50vh] flex justify-center items-center">
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Model />
                <OrbitControls
                    enableZoom={false}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 2}
                />
            </Canvas>
        </div>
    );
}

export default Landing;
