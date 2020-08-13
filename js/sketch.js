let width;
let height;
let env;
let canvas_boundary;
let x, y;
let top_edge_vector 
let bottom_edge_vector 
let left_edge_vector 
let right_edge_vector;
let frame_rate;
let tuna_count_div, sardine_count_div;
let tuna_caught_div, sardine_caught_div;
function setup() {
  width = windowWidth < 400 ? windowWidth : windowWidth * 0.5;
  height = windowHeight < 400 ? windowHeight : windowHeight * 0.4;;
  x = (windowWidth - width) / 2;
  y = (windowHeight - height) / 2;
  const cnv = createCanvas(width, height);
  cnv.position(x, y);
  frameRate(30);
  top_edge_vector = createVector(0, 1);
  bottom_edge_vector = createVector(0, -1);
  left_edge_vector = createVector(1, 0);
  right_edge_vector = createVector(-1, 0);
  tuna_count_div = select('#tuna_count');
  sardine_count_div = select('#sardine_count');
  tuna_caught_div = select('#tuna_caught');
  sardine_caught_div = select('#sardine_caught');

  // Setup environment and quadtree
  canvas_boundary = new Rectangle(width/2, height/2 , width/2, height/2);
  const qt = new QuadTree(canvas_boundary);
  env = new Environment(qt);

}

function draw() {
  background(34, 52, 70);
  env.draw();
  strokeWeight(0);
  textSize(12);
  fill(255);
  if (frameCount % 10 === 0) frame_rate = frameRate().toFixed(0);
  text(`${frame_rate}`, width - 30, 30);
  if (frameCount % 10 === 0) {
    tuna_count_div.elt.firstChild.textContent = `Tuna: ${env.tuna_count}`;
    sardine_count_div.elt.firstChild.textContent = `Sardines: ${env.sardine_count}`;
    tuna_caught_div.elt.firstChild.textContent = `Tuna caught: ${env.tuna_caught}`;
    sardine_caught_div.elt.firstChild.textContent = `Sardines caught: ${env.sardines_caught}`;
  }
}

