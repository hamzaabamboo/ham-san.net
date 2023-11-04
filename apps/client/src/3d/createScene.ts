import { Color, Fog, Scene } from 'three';

export const createScene = () => {
  const scene = new Scene();
  scene.background = new Color().setHSL(0.6, 0, 1);

  scene.fog = new Fog(scene.background, 1, 5000);

  return scene;
};
