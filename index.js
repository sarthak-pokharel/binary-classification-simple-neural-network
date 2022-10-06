
/** @returns {Node} */
let $ = (x) => document.querySelector(x);
let $$ = (x) => document.querySelectorAll(x);
let {log} = console;

/** @type {Vector} */
let canvasDim;
let entities = [];
let mode = 'red'; // red/blue/test
let RED = "#700", BLUE = "#007";

function mouseClicked(){
    let p = new Vector(mouseX, mouseY);
    if(mode=="red"){
        entities.push( Entity.createNew(p.x,p.y, RED) ) ;
    }else if(mode=="blue") {
        entities.push( Entity.createNew(p.x,p.y, BLUE) ) ;
    }
    if(mode=="test"){
        let outp = net.run(normalizeInput(new Vector(mouseX, mouseY)));
        console.log(outp[0])
        entities.push( Entity.createNew(mouseX, mouseY, outp[0]<=0.5?RED:BLUE) )
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
    
    for(let entity of entities){
        entity.draw();
    }

}
/** @type {brain.NeuralNetwork} */
let net;
function Main(){
    $("#train").addEventListener('click', train);
    $("#cred").addEventListener('click', ()=>{
        mode = 'red';
    });
    $("#cblue").addEventListener('click', ()=>{
        mode = 'blue';
    });
    $("#test").addEventListener('click', ()=>{
        mode = 'test';
    });
    net = new brain.NeuralNetwork();
}
function normalizeInput(pos){
    return [pos.x/height, pos.y/height]
}
function normalizeOutput(color){
    return [color==RED?0:1]
}

function train(){
    console.log(entities)
    let trainable_data = [...entities];
    trainable_data = trainable_data.map(dat=>({
        input: normalizeInput(dat.position),
        output: normalizeOutput(dat.color)
    }));
    console.log(trainable_data);
    console.log("training neurons");
    console.log(net.train(trainable_data));
    console.log("training complete");

}