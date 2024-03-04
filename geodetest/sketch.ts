let geode: p5.Image;

import "../lib/ColorHelper"

function preload() {
  geode = loadImage("./assets/geode.png");
  ColorHelper.getColorsArray(5)
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
  // image(geode, -geode.width/2, -geode.height/2);
  ellipse(0, 0, 40, 40);
}
