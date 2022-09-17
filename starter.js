/**
 *  Mapa de figuras
 *  Seminario Internacional Formación y Oficio en Arquitectura y Diseño
 *                                                                 2022
 *  ~ hspencer 
 */



let data; // objeto con datos desde la wiki
let caps; // arreglo de objetos "capítulos"
let viz; // objeto canvas p5


let userData, annotations;

let capsBO, capsEO, capsIC // capítulos separados por eje

let edges = []; // edges connecting chapters
let edgesCount = 0;
let current;
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

function preload() {
  // consulta por las publicaciones del seminario
  let url = "https://wiki.ead.pucv.cl/api.php?action=ask&format=json&query=%5B%5BCategor%C3%ADa%3APublicaci%C3%B3n%5D%5D%5B%5BRevista%3A%3ASeminario%20Internacional%20Formaci%C3%B3n%20y%20Oficio%20en%20Arquitectura%20y%20Dise%C3%B1o%5D%5D%7C%3FAutor%7C%3FNota%7C%3FPalabras%20Clave&utf8=1";
  caps = [];
  annotations = [];
  capsBO = [];
  capsEO = [];
  capsIC = [];
  data = loadJSON(url, gotData, 'jsonp');
  serif = loadFont("fonts/Alegreya-Regular.ttf");
  sans = loadFont("fonts/AlegreyaSans-Light.ttf");
  sansBold = loadFont("fonts/AlegreyaSans-Bold.ttf");
  // consulta por las observaciones que vinculan las publicaciones
  let url2 = "https://wiki.ead.pucv.cl/api.php?action=ask&format=json&query=%5B%5BCategor%C3%ADa%3Asfo%5D%5D%7C%3FNota%7C%3FAutor%7C%3FP%C3%A1ginas%20Relacionadas&utf8=1&formatversion=1";
  userData = loadJSON(url2, gotData, 'jsonp');
}


function gotData(response) {
  print("gotData!\n"+response+"\n\n");
}

function buildChapters() {
  // build main array 'caps'
  for (let key in data.query.results) {
    let thisResult = data.query.results[key];
    let title = thisResult.fulltext;
    print("construyendo: " + title);
    let o = new Node(thisResult);
    caps.push(o);
  }
  // build secondary arrays
  for (let c of caps) {
    // print(c.title);
    switch (c.cat) {
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

function buildAnnotations() {
  // build main array 'annotations'
  for (let key in userData.query.results) {
    let nota = userData.query.results[key];
    let title = nota.fulltext;
    print("Nota: " + title);
    let o = new Annotation(nota);
    annotations.push(o);
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
  buildChapters();

  print("se contectaron los capítulos por eje, total = " + edges.length + " conexiones en total");
  shuffle(edges, true);
}

function draw() {
  Engine.update(engine);
  clear();
  drawEdges();
  drawNodes();
  drawAnnotations();

  if (mConstraint.body) {
    let pos = mConstraint.body.position;
    let offset = mConstraint.constraint.pointB;
    let m = mConstraint.mouse.position;

    // paint line while dragging object
    strokeWeight(1);
    stroke(200);
    line(pos.x + offset.x, pos.y + offset.y, m.x, m.y);
  }

  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    mConstraint.constraint.bodyB = null;
  }

  // create links of primary edges
  if (edgesCount < edges.length && frameCount > 100) {
    let options = {
        label: "edge",
        length: random(80, 120),
        bodyA: edges[edgesCount].nodeA.body,
        bodyB: edges[edgesCount].nodeB.body,
        stiffness: 0.01
    }
    edges[edgesCount].createLink(options);
    edgesCount++;
  }
}

function displayDetails(c) {
  textFont(serif);
  textSize(48);
  noStroke();
  textAlign(LEFT, TOP);
  textWrap(WORD);
  fill(80, 120);
  rectMode(CORNER);
  text(c.title, 0, 30, width, height);

  textAlign(CENTER);
  textSize(12);
  text("doble click para ver", width / 2, height - 18);

  fill(255, 72, 0, 150);
  textFont(sansBold);
  textSize(16);
  textAlign(LEFT);
  let authorOffset = 1;
  for (let i = 0; i < c.author.length; i++) {
    text(c.author[i].toUpperCase(), authorOffset, 20);
    authorOffset += textWidth(c.author[i].toUpperCase()) + 30;
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
  // limits
  let thickness = 500;
  // top
  boundaries.push(new Boundary(width / 2, 0 - thickness / 2, width * 2, thickness, 0));
  // bottom
  boundaries.push(new Boundary(width / 2, height + thickness / 2, width * 2, thickness, 0));
  // sides
  boundaries.push(new Boundary(-thickness / 2, height / 2, thickness, height * 15, 0));
  boundaries.push(new Boundary(width + thickness / 2, height / 2, thickness, height * 15, 0));
}

function doubleClicked() {
  window.open(current.url, '_blank');
}


function keyTyped(){

  if(key === '1'){
    createAllEdges(capsIC);

  }
  if(key === '2'){
    createAllEdges(capsBO);
  }
  if(key === '3'){
    createAllEdges(capsEO); 
  }
  if(key === 'n'){
    buildAnnotations();
  }
}