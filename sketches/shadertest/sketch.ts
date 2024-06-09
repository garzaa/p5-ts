// a shader variable
let theShader: p5.Shader;
let img: p5.Image;

function preload(){
  // load the shader
  theShader = loadShader('../sketches/shadertest/basic.vert', '../sketches/shadertest/basic.frag');
  img = loadImage("../assets/canvas.png");
}

function setup() {
  // disables scaling for retina screens which can create inconsistent scaling between displays
  pixelDensity(2);
  
  // shaders require WEBGL mode to work
  createCanvas(800, 800, WEBGL);
  noStroke();
}

function draw() {  
  // send resolution of sketch into shader
	theShader.setUniform('u_resolution', [800, 800]);
  
  // FIRST STEP: set a texture and try distorting it with the noise
  // ok distortion works but looks like shit. distort the actual lines for now
  // and then just add noise or other image effects later on
  theShader.setUniform("tex0", img);

  // shader() sets the active shader with our shader
  shader(theShader);

  // rect gives us some geometry on the screen
  translate(-400, -400);
  rect(0,0,width, height);
}
