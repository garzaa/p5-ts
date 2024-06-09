precision mediump float;

// this is the same variable we declared in the vertex shader
// we need to declare it here too!
varying vec2 vTexCoord;

// then declare the 2d image
uniform sampler2D tex0;

// noise (or sometimes perlin noise or fractional brownian motion [fbm] ) is a way of making a smooth continuous random number
// there are many glsl noise functions to be found on the internet
// most of them contain a great deal of complex math. 
// the general idea is that you create a lot of random numbers and average them together
// it's not necessary to understand how they all work, as long as you can put them to use!
// one thing to keep in mind, noise functions can be slow. Be sure to pay attention to the performance of your shader!
// there's a nice collection of glsl noise functions here: https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

void main() {

  // copy the vTexCoord
  // vTexCoord is a value that goes from 0.0 - 1.0 depending on the pixels location
  // we can use it to access every pixel on the screen
  vec2 uv = vTexCoord;

  uv.x += sin(uv.y*10.0) * 0.5;

  vec4 tex = texture2D(tex0, uv);

  gl_FragColor = vec4(tex.r, tex.g, tex.b, 1.0 );
}
