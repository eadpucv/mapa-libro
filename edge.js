class Edge {
    constructor(nodeA, nodeB, edgeArray) {
        this.selected = false;
        this.nodeA = nodeA;
        this.nodeB = nodeB;
        
        // agrega este elemento al arreglo correspondiente
        edgeArray.push(this);
        this.uncreated = true; // todavía no se construye el objeto físico...
    }

    createLink(options) {
        if (this.uncreated) {
            // create new spring
            this.e = Constraint.create(options);
            World.add(world, this.e);
            //print("connecting "+this.nodeA.title+" - "+history.nodeB.title);
            this.uncreated = false;
        }
    }

    createLink() {
        let options = {
            label: "edge",
            length: random(80, 120),
            stiffness: 0.01,
            bodyA: this.nodeA.body,
            bodyB: this.nodeB.body
        }

        if (this.uncreated) {
            // create new spring
            this.e = Constraint.create(options);
            World.add(world, this.e);
            //print("connecting "+this.nodeA.title+" - "+history.nodeB.title);
            this.uncreated = false;
        }
    }
    
    display() {
        if (this.selected) {
            stroke(0, 150);
            strokeWeight(1);
        } else {
            stroke(0, 90);
            strokeWeight(.5);
        }
        strokeCap(SQUARE);
        line(this.nodeA.body.position.x, this.nodeA.body.position.y, this.nodeB.body.position.x, this.nodeB.body.position.y);
    }
}

function createAllEdgesBetween(objectArray, edgeArray) {
    for (let i = 0; i < objectArray.length; i++) {
        for (let j = 0; j < i; j++) {
            // create Edge object
            let e = new Edge(objectArray[i], objectArray[j], edgeArray);
            e.createLink();
        }
    }
}

function creatEdgeBetween(a, b, edgeArray) {
    let e = new Edge(a, b);
    edgeArray.push(e);
}

function drawEdges(edgeArray) {
    for (e of edgeArray) {
        e.display();
    }
}