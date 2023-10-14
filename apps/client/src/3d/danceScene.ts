import {
	Clock,
	DirectionalLightHelper,
	HemisphereLight,
	HemisphereLightHelper,
	PerspectiveCamera,
	Scene,
	type Renderer
} from 'three';

import type { MMDAnimationHelper } from 'three/addons/animation/MMDAnimationHelper.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';

import 'ammo.js';
import { createCamera } from './createCamera';
import { createDirLight } from './createDirLight';
import { createGround } from './createGround';
import { createRenderer } from './createRenderer';
import { createScene } from './createScene';
import { createSky } from './createSky';
import { loadModel } from './loadModel';

export const danceScene = () => {
	let camera: PerspectiveCamera,
		scene: Scene,
		renderer: Renderer,
		effect: typeof OutlineEffect,
		controls: typeof OrbitControls,
		physics: any;
	let helper: typeof MMDAnimationHelper;

	const clock = new Clock();

	async function init() {
		const container = document.getElementById('container') ?? document.body;
		camera = createCamera(container);
		scene = createScene();

		// const gridHelper = new PolarGridHelper(30, 0);
		// gridHelper.position.y = -10;
		// scene.add(gridHelper);

		// const ambient = new AmbientLight(0xaaaaaa, 1);
		// scene.add(ambient);

		const hemiLight = new HemisphereLight(0xffffff, 0xffffff, 2);
		hemiLight.color.setHSL(0.6, 1, 0.6);
		hemiLight.groundColor.setHSL(0.095, 1, 0.75);
		hemiLight.position.set(0, 20, 0);
		scene.add(hemiLight);

		const dirLight = createDirLight(2);
		scene.add(dirLight);

		renderer = createRenderer(container);

		effect = new OutlineEffect(renderer);

		const hemiLightHelper = new HemisphereLightHelper(hemiLight, 10);
		scene.add(hemiLightHelper);

		const dirLightHelper = new DirectionalLightHelper(dirLight, 10);
		scene.add(dirLightHelper);

		const ground = createGround();
		scene.add(ground);

		const sky = createSky(scene, hemiLight.color);
		scene.add(sky);

		const model = await loadModel(scene, '/model/セイウンスカイ(MMD標準版).pmx', [
			// '/animation/requiem-1.vmd'
			// '/animation/requiem-2.vmd'
			'/animation/uma-1.vmd'
		]);

		physics = model.physics;
		helper = model.helper;

		controls = new OrbitControls(camera, renderer.domElement);
		controls.minDistance = 10;
		controls.maxDistance = 100;
		// controls.autoRotate = true;
		controls.autoRotateSpeed = 25;

		controls.update();
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		effect.setSize(window.innerWidth, window.innerHeight);
	}

	//

	function animate() {
		requestAnimationFrame(animate);
		render();
	}

	function render() {
		const delta = clock.getDelta();
		controls?.update();
		helper?.update(delta);
		if (physics !== undefined) physics.update(delta);
		effect.render(scene, camera);
	}

	return {
		init,
		animate,
		onWindowResize
	};
};
