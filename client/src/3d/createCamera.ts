import { PerspectiveCamera } from 'three';

export const createCamera = (parent: HTMLElement) => {
	const camera = new PerspectiveCamera(45, parent.clientWidth / parent.clientHeight, 1, 2000);
	camera.position.z = 25;
	camera.position.y = 10;
	return camera;
};
