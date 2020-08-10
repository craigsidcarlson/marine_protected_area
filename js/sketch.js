let width;
let height;
let env;
let canvas_boundary;

let top_edge_vector 
let bottom_edge_vector 
let left_edge_vector 
let right_edge_vector;
function setup() {
  width = windowWidth;
  height = windowHeight;

  createCanvas(width, height);
  top_edge_vector = createVector(0, 1);
  bottom_edge_vector = createVector(0, -1);
  left_edge_vector = createVector(1, 0);
  right_edge_vector = createVector(-1, 0);
  canvas_boundary = new Rectangle(width/2, height/2 , width/2, height/2);
  const qt = new QuadTree(canvas_boundary);
  env = new Environment(qt);

}

function draw() {
  background(44, 62, 80);
  env.draw();

  strokeWeight(0);
  textSize(12);
  fill(255);
  text(`${frameRate().toFixed(0)}`, width - 30, 30);
}

