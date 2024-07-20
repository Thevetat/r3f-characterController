import { useAnimations, useGLTF } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import { Bone, Group, MeshStandardMaterial, SkinnedMesh } from "three";
import { GLTF } from "three/examples/jsm/Addons.js";

type GLTFResult = GLTF & {
    nodes: {
        _rootJoint: Bone;
        body: SkinnedMesh;
        eye: SkinnedMesh;
        "hand-": SkinnedMesh;
        leg: SkinnedMesh;
    };
    materials: {
        Material: MeshStandardMaterial;
    };
};

type CharacterProps = {
    animation: string;
} & JSX.IntrinsicElements['group'];

export function Character({ animation, ...props }: CharacterProps) {
    const group = useRef<Group>(null);
    const { nodes, materials, animations } = useGLTF("/models/character.glb") as unknown as GLTFResult;
    const { actions } = useAnimations(animations, group);

    useEffect(() => {
        const action = actions[animation];
        if (action) {
            action.reset().fadeIn(0.24).play();
            return () => {
                action.fadeOut(0.24);
            };
        }
    }, [animation, actions]);

    return (
        <group ref={group} {...props} dispose={null}>
            <group name="Scene">
                <group name="fall_guys">
                    <primitive object={nodes._rootJoint} />
                    <skinnedMesh
                        name="body"
                        geometry={nodes.body.geometry}
                        material={materials.Material}
                        skeleton={nodes.body.skeleton}
                        castShadow
                        receiveShadow
                    />
                    <skinnedMesh
                        name="eye"
                        geometry={nodes.eye.geometry}
                        material={materials.Material}
                        skeleton={nodes.eye.skeleton}
                        castShadow
                        receiveShadow
                    />
                    <skinnedMesh
                        name="hand-"
                        geometry={nodes["hand-"].geometry}
                        material={materials.Material}
                        skeleton={nodes["hand-"].skeleton}
                        castShadow
                        receiveShadow
                    />
                    <skinnedMesh
                        name="leg"
                        geometry={nodes.leg.geometry}
                        material={materials.Material}
                        skeleton={nodes.leg.skeleton}
                        castShadow
                        receiveShadow
                    />
                </group>
            </group>
        </group>
    );
}

useGLTF.preload("/models/character.glb");
