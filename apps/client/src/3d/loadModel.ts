import type { AnimationClip, Scene, SkinnedMesh } from 'three';
import { MMDAnimationHelper } from 'three/addons/animation/MMDAnimationHelper.js';
import { MMDPhysics } from 'three/addons/animation/MMDPhysics.js';
import { MMDLoader } from 'three/addons/loaders/MMDLoader.js';

export const loadModel = async (scene: Scene, modelFile: string, vmdFiles: string[]) => {
	const helper = new MMDAnimationHelper({
		afterglow: 1.0,
		pmxAnimation: true
	});

	const loader = new MMDLoader();

	const mmd = await new Promise<{ mesh: SkinnedMesh; animation: AnimationClip }>((resolve) => {
		loader.loadWithAnimation(
			modelFile,
			vmdFiles,
			function (mmd: { mesh: SkinnedMesh; animation: AnimationClip }) {
				resolve(mmd);
			},
			function onProgress(xhr: { loaded: number; total: number; lengthComputable: boolean }) {
				if (xhr.lengthComputable) {
					const percentComplete = (xhr.loaded / xhr.total) * 100;
					console.log(Math.round(percentComplete * 10) / 10 + '% downloaded');
				}
			},
			null
		);
	});

	const physics = new MMDPhysics(mmd.mesh, []);

	const mesh = physics.mesh;
	mesh.position.y = -10;

	scene.add(mesh);

	helper.add(mesh, {
		animation: mmd.animation,
		physics: true
	});

	const ikHelper = helper.objects.get(mesh).ikSolver.createHelper();
	ikHelper.visible = false;
	scene.add(ikHelper);

	const physicsHelper = helper.objects.get(mesh).physics.createHelper();
	physicsHelper.visible = false;
	scene.add(physicsHelper);

	helper.enable('ik', true);
	helper.enable('physics', true);
	helper.enable('animation', true);

	return {
		mesh,
		physics,
		helper,
		ikHelper,
		physicsHelper
	};
};
