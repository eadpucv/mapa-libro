/**
 *  Mapa de figuras
 *  Seminario Internacional Formación y Oficio en Arquitectura y Diseño
 *                                                                 2022
 *  ~ hspencer 
 */



let data; // objeto con datos desde la wiki
let caps; // arreglo de objetos "capítulos"
let viz; // objeto canvas p5

let capsBO, capsEO, capsIC // capítulos separados por eje

let edges = [];

// typefaces
let serif, sans, sansBold;

// matter aliases : thanks Dan Shiffman and CodingTrain, Nature of Code, etc...
var Engine = Matter.Engine,
	World = Matter.World,
	Bodies = Matter.Bodies,
	Constraint = Matter.Constraint,
	Mouse = Matter.Mouse,
  Query = Matter.Query,
	MouseConstraint = Matter.MouseConstraint;

// matter.js main components
let engine;
let world;
let boundaries = [];

function preload(){
  let url = "https://wiki.ead.pucv.cl/api.php?action=ask&format=json&query=%5B%5BCategor%C3%ADa%3APublicaci%C3%B3n%5D%5D%5B%5BRevista%3A%3ASeminario%20Internacional%20Formaci%C3%B3n%20y%20Oficio%20en%20Arquitectura%20y%20Dise%C3%B1o%5D%5D%7C%3FAutor%7C%3FNota%7C%3FPalabras%20Clave&utf8=1";
  caps = [];
  capsBO = [];
  capsEO = [];
  capsIC = [];
  data = loadJSON(url, gotData, 'jsonp');
  serif = loadFont("fonts/Alegreya-Regular.ttf");
	sans = loadFont("fonts/AlegreyaSans-Light.ttf");
	sansBold = loadFont("fonts/AlegreyaSans-Bold.ttf");
}

function gotData(response) {
  print("gotData");
}

function buildObjects(response) {
  // build main array 'caps'
  for (let key in data.query.results){
     let thisResult = data.query.results[key];
     let title = thisResult.fulltext;
     print("Building: "+title);
     let o = new Node(thisResult);
     caps.push(o);
   }
  // build secondary arrays
  for(let c of caps){
    // print(c.title);
    switch(c.cat){
      case 'Escuela como obra':
        capsEO.push(c);
        break;
      case 'Investigación y creación':
        capsIC.push(c);
        break;
      case 'Bordes del oficio':
        capsBO.push(c);
    }
  }
}

function setup() {
  //let w = document.getElementById("p5").offsetWidth;
  viz = createCanvas(windowWidth, windowHeight);
  viz.parent('p5js');
  
  engine = Engine.create();
	world = engine.world;
	engine.world.gravity.y = 0;
  
  createConstraints();
  buildObjects();
  connect(capsBO);
  connect(capsEO);
  connect(capsIC);
}

function draw() {
  Engine.update(engine);
  clear();
  drawEdges();
  for(c of caps){
    c.render();
    if (mConstraint.body === c.body || c.over) {
			displayDetails(c);
		}
  }
  if (mConstraint.body) {
		let pos = mConstraint.body.position;
		let offset = mConstraint.constraint.pointB;
		let m = mConstraint.mouse.position;

		// paint line while dragging object
		strokeWeight(2);
		stroke(200);
		line(pos.x + offset.x, pos.y + offset.y, m.x, m.y);
	}

	if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
		mConstraint.constraint.bodyB = null;
	}
}

function displayDetails(c) {
	textFont(serif);
	textSize(48);
	noStroke();
  textAlign(LEFT, TOP);
  textWrap(WORD);
	fill(80, 95);
  rectMode(CORNER);
	text(c.title, 0, 30, width, height);
  
  fill(150, 30, 0, 150);
	textFont(sansBold);
	textSize(16);
  let authorOffset = 1;
  for(let i = 0; i < c.author.length; i++){
    text(c.author[i].toUpperCase(), authorOffset, 20);
    authorOffset += textWidth(c.author[i].toUpperCase()) + 30;
  }
	
}

class Node{
  constructor(o){
    this.title = o.fulltext;
    this.url = o.fullurl;
    this.author = [];
    for(let i = 0; i < o.printouts.Autor.length; i++){
      this.author.push(o.printouts.Autor[i].fulltext);
    }
    this.cat = o.printouts.Nota[0];
    textFont(sansBold, 14);
    this.s = 17; // side
    this.over = false;
    let x;
    switch(this.cat){
      case 'Escuela como obra':
        this.col = color(211, 61, 61);
        this.colo = color(178, 35, 35);
        x = width * 3/4 + random(-1, 1);
        break;
      case 'Investigación y creación':
        this.col = color(94, 67, 67);
        this.colo = color(28, 15, 15);
        x = width / 4 + random(-1, 1);
        break;
      case 'Bordes del oficio':
        this.col = color(242, 239, 230);
        this.colo = color(214, 211, 203)
        x = width / 2 + random(-1, 1);
    }
    
    let options = {
      friction: 0.5,
      frictionAir: 1,
      frictionStatic: 0.9,
      restitution: 0.9,
      sleepThreshold: 60,
      mass: this.w/10
    };
    this.body = Bodies.rectangle(x, height/2 + random(-1, 1), this.s, this.s, options);
    World.add(world, this.body);
    this.over = false;
  }

  render(){
    this.angle = this.body.angle;
    let pos = this.body.position;
    this.x = pos.x;
    this.y = pos.y;
    if (dist(this.x, this.y, mouseX, mouseY) < this.s/2) {
      this.over = true;
  } else {
      this.over = false;
  }
    push();
    translate(pos.x, pos.y);
    rotate(this.angle);
    if(this.over){
      fill(this.colo);
    }else{
      fill(this.col);
    }
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.s, this.s, 2);
    pop();
  }
}

function connect(objectArray){
  for(let i = 0; i < objectArray.length; i++){
    for(let j = 0; j < i; j++){
      let options = {
        label: "spring",
        length: random(50, 200),
        bodyA: objectArray[i].body,
        bodyB: objectArray[j].body,
        stiffness: 0.01
      }
      // create new spring
      let edge = Constraint.create(options);
      World.add(world, edge);
      edges.push(edge);
      print("connecting "+objectArray[i].title+" - "+objectArray[j].title);
    }
  }
}

function drawEdges(){
 for(e of edges){
  strokeWeight(17);
  stroke(0, 30);
  line(e.bodyA.position.x, e.bodyA.position.y, e.bodyB.position.x, e.bodyB.position.y);
 }
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
	boundaries.push(new Boundary(width / 2, 0 - thickness / 2, width*2, thickness, 0));

	// bottom
	boundaries.push(new Boundary(width / 2, height + thickness / 2, width*2, thickness, 0));

	// sides
	boundaries.push(new Boundary(-thickness / 2, height / 2, thickness, height * 15, 0));
	boundaries.push(new Boundary(width + thickness / 2, height / 2, thickness, height * 15, 0));
}