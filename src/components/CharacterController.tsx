import { CapsuleCollider, RapierRigidBody, RigidBody } from "@react-three/rapier"
import { Character } from "./Character"
import { Group, MathUtils, Vector3 } from "three"
import { useEffect, useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useControls } from "leva"
import { useKeyboardControls } from "@react-three/drei"
import { degToRad } from "three/src/math/MathUtils.js"



/**
 * Normalizes an angle to be within the range [-π, π].
 * @param angle The angle to normalize (in radians)
 * @returns The normalized angle (in radians)
 */
function normalizeAngle(angle: number): number {
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;
    return angle;
}

/**
 * Linearly interpolates between two angles, taking the shortest path.
 * @param start The starting angle (in radians)
 * @param end The ending angle (in radians)
 * @param t The interpolation factor (0 to 1)
 * @returns The interpolated angle (in radians)
 */
function lerpAngle(start: number, end: number, t: number): number {
    start = normalizeAngle(start);
    end = normalizeAngle(end);

    if (Math.abs(end - start) > Math.PI) {
        if (end > start) {
            start += 2 * Math.PI;
        } else {
            end += 2 * Math.PI;
        }
    }

    return start + (end - start) * t;
}

export const CharacterController: React.FC = () => {
    const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED } = useControls("Character Control", {
        WALK_SPEED: { value: 0.8, min: 0.1, max: 4, step: 0.1 },
        RUN_SPEED: { value: 1.6, min: 0.2, max: 12, step: 0.1 },
        ROTATION_SPEED: {
            value: degToRad(0.5),
            min: degToRad(0.1),
            max: degToRad(5),
            step: degToRad(0.1)
        }
    })

    const rb = useRef<RapierRigidBody>(null);


    const container = useRef<Group>(null);
    const character = useRef<Group>(null);

    const [animation, setAnimation] = useState("idle")

    const characterRotationTarget = useRef<number>(0)
    const rotationTarget = useRef<number>(0)

    const cameraTarget = useRef<Group>(null);
    const cameraPosition = useRef<Group>(null);
    const cameraWorldPosition = useRef(new Vector3());
    const cameraLookAtWorldPosition = useRef(new Vector3());
    const cameraLookAt = useRef(new Vector3());

    const [, get] = useKeyboardControls()

    const isInteracting = useRef(false)
    const { viewport } = useThree()

    useEffect(() => {
        const onMouseDown = () => {
            isInteracting.current = true
        }

        const onMouseUp = () => {
            isInteracting.current = false
        }

        const onTouchStart = (_e: TouchEvent) => {
            isInteracting.current = true
        }

        const onTouchEnd = (_e: TouchEvent) => {
            isInteracting.current = false
        }

        document.addEventListener("mousedown", onMouseDown)
        document.addEventListener("mouseup", onMouseUp)

        document.addEventListener("touchstart", onTouchStart)
        document.addEventListener("touchend", onTouchEnd)

        return () => {
            document.removeEventListener("mousedown", onMouseDown)
            document.removeEventListener("mouseup", onMouseUp)

            document.removeEventListener("touchstart", onTouchStart)
            document.removeEventListener("touchend", onTouchEnd)
        }
    }, [])

    useFrame(({ camera, pointer }) => {

        if (rb.current) {
            const vel = rb.current.linvel()

            const movement = {
                x: 0,
                z: 0,
            }

            if (get().forward) {
                movement.z = 1;
            }

            if (get().backward) {
                movement.z = -1;
            }

            let speed = get().run ? RUN_SPEED : WALK_SPEED;

            if (isInteracting.current) {
                const x = (pointer.x * viewport.width) / 2
                const y = (pointer.y * viewport.height) / 2 + 0.4

                if (Math.abs(x) > 0.1) {
                    movement.x = -x
                }

                movement.z = y + 0.4;

                if (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5) {
                    speed = RUN_SPEED
                }
            }

            if (get().left) {
                movement.x = 1;
            }

            if (get().right) {
                movement.x = -1;
            }

            if (movement.x !== 0) {
                rotationTarget.current += ROTATION_SPEED * movement.x
            }

            if (movement.x !== 0 || movement.z !== 0) {
                characterRotationTarget.current = Math.atan2(movement.x, movement.z)

                vel.x = Math.sin(rotationTarget.current + characterRotationTarget.current) * speed;
                vel.z = Math.cos(rotationTarget.current + characterRotationTarget.current) * speed;

                if (speed === RUN_SPEED) {
                    setAnimation("run")
                } else {
                    setAnimation("walk")
                }
            } else {
                setAnimation("idle")
            }

            if (character.current) {
                character.current.rotation.y = lerpAngle(
                    character.current.rotation.y,
                    characterRotationTarget.current,
                    0.1
                )
            }

            rb.current.setLinvel(vel, true)
        }

        if (container.current) {
            container.current.rotation.y = MathUtils.lerp(
                container.current.rotation.y,
                rotationTarget.current,
                0.1
            )
        }

        if (cameraPosition.current) {
            cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
            camera.position.lerp(cameraWorldPosition.current, 0.1);
        }

        if (cameraTarget.current) {
            cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
            cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
            camera.lookAt(cameraLookAt.current);
        }
    });

    return (
        <RigidBody colliders={false} lockRotations ref={rb}>
            <group ref={container}>
                <group ref={cameraTarget} position-z={1.5} />
                <group ref={cameraPosition} position-y={4} position-z={-4} />
                <group ref={character}>
                    <Character scale={0.18} position-y={-0.25} animation={animation} />
                </group>
            </group>
            <CapsuleCollider args={[0.08, 0.15]} />
        </RigidBody>
    );
}
