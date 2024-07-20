import { useAnimations, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { Group, Material, Mesh } from "three";
import { GLTF } from "three/examples/jsm/Addons.js";

type MapProps = {
    model: string;
    scale: number;
    position: [number, number, number];
};

type GLTFResult = GLTF & {
    nodes: Record<string, Mesh>;
    materials: Record<string, Material>;
};

export const Map: React.FC<MapProps> = ({ model, ...props }) => {
    const { scene, animations } = useGLTF(model) as unknown as GLTFResult;
    const group = useRef<Group>(null);
    const { actions } = useAnimations(animations, group);

    useEffect(() => {
        scene.traverse((child) => {
            if ((child as Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [scene]);

    useEffect(() => {
        if (actions && animations.length > 0) {
            const action = actions[animations[0].name];
            if (action) {
                action.play();
            }
        }
    }, [actions, animations]);

    return (
        <group>
            <RigidBody type="fixed" colliders="trimesh">
                <primitive object={scene} {...props} ref={group} />
            </RigidBody>
        </group>
    );
};
