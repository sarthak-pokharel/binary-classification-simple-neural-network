
/** @returns {Node} */
let $ = (x) => document.querySelector(x);
let $$ = (x) => document.querySelectorAll(x);
let {log} = console;

/** @type {Vector} */
let canvasDim;
let tocalc_entries = [], TOCALC_ENTITY_RADIUS = 10;
let abstract_entries = []; let ABSTRACT_ENTITY_RADIUS = 4;
let mode = 'red'; // red/blue/test
let RED = "#700", BLUE = "#007";
let HIDDEN_LAYERS_CONF = [3];
let MAX_ITERATIONS = 400000;
let FULL_TEST_CHUNKS = 100;


function mouseClicked(e){
    if(!e.target.classList.contains('p5Canvas')) return;
    let p = new Vector(mouseX, mouseY);
    switch(mode){
        case "red":
            tocalc_entries.push( Entity.createNew(p.x,p.y, RED) ) ;
            break;
        case "blue":
            tocalc_entries.push( Entity.createNew(p.x,p.y, BLUE) ) ;
            break;
        case "test":
            showTestFor(mouseX, mouseY);
            break;
    }
}
function setup() {
    canvasDim = new Vector(windowWidth*0.95, windowHeight*0.95);
    let canv = createCanvas(...canvasDim);
    canv.parent("#canvascontainer");
    Main();
}
function draw() {
    background(220);
    
    for(let entity of [...tocalc_entries,...abstract_entries]){
        entity.draw();
    }

}
/** @type {brain.NeuralNetwork} */
let net;
function Main(){
    $("#train").addEventListener('click', train);
    $("#cred").addEventListener('click', ()=>{ mode = 'red'; });
    $("#cblue").addEventListener('click', ()=>{ mode = 'blue'; });
    $("#test").addEventListener('click', ()=>{ mode = 'test'; });
    $("#testfull").addEventListener('click', testFullCanvas);
    
    net = new brain.NeuralNetwork({
        hiddenLayers:[2]
    });
}
function normalizeInput(pos){
    return [pos.x/width, pos.y/height]
}
function normalizeOutput(color){
    return [color==RED?0:1]
}

function train(){

    net = new brain.NeuralNetwork({ //Normally initialization is done once but for variable config, this is being multilpe times
        hiddenLayers:HIDDEN_LAYERS_CONF,
        iterations: MAX_ITERATIONS
    });


    console.log(tocalc_entries)
    let trainable_data = [...tocalc_entries];
    trainable_data = trainable_data.map(dat=>({
        input: normalizeInput(dat.position),
        output: normalizeOutput(dat.color)
    }));
    console.log(trainable_data);
    console.log("training neurons");
    // alert("training neurons");
    console.log(net.train(trainable_data));
    // alert("training complete")
    console.log("training complete");

}

function showTestFor(x,y){
    let outp = net.run(normalizeInput(new Vector(x,y)));
    // console.log(outp[0]);
    let testEntry = Entity.createNew(x,y, outp[0]<=0.5?RED:BLUE);
    testEntry.radius = ABSTRACT_ENTITY_RADIUS;
    abstract_entries.push( testEntry );
}


function testFullCanvas(){
    let chunks = Number(FULL_TEST_CHUNKS); //divisions
    abstract_entries = [];
    for(let j = 0; j<=height; j+= height/chunks){
        for(let i = 0; i<=width; i+=width/chunks){
            // console.log("showT",i,j)
            showTestFor(i,j);
        }
    }
}

