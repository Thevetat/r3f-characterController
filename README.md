# R3F 3rd Person Controller Starter (TypeScript Version)

This project is a TypeScript conversion of the 3D third-person character controller tutorial using React Three Fiber (R3F) and React Three Rapier. It provides a basic setup for a controllable character in various 3D environments.

## Credit

This project is based on the tutorial and code by Wawa Sensei:
- Original Repository: [r3f-3rd-person-controller-final](https://github.com/wass08/r3f-3rd-person-controller-final/tree/main)
- Video Tutorial: [Create a 3rd Person Character Controller in React Three Fiber](https://www.youtube.com/watch?v=yjpGVIe_Gy8)

The original JavaScript implementation has been converted to TypeScript in this version.

## Features

- Third-person character controller with keyboard and mouse/touch input
- Multiple pre-configured 3D environments
- Physics-based movement using React Three Rapier
- Customizable character animations
- Dynamic camera following the character
- Environment switching through a user interface
- TypeScript implementation for improved type safety and developer experience

## Prerequisites

- Node.js (version 14 or higher recommended)
- npm or yarn

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/r3f-3rd-person-controller-starter-ts.git
   ```

2. Navigate to the project directory:
   ```
   cd r3f-3rd-person-controller-starter-ts
   ```

3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

## Usage

1. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

2. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

3. Use the following controls to move the character:
   - W/A/S/D or Arrow keys: Move the character
   - Shift: Run
   - Mouse/Touch: Look around and move

4. Use the UI controls to switch between different maps and adjust character settings.

## Project Structure

- `src/components/Character.tsx`: Character model and animations
- `src/components/CharacterController.tsx`: Main logic for character movement and input handling
- `src/components/Experience.tsx`: Main scene setup, including environment and physics
- `src/components/Map.tsx`: Map loading and setup

## Customization

- Modify `src/components/CharacterController.tsx` to adjust movement behavior
- Add or modify maps in the `maps` object within `src/components/Experience.tsx`
- Adjust physics properties in the `RigidBody` component in `CharacterController.tsx`

## TypeScript

This project uses TypeScript for improved type safety and developer experience. The main TypeScript configurations can be found in `tsconfig.json` and `tsconfig.node.json`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- [Wawa Sensei](https://github.com/wass08) for the original tutorial and implementation
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber)
- [React Three Rapier](https://github.com/pmndrs/react-three-rapier)
- [Three.js](https://threejs.org/)
- [Vite](https://vitejs.dev/)
