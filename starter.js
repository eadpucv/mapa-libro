/**
 *  Mapa de figuras
 *  Seminario Internacional Formación y Oficio en Arquitectura y Diseño
 *                                                                 2022
 *  ~ hspencer 
 */



let data; // objeto con datos desde la wiki
let caps; // arreglo de objetos "capítulos"
let viz; // objeto canvas p5

// typefaces
let serif, sans, sansBold;

// matter aliases : thanks Dan Shiffman and CodingTrain, Nature of Code, etc...
var Engine = Matter.Engine,
	World = Matter.World,
	Bodies = Matter.Bodies,
	Constraint = Matter.Constraint,
	Mouse = Matter.Mouse,
	MouseConstraint = Matter.MouseConstraint;

// matter.js main components
let engine;
let world;
let boundaries = [];

let vert = 0;

function preload(){
  let url = "https://wiki.ead.pucv.cl/api.php?action=ask&format=json&query=%5B%5BCategor%C3%ADa%3APublicaci%C3%B3n%5D%5D%5B%5BRevista%3A%3ASeminario%20Internacional%20Formaci%C3%B3n%20y%20Oficio%20en%20Arquitectura%20y%20Dise%C3%B1o%5D%5D%7C%3FAutor%7C%3FNota%7C%3FPalabras%20Clave&utf8=1";
  caps = [];
  data = loadJSON(url, gotData, 'jsonp');
  serif = loadFont("fonts/Alegreya-Regular.ttf");
	sans = loadFont("fonts/AlegreyaSans-Light.ttf");
	sansBold = loadFont("fonts/AlegreyaSans-Bold.ttf");
}

function gotData(response) {
  print("gotData");
}


function buildObjects(response) {
   for (let key in data.query.results){
     let thisResult = data.query.results[key];

     let title = thisResult.fulltext;
     print("Building: "+title);
     let o = new Node(thisResult);
     caps.push(o);
   }
}


function setup() {
  //let w = document.getElementById("p5").offsetWidth;
  viz = createCanvas(windowWidth, windowHeight);
  viz.parent('p5js');
  
  engine = Engine.create();
	world = engine.world;
	engine.world.gravity.y = 0.2;
  buildObjects();
  createConstraints();

  rectMode(CENTER);
  textAlign(CENTER, BOTTOM);
}

function draw() {
  Engine.update(engine);
  clear();
 
  for(c of caps){
    c.render();
  }

  text(caps.length, 20, 20);
}


class Node{
  constructor(o){
    this.title = o.fulltext;
    this.url = o.fullurl;
    this.author = [];
    for(let i = 0; i < o.printouts.Autor.length; i++){
      this.author.push(o.printouts.Autor[i].fulltext);
    }
   
    textFont(sansBold, 14);
    this.m = 10; // margin
    this.w = textWidth(this.title) + 2 * this.m;
    this.h = textAscent() + textDescent() + 1 * this.m;
    let options = {
      friction: 0.4,
      restitution: 0.77,
      mass: 50
    };
    this.body = Bodies.rectangle(100 + this.w/2, vert, this.w, this.h, options);
    World.add(world, this.body);
    vert -= 100;
  }
  
  render(){
    this.angle = this.body.angle;
    let pos = this.body.position;
    this.x = pos.x;
    this.y = pos.y;
    push();
    translate(pos.x, pos.y);
    rotate(this.angle);
    stroke(255, 190);
    fill(0, 40);
    rect(0, 0, this.w, this.h, 3);
    fill(0);
    text(this.title, 0, textAscent()*0.7);
    pop();
    
  }
}

function mousePressed(){

}

function createConstraints() {
	/// mouse
	let canvasmouse = Mouse.create(viz.elt);
	canvasmouse.pixelRatio = pixelDensity();
	let options = {
		mouse: canvasmouse,
		angularStiffness: 0.999,
		stiffness: 0.999,
		length: 0.01
	};

	mConstraint = MouseConstraint.create(engine, options);
	World.add(world, mConstraint);

	/// limits
	let thickness = 500;
	// top
	//boundaries.push(new Boundary(width / 2, 0 - thickness / 2, width*2, thickness, 0));

	// bottom
	boundaries.push(new Boundary(width / 2, height + thickness / 2, width*2, thickness, 0));

	// sides
	boundaries.push(new Boundary(-thickness / 2, height / 2, thickness, height * 15, 0));
	boundaries.push(new Boundary(width + thickness / 2, height / 2, thickness, height * 15, 0));
}