// https://github.com/JonasKruckenberg/imagetools/issues/160
declare module '*.jpg' {
	type image = {
		fallback: { src: string; w: number; h?: number };
		sources: Record<string, { src: string; w: number; h?: number }>;
	};
	export default image;
}
