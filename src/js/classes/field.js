
class Field {
	constructor(cfg) {
		let { parent, scale, margin, width, height, color, line, skew, corner, mini } = cfg;

		this.parent = parent;
		this.top = margin.t;
		this.left = margin.l;
		this.height = height;
		this.width = width;
		this.corner = corner || .8;
		this.center = { radius: 10, dot: .25 };
		this.penalty = { radius: .2, y: 11, arc: 10 };
		this.pBox = { width: 40, height: 16.5 };
		this.gBox = { width: 18, height: 5.5 };
		this.goal = { width: 8, height: 1.5 };
		this.skew = skew || .85;
		this.line = line || 3;
		this.color = color || "#fff";
		this.scale = scale;
		this.mini = mini;

		this.sW = this.width * this.scale;
		this.sH = this.height * this.scale * this.skew;

		this.update();
	}

	update(delta, time) {
		this.oX = this.left + .5;
		this.oY = this.top + .5;
		
		this.coR = this.corner * this.scale;
		this.cR = this.center.radius * this.scale;
		this.cdR = this.center.dot * this.scale;
		this.cX = this.sW * .5;
		this.cY = this.sH * .5;
		// top penalty box
		this.pbW = this.pBox.width * this.scale;
		this.pbH = this.pBox.height * this.scale * this.skew;
		this.tpbX = (this.sW - this.pbW) * .5;
		this.tpbY = 0;
		// top goal box
		this.gbW = this.gBox.width * this.scale;
		this.gbH = this.gBox.height * this.scale * this.skew;
		this.tgbX = (this.sW - this.gbW) * .5;
		this.tgbY = 0;
		// top goal
		this.gW = this.goal.width * this.scale;
		this.gH = this.goal.height * this.scale;
		this.gX = (this.sW - this.gW) * .5;
		this.tgY = -this.gH;
		// top penalty dot
		this.pX = this.sW * .5;
		this.tpY = this.penalty.y * this.scale;
		this.bpY = this.sH - (this.penalty.y * this.scale);
		this.pR = this.penalty.radius * this.scale;
		this.paR = this.penalty.arc * this.scale;
		// bottom goal
		this.bgY = this.sH;
		// bottom penalty box
		this.bpbX = (this.sW - this.pbW) * .5;
		this.bpbY = this.sH - this.pbH;
		// bottom goal box
		this.bgbX = (this.sW - this.gbW) * .5;
		this.bgbY = this.sH - this.gbH;
	}

	render(ctx) {
		let w = this.sW,
			h = this.sH;
		ctx.save();
		ctx.translate(this.oX, this.oY);
		ctx.fillStyle =
		ctx.strokeStyle = this.color;
		ctx.lineWidth = this.line;
		// whole box
		ctx.beginPath();
		ctx.rect(0, 0, w, h);
		ctx.stroke();
		// halfway line
		ctx.beginPath();
		ctx.moveTo(0, (h/2));
		ctx.lineTo(w, (h/2));
		ctx.stroke();
		// center circle
		ctx.beginPath();
		ctx.ellipse(this.cX, this.cY, this.cR, this.cR*this.skew, 0, 0, Math.TAU);
		ctx.stroke();

		// top goal
		// ctx.beginPath();
		// ctx.rect(this.gX, this.tgY, this.gW, this.gH);
		// ctx.stroke();
		// top penalty box
		ctx.beginPath();
		ctx.rect(this.tpbX, this.tpbY, this.pbW, this.pbH);
		ctx.stroke();
		// top goal box
		ctx.beginPath();
		ctx.rect(this.tgbX, this.tgbY, this.gbW, this.gbH);
		ctx.stroke();
		// top penalty arc
		ctx.save();
		ctx.beginPath();
		ctx.rect(this.tpbX, this.tpbY+this.pbH, this.pbW, this.pbH);
		ctx.clip();
		ctx.beginPath();
		ctx.ellipse(this.pX, this.tpY, this.paR, this.paR*this.skew, 0, 0, Math.TAU);
		ctx.stroke();
		ctx.restore();

		// bottom goal
		// ctx.beginPath();
		// ctx.rect(this.gX, this.bgY, this.gW, this.gH);
		// ctx.stroke();
		// bottom penalty box
		ctx.beginPath();
		ctx.rect(this.bpbX, this.bpbY, this.pbW, this.pbH);
		ctx.stroke();
		// bottom goal box
		ctx.beginPath();
		ctx.rect(this.bgbX, this.bgbY, this.gbW, this.gbH);
		ctx.stroke();
		// bottom penalty arc
		ctx.save();
		ctx.beginPath();
		ctx.rect(this.tpbX, this.bpbY-this.pbH, this.pbW, this.pbH);
		ctx.clip();
		ctx.beginPath();
		ctx.ellipse(this.pX, this.bpY, this.paR, this.paR*this.skew, 0, 0, Math.TAU);
		ctx.stroke();
		ctx.restore();

		if (!this.mini) {
			// corners
			ctx.beginPath();
			ctx.rect(0, 0, w, h);
			ctx.clip();
			ctx.beginPath();
			ctx.arc(0, 0, this.coR, 0, Math.TAU);
			ctx.arc(w, 0, this.coR, 0, Math.TAU);
			ctx.arc(w, h, this.coR, 0, Math.TAU);
			ctx.arc(0, h, this.coR, 0, Math.TAU);
			ctx.stroke();
			// top penalty circle
			ctx.beginPath();
			ctx.arc(this.pX, this.tpY, this.pR, 0, Math.TAU);
			ctx.fill();
			// bottom penalty circle
			ctx.beginPath();
			ctx.arc(this.pX, this.bpY, this.pR, 0, Math.TAU);
			ctx.fill();
			// center dot
			ctx.beginPath();
			ctx.arc(this.cX, this.cY, this.cdR, 0, Math.TAU);
			ctx.fill();
		}
		
		// restore context
		ctx.restore();
	}
}