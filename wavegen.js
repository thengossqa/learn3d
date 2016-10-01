/**
 * A simple wave generator that generates a sequence of 1-dimensional waves.
 * 
 * @example
 * // Create a generator instance
 * var gen = new WaveGenerator();
 * // Generate a wave
 * var wave = gen.next();
 * 
 * @class WaveGenerator
 * @constructor
 * @param {numbner} [resolution] The number of data points in each wave.
 * @param {number} [amplitude] The maximum height of the wave. Wave height
 * values will be between zero and the maximum amplitude.
 */
var WaveGenerator = (function(){


	// Constructor
	var WaveGenerator = function(resolution, amplitude){
		this.resolution = resolution || 100;
		this.amplitude = amplitude || 100;
		this.gen = genFn();
		this.t = 0;
	};


	// Random wave generator function
	var genFn = function(){
		var mask = 0xff;
		var size = mask + 1;
		var values = new Uint8Array(size * 2);
		for(var i = 0; i < size; i++){
			values[i] = values[size + i] = 0 | (Math.random() * 0xff);
		}
		var lerp = function(t, a, b){
			return a + t * (b - a);
		};
		var fade = function(t){
			return t * t * t * (t * (t * 6 - 15) + 10);
		};
		var grad2d = function(hash, x, y){
			var u = (hash & 2) === 0 ? x : -x;
			var v = (hash & 1) === 0 ? y : -y;
			return u + v;
		};
		return function(x, y){
			var intX = (0 | x) & mask;
			var intY = (0 | y) & mask;
			var fracX = x - (0 | x);
			var fracY = y - (0 | y);
			var r1 = values[intX] + intY;
			var r2 = values[intX + 1] + intY;
			var t1 = fade(fracX);
			var t2 = fade(fracY);

			var a1 = grad2d(values[r1], fracX, fracY);
			var b1 = grad2d(values[r2], fracX - 1, fracY);
			var a2 = grad2d(values[r1 + 1], fracX, fracY - 1);
			var b2 = grad2d(values[r2 + 1], fracX - 1, fracY - 1);
			return lerp(t2, lerp(t1, a1, b1), lerp(t1, a2, b2));
		};
	};


	/**
	 * Returns the next wave in the sequence.
	 * 
	 * @method next
	 * @return {Array<number>} 
	 */
	WaveGenerator.prototype.next = function(){
		this.t += 0.1;
		var data = [];
		for(var i = 0; i < this.resolution; i++){
			var v = this.gen(11 * i / this.resolution, this.t);
			data.push((1 - v) * this.amplitude / 2);
		}
		return data;
	};


	// Return constructor
	return WaveGenerator;

}());
