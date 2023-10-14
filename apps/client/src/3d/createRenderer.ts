import { WebGLRenderer } from 'three';

export const createRenderer = (container: HTMLElement) => {
	const renderer = new WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	renderer.shadowMap.enabled = true;

	container.appendChild(renderer.domElement);
	return renderer;
};
