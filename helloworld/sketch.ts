let geode: p5.Image;

function preload() {
  geode = loadImage("./assets/geode.png");
}

function setup() {
  createCanvas(800, 800);
  stroke(50);
  strokeWeight(5);
  rectMode(RADIUS)
  noFill();
}

function draw() {
  background(200);
  translate(400, 400);
  image(geode, -geode.width/2, -geode.height/2);
  ellipse(20, 20, 40, 40);
}
