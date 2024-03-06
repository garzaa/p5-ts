// a shader variable
let theShader: p5.Shader;

function preload(){
  // load the shader
  theShader = loadShader('../assets/shaders/basic.vert', '../assets/shaders/basic.frag');
}

function setup() {
  // disables scaling for retina screens which can create inconsistent scaling between displays
  pixelDensity(1);
  
  // shaders require WEBGL mode to work
  createCanvas(800, 800, WEBGL);
  noStroke();
}

function draw() {  
  // send resolution of sketch into shader
	theShader.setUniform('u_resolution', [800, 800]);

  // shader() sets the active shader with our shader
  shader(theShader);

  // rect gives us some geometry on the screen
  translate(-400, -400);
  rect(0,0,width, height);
}
