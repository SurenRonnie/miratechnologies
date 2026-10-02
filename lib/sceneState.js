// One mutable object shared by the scroll engine, scene layers and UI.
// Never put this in React state: it changes every frame.
export const sceneState = {
  velocity: 0,
  pointer: { x: 0, y: 0 },
  pointerSmooth: { x: 0, y: 0 },
  pulse: 0.85,
  phase: "MINIMUM",
  ready: false,
};
