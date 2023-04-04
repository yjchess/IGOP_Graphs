import { Graph_Values} from './Calculations.js';
import { modelBuildings, createAllStructuresHash, REDSEER, WWR, WRAITHBOW } from './Structures.js';
import { Base, GROVEHEART, ETHER_MAW, ALTAR, MURDER_HOLLOW, NEUROCYTE, RED_VALE, AMBER_WOMB, BONE_CANOPY, DEEPNEST, GODHEART, AEROVORE, OMNIVORE, GUARDIAN} from './Structures.js';
import {SYMBIOTE, BONESTALKER, UNDERSPINE, XACAL, ICHOR, RESINANT, AAROX, THRUM, BEHEMOTH} from './Structures.js';

//Set Variables and values
export let starting_alloy = 150;
export let nodes = 4;
export let other_workers = 0; //afk, building etc.
export let alloy_per_trip = 5;
export let time_per_long_trip = 6; // 2 workers per patch
export let time_per_short_trip = 4; // 1 worker per patch
export let bastion_state = true;

export let bastion_amount = 20;
export let bastion_time = 3;
export let bastion_timeout = 900; //15 minutes


export let alloy_per_worker = 50;
export let worker_build_time = 18;

//graphing variables
export let graph_length = 1230;


//Structure arrays
export let bases = [];
export let ethers = [];
export let staticD = [];
export let armyStructures = [];
export let upgradeStructures = [];
export let allStructures = createAllStructuresHash("Aru"); // ex of data if immortal is xol: allStructures["Altar of the Worthy"] = 0;
export let unlocked = [];

// let WaitForElement = ()=>{if (typeof values !== "undefined"){ console.log(values); }else{setTimeout(callee(),250)}};
// WaitForElement();
export let values= Array(graph_length).fill(null).map(x => Array(3).fill(0));
export let values2= Array(graph_length).fill(null).map(x => Array(3).fill(0));
export let cumulative=0;

modelBuildings();
Graph_Values();



export function setValues(newValue){
    values =newValue;
}

export function setValues2(newValue){
    values2 =newValue;

}

export function getCumulativeAlloy(time){
    
    // console.log(values2[time][1]);
    return(values2[time][1]);
}

export function Change_Cumulative_Values(time, amount){

    values2[time][1] += amount;
    values2[time][2] += amount;
}



function techTree(require, requireAlt){
    return ({require: require, requireAlt: requireAlt, unlocks:[], unlockCombo:[]})
}

function costs(alloy, ether, time){
    return {alloy: alloy, ether: ether, time: time}
}




function base(workers, workerMax, level, alloy){
    return {workers:workers, workerInitMax:workerMax, level:level, alloyInitAmount:alloy};
}

function ether(amount, gain, increment){
    return {initAmount:amount, gain:gain, increment:increment};
}

var barracks, factory, starport;
barracks = factory = starport = function(maxProduction, supplyIncrease){
    return {maxProduction:maxProduction, supplyIncrease:supplyIncrease}
}

function upgrade(initial_Upgrade_Total, Unit_Unlocks){
    return{initUpTotal:initial_Upgrade_Total, unitUnlocks:Unit_Unlocks}
}

function defense(air, ground){

    // If the length of either array is 3 - the damage to light/medium/heavy = first element.
    if(air.length === 3){air.unshift(air[0]); air.unshift(air[0]);};
    if(ground.length === 3){ground.unshift(ground[0]); ground.unshift(ground[0]);};

    return {airLightDPS:       air[0],  airMediumDPS:       air[1],  airHeavyDPS:       air[2],  airDmgRange:       air[3], airDmgCD:       air[4],
            groundLightDPS: ground[0],  groundMediumDPS: ground[1],  groundHeavyDPS: ground[2],  groundDmgRange: ground[3], groundDmgCD: ground[4]};
}


function texts(object){
    let description = "";

    // Reduce object.type.property to obj.property i.e. object.base.worker becomes obj.worker
    let obj = object[object.type.toString()];

    //define any array or else unitUnlocks.join will crash the program
    if(obj.unitUnlocks === undefined){obj.unitUnlocks = [];}

    let startTexts={
        base: (obj.workers + "/" + obj.workerInitMax + " workers, level " + obj.level + ", " + obj.alloyInitAmount + " Alloy"),
        ether: (obj.initAmount + " ether, + " + obj.gain + " every " + obj.increment + " seconds" ),
        barracks:("0/" + obj.maxProduction + " supply producing +" + obj.supplyIncrease + " supply"),
        factory:("0/" + obj.maxProduction + " supply producing +" + obj.supplyIncrease + " supply"),
        starport:("0/" + obj.maxProduction + " supply producing +" + obj.supplyIncrease + " supply"),
        defense:("air/ground:" + obj.airLightDPS + "/" + obj.airMediumDPS + "/" + obj.airHeavyDPS + " " + obj.groundLightDPS + "/" + obj.groundMediumDPS + "/" + obj.groundHeavyDPS +"dps"),
        upgrade:("0/"+obj.initUpTotal + " up unlock: "+ (obj.unitUnlocks.join(", ")))
    };    

    return ({startText: startTexts[object.type.toString()], description:description});
}

function fileRef(object){
    
    let imgName = object.name.replace(/\s/g,'');

    let icons ={base:"Worker", ether:"Ether", alloy:"Alloy",barracks:"Sword", factory:"siege", starport:"Wings", defense:"Shield", upgrade:"Book"};
    let iconName =icons[object.type];

    return {img: "images/aru/structures/"+imgName+".png", icon:"images/action_icons/"+iconName+".svg"};
}

function stats(health, shield){
    return {health: health, shields: shield, armour:"Heavy"};
}

export const UNITVARIABLES = [
    {name:SYMBIOTE,   techTree:techTree([GROVEHEART],[GODHEART]),                 costs: costs(50, 0, 18, 0),  stats:stats(75, 15, "LIGHT", 400),   damage:defense(["00","00","00"],[8, 40, 1.25]) },
    {name:BONESTALKER,techTree:techTree([ALTAR],null),                            costs: costs(50, 0, 16, 2),  stats:stats(85, 10, "LIGHT", 380),   damage:defense([11,11,10, 400, 1.02],[11,11,10, 400, 1.02])},
    {name:XACAL,      techTree:techTree([ALTAR, NEUROCYTE],null),                 costs: costs(80, 30, 20, 3), stats:stats(160, 70, "MEDIUM", 370), damage:defense(["00","00","00"], [18,23,28,400,-1.786]) },
    {name:UNDERSPINE, techTree:techTree([ALTAR, NEUROCYTE],null,),                costs: costs(70, 50, 20, 3), stats:stats(140, 40, "MEDIUM", 350), damage:defense([9,600,-1.253], [9,600,-1.253],[9,700,1.4]) },
    {name:ICHOR,      techTree:techTree([ALTAR, MURDER_HOLLOW],null),             costs: costs(80, 0, 24, 3),  stats:stats(80, 50, "MEDIUM", 424),  damage:defense(["00","00","00"], [22,18,14]) },
    {name:WWR,        techTree:techTree([ALTAR, RED_VALE],null),                  costs: costs(80, 30, 20, 3), stats:stats(160, 70, "MEDIUM"), damage:defense(["00","00","00"], ["00","00","00"]) },
    {name:REDSEER,    techTree:techTree([ALTAR, NEUROCYTE, RED_VALE],null),       costs: costs(80, 30, 20, 3), stats:stats(160, 70, "MEDIUM"), damage:defense(["00","00","00"], ["00","00","00"]) },
    {name:WRAITHBOW,  techTree:techTree([AMBER_WOMB, GODHEART],null),             costs: costs(80, 30, 20, 3), stats:stats(160, 70, "MEDIUM"), damage:defense(["00","00","00"], ["00","00","00"]) },
    {name:RESINANT,   techTree:techTree([AMBER_WOMB, GODHEART, NEUROCYTE],null),  costs: costs(80, 30, 20, 3), stats:stats(160, 70, "MEDIUM"), damage:defense(["00","00","00"], ["00","00","00"]) },
    {name:AAROX,      techTree:techTree([BONE_CANOPY],null),                      costs: costs(80, 30, 20, 3), stats:stats(160, 70, "MEDIUM"), damage:defense(["00","00","00"], ["00","00","00"]) },
    {name:THRUM,      techTree:techTree([BONE_CANOPY, NEUROCYTE],null),           costs: costs(80, 30, 20, 3), stats:stats(160, 70, "MEDIUM"), damage:defense(["00","00","00"], ["00","00","00"]) },
    {name:BEHEMOTH,   techTree:techTree([BONE_CANOPY, NEUROCYTE, DEEPNEST],null), costs: costs(80, 30, 20, 3), stats:stats(160, 70, "MEDIUM"), damage:defense(["00","00","00"], ["00","00","00"]) },
];


export const BUILDINGVARIABLES = [
    {name:GROVEHEART,    techTree:techTree(null,null),                type: "base",     costs: costs(400, 0, 100),  stats:stats(2000, 400), files:null, texts:null, startText:"1/4 workers, level1, 8000 Alloy", base:base(1,4,1,8000)},
    {name:ETHER_MAW,     techTree:techTree([GROVEHEART],[GODHEART]),  type: "ether",    costs: costs(100, 0, 30),   stats:stats(400, 100),  files:null, texts:null, startText:"2000 ether, + 5 every 3 seconds", ether:ether(2000,5,3)},
    {name:ALTAR,         techTree:techTree([GROVEHEART],[GODHEART]),  type: "barracks", costs: costs(250, 0, 30),   stats:stats(900, 300),  files:null, texts:null, startText:"0/8 supply producing +16 supply", barracks:barracks(8,16)},
    {name:MURDER_HOLLOW, techTree:techTree([ALTAR],null),             type: "upgrade",  costs: costs(100, 50, 25),  stats:stats(750, 200),  files:null, texts:null, startText:"0/1 upgrade, unlocks ichor unit", upgrade:upgrade(2, ["ichor"])},
    {name:NEUROCYTE,     techTree:techTree([ALTAR],null),             type: "upgrade",  costs: costs(100, 75, 30),  stats:stats(650, 150),  files:null, texts:null, startText:"0/3 up unlock:underspine, xacal", upgrade:upgrade(3, ["underspine","xacal"])},
    {name:RED_VALE,      techTree:techTree([GODHEART, ALTAR],null),   type: "upgrade",  costs: costs(100, 100, 60), stats:stats(800, 200),  files:null, texts:null, startText:"0/2 up. unlocks: red seer + WWR", upgrade:upgrade(2, ["Red Seer","WWR"])},
    {name:AMBER_WOMB,    techTree:techTree([GODHEART],null),          type: "factory",  costs: costs(250, 80, 42),  stats:stats(950, 300),  files:null, texts:null, startText:"0/8 supply producing +16 supply", factory:factory(8,16)},
    {name:BONE_CANOPY,   techTree:techTree([GODHEART],null),          type: "starport", costs: costs(250, 80, 42),  stats:stats(950, 300),  files:null, texts:null, startText:"0/8 supply producing +16 supply", starport:starport(8,16)},
    {name:DEEPNEST,      techTree:techTree([BONE_CANOPY],null),       type: "upgrade",  costs: costs(175, 150, 70), stats:stats(850, 200),  files:null, texts:null, startText:"0/1 upgrade, unlocks: Behemoths", upgrade:upgrade(1, ["Behemoth"])},
    {name:GODHEART,      techTree:techTree([GROVEHEART, ALTAR],null), type: "base",     costs: costs(100, 75, 60),  stats:stats(2200, 500), files:null, texts:null, startText:"8/8 workers, level2, 8000 Alloy", base:base(1,4,1,8000)},
    {name:AEROVORE,      techTree:techTree(null,null),                type: "defense",  costs: costs(100, 0, 18),   stats:stats(300, 50),   files:null, texts:null, startText:"Attack enemy Air Unit for 39dps", defense:defense([24, 700, 1.639], ["00", "00", "00"] )},
    {name:OMNIVORE,      techTree:techTree(null,null),                type: "defense",  costs: costs(100, 0, 18),   stats:stats(400, 50),   files:null, texts:null, startText:"air/ground:39/39/39 29/34/39dps", defense:defense([24, 700, 1.639], [12, 14, 16, 700, 2.439])},
    {name:GUARDIAN,      techTree:techTree(null,null),                type: "defense",  costs: costs(100, 0, 18),   stats:stats(1200, 200), files:null, texts:null, startText:"Attacks: Air, 15dps",defense:defense([24, 39, 24, 700, 1.639], [12, 14, 16, 700, 2.439])},
];

BUILDINGVARIABLES.forEach(building =>{
    let reqArr=building.techTree.require;
    let reqAltArr=building.techTree.requireAlt;
    if(reqArr !==null){
        if(reqArr.length ===1){BUILDINGVARIABLES.forEach(option => {if(option.name === reqArr[0]){option.techTree.unlocks.push( building.name);};});}
        else if (reqArr.length > 1){BUILDINGVARIABLES.forEach(option => {reqArr.forEach(requirement =>{if(option.name === requirement){option.techTree.unlockCombo.push([reqArr,building.name])}})})};
    }

    if(reqAltArr !==null){
        if(reqAltArr.length ===1){BUILDINGVARIABLES.forEach(option => {if(option.name === reqAltArr[0]){option.techTree.unlocks.push( building.name);};});}
        else if (reqAltArr.length > 1){BUILDINGVARIABLES.forEach(option => {reqAltArr.forEach(requirement =>{if(option.name === requirement){option.techTree.unlockCombo.push([reqAltArr,building.name])}})})};
    }

});


BUILDINGVARIABLES.forEach(building =>{
    building.files = fileRef(building);
    building.texts = texts(building);  
});