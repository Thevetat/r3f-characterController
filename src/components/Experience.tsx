import {
    Environment,
    OrthographicCamera,
} from "@react-three/drei";
import { useControls } from "leva";
import { useRef } from "react";
import { Map } from "./Map";
import { Physics } from "@react-three/rapier";
import { CharacterController } from "./CharacterController";
import { OrthographicCamera as ThreeOrthographicCamera } from "three";

const maps = {
    castle_on_hills: {
        scale: 3,
        position: [-6, -7, 0] as [number, number, number],
    },
    animal_crossing_map: {
        scale: 20,
        position: [-15, -1, 10] as [number, number, number],
    },
    city_scene_tokyo: {
        scale: 0.72,
        position: [0, -1, -3.5] as [number, number, number],
    },
    de_dust_2_with_real_light: {
        scale: 0.3,
        position: [-5, -3, 13] as [number, number, number],
    },
    medieval_fantasy_book: {
        scale: 0.4,
        position: [-4, 0, -6] as [number, number, number],
    },
};

type MapKey = keyof typeof maps;

export const Experience: React.FC = () => {
    const shadowCameraRef = useRef<ThreeOrthographicCamera>(null);
    const { map } = useControls("Map", {
        map: {
            value: "castle_on_hills" as MapKey,
            options: Object.keys(maps) as MapKey[],
        },
    });

    return (
        <>
            <Environment preset="sunset" />
            <directionalLight
                intensity={0.65}
                castShadow
                position={[-15, 10, 15]}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-bias={-0.00005}
            >
                <OrthographicCamera
                    left={-22}
                    right={15}
                    top={10}
                    bottom={-20}
                    ref={shadowCameraRef}
                    attach={"shadow-camera"}
                />
            </directionalLight>
            <Physics debug key={map}>
                <Map
                    scale={maps[map].scale}
                    position={maps[map].position}
                    model={`models/${map}.glb`}
                />
                <CharacterController />
            </Physics>
        </>
    );
};
