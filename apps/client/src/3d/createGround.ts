import { Mesh, MeshLambertMaterial, PlaneGeometry } from 'three';

export const createGround = () => {
	const groundGeo = new PlaneGeometry(10000, 10000);
	const groundMat = new MeshLambertMaterial({ color: 0xffffff });
	groundMat.color.setHSL(0.095, 1, 0.75);

	const ground = new Mesh(groundGeo, groundMat);

	ground.position.y = -10;
	ground.rotation.x = -Math.PI / 2;
	ground.receiveShadow = true;
	return ground;
};
