import { test } from '../src/tap';

test('canvas font fallback reuses loaded system faces', (t) => {
	const scope = globalThis as any;
	const fonts = scope.fonts ?? scope.document.fonts;
	const canvas = scope.Switch ? scope.screen : scope.document.createElement('canvas');
	const contexts = [
		canvas.getContext('2d') as CanvasRenderingContext2D,
		new OffscreenCanvas(200, 50).getContext('2d')!,
	];
	for (const ctx of contexts) {
		ctx.font = '18px sans-serif';
		const initial = fonts.size;
		for (let i = 0; i < 200; i++) {
			ctx.font = 'bold 22px sans-serif';
			ctx.font = 'italic 18px system-ui';
			ctx.font = '700 16px sans-serif';
			ctx.font = '18px sans-serif';
		}
		t.equal(fonts.size, initial, 'style changes do not add system faces');
		t.ok(ctx.measureText('Playback').width > 0, 'fallback remains drawable');
		ctx.font = '18px system-icons';
		const withIcons = fonts.size;
		for (let i = 0; i < 200; i++) {
			ctx.font = 'bold 18px system-icons';
			ctx.font = '18px sans-serif';
		}
		t.equal(fonts.size, withIcons, 'style changes do not add icon faces');
	}
});

// Allocation-counting coverage also runs in stremio-nx/results/oom-repro.mjs.
