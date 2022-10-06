/**
 *  Mapa del Libro - Gran Pantalla de 768 x 512 pixeles
 * 
 *  Seminario Internacional Formación y Oficio en Arquitectura y Diseño
 *                                                                 2022
 *  ~ hspencer 
 */

// Canvas P5
let mapa;

// Datos desde la Wiki
let capsData, obsData;
let capsBO, capsEO, capsIC // capítulos separados por eje

// Objetos
let caps = [];
let obs = [];

// vínculos o "resortes" entre elementos del grafo

let primaryEdges = []; // vínculos entre capítulos del mismo eje 
let annotationEdges = []; // vínculos definidos por observaciones 

let current; // elemento actual, seleccionado u "over"

// tipografías
let serif, sans, sansBold;

// variables gráficas

let edgeWeight = 17;
let edgeColor = "#00000005";
let chapterSize = 17;

// Aliases para Matter.js
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
    // tipografías
    serif = loadFont("../fonts/Alegreya-Regular.ttf");
    sans = loadFont("../fonts/AlegreyaSans-Light.ttf");
    sansBold = loadFont("../fonts/AlegreyaSans-Bold.ttf");

    // consulta por los capítulos
    let url1 = "https://wiki.ead.pucv.cl/api.php?action=ask&format=json&query=%5B%5BCategor%C3%ADa%3APublicaci%C3%B3n%5D%5D%5B%5BRevista%3A%3ASeminario%20Internacional%20Formaci%C3%B3n%20y%20Oficio%20en%20Arquitectura%20y%20Dise%C3%B1o%5D%5D%20%7C%3F%20Autor%20%7C%3F%20Nota%20%7C%3F%20Palabras%20Clave&utf8=1&formatversion=latest";
    capsData = loadJSON(url1, gotData, 'jsonp');

    capsBO = [];
    capsEO = [];
    capsIC = [];

    // consulta por las observaciones que vinculan las publicaciones1
    let url2 = "https://wiki.ead.pucv.cl/api.php?action=ask&format=json&query=%5B%5BCategor%C3%ADa%3AObservaci%C3%B3n%5D%5D%5B%5BPalabras%20Clave%3A%3Asfo%5D%5D%20%7C%3F%20Autor%20%7C%3F%20Nota%20%7C%3F%20P%C3%A1ginas%20Relacionadas&utf8=1&formatversion=latest";
    obsData = loadJSON(url2, gotData, 'jsonp');
}

function gotData(response) {
    print("gotData!");
}

function buildChapters() {
    // build main array 'caps'
    for (let key in capsData.query.results) {
        let thisResult = capsData.query.results[key];
        let title = thisResult.fulltext;
        // print("construyendo: " + title);
        let o = new Chapter(thisResult);

        let x;
        
        switch (o.note) {
            case 'Escuela como obra':
                o.colOriginal = color(200, 72, 0, 230);
                o.col = color(200, 72, 0, 230);
                o.colo = color(201, 62, 8);
                x = width *.333 + random(-1, 1);
                break;
            case 'Investigación y creación':
                o.colOriginal = color(94, 87, 87, 230);
                o.col = color(94, 87, 87, 230);
                o.colo = color(28, 15, 15);
                x = width *.5 + random(-1, 1);
                break;
            case 'Bordes del oficio':
                o.colOriginal = color(242, 239, 230);
                o.col = color(242, 239, 230);
                o.colo = color(214, 211, 203)
                x = width *.666 + random(-1, 1);
        }

        let options = {
            friction: 0.5,
            frictionAir: 0.9,
            frictionStatic: 0.9,
            restitution: 0.9,
            sleepThreshold: 60,
            mass: 10
        };

        o.createBody(x, height * .5 + random(-1, 1), options);

        caps.push(o);
    }
    // build secondary arrays
    for (let c of caps) {
        // print(c.title);
        switch (c.note) {
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


var elem;

function setup() {
    //let w = document.getElementById("p5").offsetWidth;
    mapa = createCanvas(768, 512);
    mapa.parent('p5js');

    mapa.id('fs');
    elem = document.getElementById('fs');
    
    mapa.class('flex-item');
    engine = Engine.create();
    world = engine.world;
    engine.world.gravity.y = 0;
    createConstraints();
    buildChapters();
    createAllEdgesBetween(capsIC, primaryEdges);
    createAllEdgesBetween(capsBO, primaryEdges);
    createAllEdgesBetween(capsEO, primaryEdges);
    buildAnnotations();

    let btn = createButton('full screen');
    btn.position(0, 0);
    btn.mousePressed(openFullscreen);
}

/*
function windowResized() {
    caps = [];
    obs = [];
    primaryEdges = [];
    annotationEdges = [];
    capsBO = [];
    capsEO = [];
    capsIC = [];
    setup();
}
*/

function draw() {
    Engine.update(engine);
    background(255);
    drawEdges(primaryEdges);
    drawEdges(annotationEdges);
    drawChapters();
    drawAnnotations();
    drawMouseConstraint();
}

function createConstraints() {
    /// mouse
    let canvasmouse = Mouse.create(mapa.elt);
    canvasmouse.pixelRatio = pixelDensity();
    let options = {
        mouse: canvasmouse,
        angularStiffness: 0.999,
        stiffness: 0.999,
        length: 0.01
    };
    mConstraint = MouseConstraint.create(engine, options);
    // no captura el scroll, como lo hace de forma predereminada
    mConstraint.mouse.element.removeEventListener("mousewheel", mConstraint.mouse.mousewheel);
    mConstraint.mouse.element.removeEventListener("DOMMouseScroll", mConstraint.mouse.mousewheel);
    World.add(world, mConstraint);

    // muros perimetrales
    let thickness = 500; // limits
    boundaries.push(new Boundary(width / 2, 0 - thickness / 2, width * 2, thickness, 0)); // top
    boundaries.push(new Boundary(width / 2, height + thickness / 2, width * 2, thickness, 0)); // bottom
    boundaries.push(new Boundary(-thickness / 2, height / 2, thickness, height * 15, 0)); // sides - left
    boundaries.push(new Boundary(width + thickness / 2, height / 2, thickness, height * 15, 0)); // sides - right
}


function doubleClicked() {
    window.open(current.url, '_blank');
}

let tapTime;

function touchStarted() {
    tapTime = new Date().getTime();
}

function touchEnded() {
    let now = new Date().getTime();
    let timePassed = now - tapTime;
    if (timePassed > 0 && timePassed < 300) {
        window.open(current.url, '_blank');
    }
}

function keyTyped() {
    if (key === 's') {
        saveCanvas(mapa, 'mapa-seminario', 'png');
    }
}

function drawMouseConstraint() {
    if (mConstraint.body) {
        let pos = mConstraint.body.position;
        let offset = mConstraint.constraint.pointB;
        let m = mConstraint.mouse.position;

        // dibuja mientras arrastra
        strokeWeight(0.5);
        stroke(0, 30);
        line(pos.x + offset.x, pos.y + offset.y, m.x, m.y);
    }

    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
        mConstraint.constraint.bodyB = null;
    }
}

function openFullscreen() {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
  }