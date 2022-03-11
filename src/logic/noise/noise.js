export default function getNoise(args) {
	let noise = null;
	switch (args.generator) {
		case "white":
			noise = new WhiteNoise(args.width, args.height);
			break;
		case "perlin":
			noise = new PerlinNoise(args.frequency);
			break;
		default:
			noise = new PerlinNoise(args.frequency);
			break;
	}

	if (args.fractal) {
		noise = new Fractal(noise, args.octaves, args.fractalFrequency, args.amplitude, args.persistence)
	}

	return noise;
}

export class WhiteNoise {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.cache = {};
	}

	get(x, y) {
		x = Math.round(x * this.width);
		y = Math.round(y * this.height);

		if (this.cache[x + "-" + y]) {
			return this.cache[x + "-" + y];
		}

		let value = Math.random();
		this.cache[x + "-" + y] = value;
		return value;
	}
}

class Vector2 {
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
	dot(other){
		return this.x*other.x + this.y*other.y;
	}
}

// description and adapted implementation: https://rtouti.github.io/graphics/perlin-noise-algorithm
// underlying improved Perlin noise: https://mrl.cs.nyu.edu/~perlin/paper445.pdf
export class PerlinNoise {
	
	constructor(frequency) {
		this.frequency = frequency;
		this.permutation = this.makePermutation();
	}

	shuffle(tab){
		for(let e = tab.length-1; e > 0; e--){
			let index = Math.round(Math.random()*(e-1)),
				temp  = tab[e];
			
			tab[e] = tab[index];
			tab[index] = temp;
		}
	}
	
	makePermutation(){
		let P = [];
		for(let i = 0; i < 256; i++){
			P.push(i);
		}
		this.shuffle(P);
		for(let i = 0; i < 256; i++){
			P.push(P[i]);
		}
		
		return P;
	}
	
	getConstantVector(v){
		//v is the value from the permutation table
		let h = v & 3;
		if(h == 0)
			return new Vector2(1.0, 1.0);
		else if(h == 1)
			return new Vector2(-1.0, 1.0);
		else if(h == 2)
			return new Vector2(-1.0, -1.0);
		else
			return new Vector2(1.0, -1.0);
	}
	
	fade(t){
		return ((6*t - 15)*t + 10)*t*t*t;
	}
	
	lerp(t, a1, a2){
		return a1 + t*(a2-a1);
	}
	
	get(x, y) {
		let raw = this._get(x*this.frequency, y*this.frequency);
		return (raw + 1) / 2;
	}

	_get(x, y) {
		let X = Math.floor(x) & 255;
		let Y = Math.floor(y) & 255;
	
		let xf = x-Math.floor(x);
		let yf = y-Math.floor(y);
	
		let topRight = new Vector2(xf-1.0, yf-1.0);
		let topLeft = new Vector2(xf, yf-1.0);
		let bottomRight = new Vector2(xf-1.0, yf);
		let bottomLeft = new Vector2(xf, yf);
		
		//Select a value in the array for each of the 4 corners
		let valueTopRight = this.permutation[this.permutation[X+1]+Y+1];
		let valueTopLeft = this.permutation[this.permutation[X]+Y+1];
		let valueBottomRight = this.permutation[this.permutation[X+1]+Y];
		let valueBottomLeft = this.permutation[this.permutation[X]+Y];
		
		let dotTopRight = topRight.dot(this.getConstantVector(valueTopRight));
		let dotTopLeft = topLeft.dot(this.getConstantVector(valueTopLeft));
		let dotBottomRight = bottomRight.dot(this.getConstantVector(valueBottomRight));
		let dotBottomLeft = bottomLeft.dot(this.getConstantVector(valueBottomLeft));
		
		let u = this.fade(xf);
		let v = this.fade(yf);
		
		return this.lerp(u,
			this.lerp(v, dotBottomLeft, dotTopLeft),
			this.lerp(v, dotBottomRight, dotTopRight)
		);
	}

}

export class Fractal {
	constructor(noise, octaves, frequency, amplitude, persistence) {
		this.noise = noise;
		this.frequency = frequency;
		this.octaves = octaves;
		this.amplitude = amplitude;
		this.persistence = persistence;
	}

	// adapted from https://github.com/ssell/noisegen/blob/master/scripts/noise.js
	get(x, y) {
		let result = 0.0;

		let curFreq = this.frequency;
		let curAmp = this.amplitude;
		let maxAmp= 0.0;
		
		for(let i = 0; i < this.octaves; i++) {
				result += curAmp * this.noise.get(x * curFreq, y * curFreq);
		
				curFreq *= 2.0;
				maxAmp += curAmp;
				curAmp *= this.persistence;
		}
		
		return result / maxAmp;
	}
}