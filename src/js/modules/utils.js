
let Utils = {
	// creates offscreen canvas
	createCanvas(width, height) {
		let cvs = $(document.createElement("canvas")),
			ctx = cvs[0].getContext("2d", { willReadFrequently: true });
		cvs.prop({ width, height });
		return { cvs, ctx }
	},
	repaint(ctx, w, h, colors, palette) {
		let pixels = ctx.getImageData(0, 0, w, h),
			data = pixels.data;
		for (let i=0; i<data.length; i+=4) {
			let r = data[i+0],
				g = data[i+1],
				b = data[i+2],
				len = 2;
			while (len--) {
				if (colors[len][0] === r && colors[len][1] === g && colors[len][2] === b) {
					[r,g,b] = palette[len];
				}
			}
			data[i+0] = r;
			data[i+1] = g;
			data[i+2] = b;
		}
		ctx.putImageData(pixels, 0, 0);
	},
	random(min, max) {
		return Math.random() * ( max - min ) + min;
	},
	randomInt(min, max) {
		return this.random(min, max) | 0;
	},
};
