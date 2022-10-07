/**
 * a annotation is a representation of an observation from Casiopea 
 * that connects 1 or more chapters
 * 
 */

class Annotation {
    constructor(o) {
        this.title = o.fulltext;
        this.url = o.fullurl;
        this.note = o.printouts.Nota[0];
        this.side = 15;
        this.over = false;
        this.myEdges = [];
        this.author = [];
        for (let i = 0; i < o.printouts.Autor.length; i++) {
          this.author.push(o.printouts.Autor[i].fulltext);
        }

        // crea el cuerpo físico de la observación
        let options = {
            friction: 0.5,
            frictionAir: 0.9,
            frictionStatic: 0.19,
            restitution: 0.9,
            sleepThreshold: 10,
            mass: this.w / 10
        };

        this.body = Bodies.circle(width / 2 + random(-2, 2), height / 2 + random(-2, 2), this.side, options);
        World.add(world, this.body);
        
        this.connectedNames = o.printouts["Páginas Relacionadas"];
        this.connected = [];

        for (let i = 0; i < this.connectedNames.length; i++) {
            let t = this.connectedNames[i].fulltext;
            for(let i = 0; i < caps.length; i++){
                if(caps[i].title === t){
                // print("iguales!!");
                this.connected.push(caps[i]);

                // crea el vértice con los capítulos conectados
                let e = new Edge(this, caps[i], annotationEdges);
                this.myEdges.push(e);
                
                let edgeOptions = {
                    label: "spring",
                    length: random(10, 20),
                    stiffness: 0.001,
                    bodyA: this.body,
                    bodyB: caps[i].body
                }

                // crea el vértice con opciones diferentes al arreglo principaln
                e.createLinkWith(edgeOptions);
                }
            }
        }
    }

    display() {
        let pos = this.body.position;
        this.x = pos.x;
        this.y = pos.y;
        if (dist(this.x, this.y, mouseX, mouseY) < this.side / 2) {
            this.over = true;
            for(let i = 0; i < this.myEdges.length; i++){
                this.myEdges[i].selected = true;
                // this.connected[i].col = color(0);
                push();
                translate(this.connected[i].x, this.connected[i].y);
                rotate(this.connected[i].angle);
                rectMode(CENTER);
                fill(0);
                rect(0, 0, this.connected[i].side, this.connected[i].side);
                pop();
            }
        } else {
            this.over = false;
            for(let i = 0; i < this.myEdges.length; i++){
                this.myEdges[i].selected = false;
                // this.connected[i].col = this.connected[i].colOriginal;
            }
        }
        push();
        translate(pos.x, pos.y);
        if (this.over) {
            stroke(0);
            strokeWeight(2);
            fill(0);
        } else {
            stroke(0, 90);
            strokeWeight(1);
            fill(255);
        }
        circle(0, 0, this.side);
        // 3 lines
        let l = this.side/4;
        let h = l*.7;
        line(-l, -h, l, -h);
        line(-l, 0, l, 0);
        line(-l, h, l, h);
        pop();
    }
}

function buildAnnotations() {
    // build main array 'obs'
    for (let key in obsData.query.results) {
        let result = obsData.query.results[key];
        let o = new Annotation(result);
        obs.push(o);
        print(result.fulltext);
    }
}

function drawAnnotations() {2
    for (n of obs) {
        n.display();
        if (mConstraint.body === n.body || n.over) {
            displayAnnotationDetails(n);
            current = n;
        }
    }
}

function displayAnnotationDetails(c) {
    noStroke();
    textFont(sans);
    textSize(18);
    textLeading(18);
    textAlign(LEFT, TOP);
    textWrap(WORD);
    fill(100);
    rectMode(CORNER);
    text(c.note, 0, 30, 320, height);
    textFont(serif);
    textAlign(CENTER);
    textSize(12);
    fill(90);
    text("click para ver", width / 2, height - 18);
    fill(50);
    textFont(sansBold);
    textSize(16);
    textAlign(LEFT);
    text(c.title.toUpperCase(), 0, 5);
}