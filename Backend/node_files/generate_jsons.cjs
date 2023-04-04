var path = require('path');
// const {GROVEHEART, ETHER_MAW, ALTAR, MURDER_HOLLOW, NEUROCYTE, RED_VALE, AMBER_WOMB, BONE_CANOPY, DEEPNEST, GODHEART, AEROVORE, OMNIVORE, GUARDIAN} =  require('../Structures.js');
// const {SYMBIOTE, BONESTALKER, UNDERSPINE, XACAL, ICHOR, RESINANT, AAROX, THRUM, BEHEMOTH} =  require('../Structures.js');

// import {GROVEHEART, ETHER_MAW, ALTAR, MURDER_HOLLOW, NEUROCYTE, RED_VALE, AMBER_WOMB, BONE_CANOPY, DEEPNEST, GODHEART, AEROVORE, OMNIVORE, GUARDIAN} from '../Structures.js';
// import {SYMBIOTE, BONESTALKER, UNDERSPINE, XACAL, ICHOR, RESINANT, AAROX, THRUM, BEHEMOTH} from '../Structures.js';

// import ('../Structures.js').then({GROVEHEART, ETHER_MAW, ALTAR, MURDER_HOLLOW, NEUROCYTE, RED_VALE, AMBER_WOMB, BONE_CANOPY, DEEPNEST, GODHEART, AEROVORE, OMNIVORE, GUARDIAN})
// import ('../Structures.js').then({SYMBIOTE, BONESTALKER, UNDERSPINE, XACAL, ICHOR, RESINANT, AAROX, THRUM, BEHEMOTH})

const {techTree, costs, base, ether, barracks, factory, starport, upgrade, defense, specific_properties, texts, fileRef, stats, beautify_JSON_Obj_Arr } = require(".\\generation_functions.cjs");


const [GROVEHEART, ETHER_MAW, ALTAR, MURDER_HOLLOW, NEUROCYTE, RED_VALE, AMBER_WOMB, BONE_CANOPY, DEEPNEST, GODHEART, AEROVORE, OMNIVORE, GUARDIAN, BASTION] 
= ["GroveHeart","Ether Maw", "Altar Of The Worthy", "Murder Hollow", "Neurocyte","Red Vale", "Amber Womb", "Bone Canopy", "Deepnest", "GodHeart", "Aerovore", "Omnivore", "Guardian Of The Grove", "Bastion"];

const [SYMBIOTE, BONESTALKER, UNDERSPINE, XACAL, ICHOR, REDSEER, WWR, WRAITHBOW, RESINANT, AAROX, THRUM, BEHEMOTH]
=["Symbiote","Bone Stalker", "Underspine", "Xacal", "Ichor", "Red Seer", "White Wood Reaper", "Wraith Bow", "Resinant", "Aarox", "Thrum", "Behemoth"]


const ARUBUILDINGS ={
    GROVEHEART:"GroveHeart",
    ETHER_MAW:"Ether Maw", 
    ALTAR: "Altar Of The Worthy", 
    MURDER_HOLLOW:"Murder Hollow", 
    NEUROCYTE:"Neurocyte", 
    RED_VALE:"Red Vale", 
    AMBER_WOMB: "Amber Womb", 
    BONE_CANOPY: "Bone Canopy", 
    DEEPNEST:"Deepnest", 
    GODHEART:"GodHeart", 
    AEROVORE:"Aerovore", 
    OMNIVORE:"Omnivore", 
    GUARDIAN:"Guardian Of The Grove", 
    BASTION:"Bastion",
}
const XOLUNITS = {
    SYMBIOTE:"Symbiote", 
    BONESTALKER:"Bone Stalker", 
    UNDERSPINE:"Underspine", 
    XACAL: "Xacal", 
    ICHOR:"Ichor", 
    REDSEER:"Red Seer", 
    WWR:"White Wood Reaper", 
    WRAITHBOW:"Wraith Bow", 
    RESINANT: "Resinant", 
    AAROX:"Aarox", 
    THRUM:"Thrum", 
    BEHEMOTH:"Behemoth",
}

const UNITVARIABLES = [
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


const BUILDINGVARIABLES = [
    {name:GROVEHEART,    techTree:techTree(null,null),                type: "base",     costs: costs(400, 0, 100),  stats:stats(2000, 400), files:null, texts:null, Base:base(1,4,1,8000)},
    {name:ETHER_MAW,     techTree:techTree([GROVEHEART],[GODHEART]),  type: "ether",    costs: costs(100, 0, 30),   stats:stats(400, 100),  files:null, texts:null, Ether:ether(2000,5,3)},
    {name:ALTAR,         techTree:techTree([GROVEHEART],[GODHEART]),  type: "barracks", costs: costs(250, 0, 30),   stats:stats(900, 300),  files:null, texts:null, Barracks:barracks(8,16)},
    {name:MURDER_HOLLOW, techTree:techTree([ALTAR],null),             type: "upgrade",  costs: costs(100, 50, 25),  stats:stats(750, 200),  files:null, texts:null, Upgrade:upgrade(2, ["ichor"])},
    {name:NEUROCYTE,     techTree:techTree([ALTAR],null),             type: "upgrade",  costs: costs(100, 75, 30),  stats:stats(650, 150),  files:null, texts:null, Upgrade:upgrade(3, ["underspine","xacal"])},
    {name:RED_VALE,      techTree:techTree([GODHEART, ALTAR],null),   type: "upgrade",  costs: costs(100, 100, 60), stats:stats(800, 200),  files:null, texts:null, Upgrade:upgrade(2, ["Red Seer","WWR"])},
    {name:AMBER_WOMB,    techTree:techTree([GODHEART],null),          type: "factory",  costs: costs(250, 80, 42),  stats:stats(950, 300),  files:null, texts:null, Factory:factory(8,16)},
    {name:BONE_CANOPY,   techTree:techTree([GODHEART],null),          type: "starport", costs: costs(250, 80, 42),  stats:stats(950, 300),  files:null, texts:null, Starport:starport(8,16)},
    {name:DEEPNEST,      techTree:techTree([BONE_CANOPY],null),       type: "upgrade",  costs: costs(175, 150, 70), stats:stats(850, 200),  files:null, texts:null, Upgrade:upgrade(1, ["Behemoth"])},
    {name:GODHEART,      techTree:techTree([GROVEHEART, ALTAR],null), type: "base",     costs: costs(100, 75, 60),  stats:stats(2200, 500), files:null, texts:null, Base:base(1,4,1,8000)},
    {name:AEROVORE,      techTree:techTree(null,null),                type: "defense",  costs: costs(100, 0, 18),   stats:stats(300, 50),   files:null, texts:null, Defense:defense([24, 700, 1.639], ["00", "00", "00"] )},
    {name:OMNIVORE,      techTree:techTree(null,null),                type: "defense",  costs: costs(100, 0, 18),   stats:stats(400, 50),   files:null, texts:null, Defense:defense([24, 700, 1.639], [12, 14, 16, 700, 2.439])},
    {name:GUARDIAN,      techTree:techTree(null,null),                type: "defense",  costs: costs(100, 0, 18),   stats:stats(1200, 200), files:null, texts:null, Defense:defense([24, 39, 24, 700, 1.639], [12, 14, 16, 700, 2.439])},
    {name:BASTION,      techTree:techTree(null,null),                type: "defense",  costs: costs(100, 0, 18),   stats:stats(1200, 200), files:null, texts:null, Defense:defense([24, 39, 24, 700, 1.639], [12, 14, 16, 700, 2.439])},
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
    if(building.techTree.unlocks.length === 0){ building.techTree.unlocks = null};
    if(building.techTree.unlockCombo.length === 0){ building.techTree.unlockCombo = null};  
});


// Code Regarding File Creation Starts here

// function beautify_JSON_Obj_Arr(array){
//     // let propertiesHash = newMap();
//     let modified = JSON.stringify(array).replaceAll("},{","},\n\t{");
//     modified = modified.slice(1,-1);
//     modified = "[\n\t" + modified + "\n]";

//     // let property_regex =/(\"(([a-z])+(([A-Z])*([a-z])+)*)+\":)/g;
//     let property_regex =/(\"\w+\":)/g; 
//     let all_properties = modified.match(property_regex);
//     let matching_properties = [];
//     const elementCounts = {};
//     all_properties.forEach(element => {
//         elementCounts[element] = (elementCounts[element] || 0) + 1;
//         if (elementCounts[element] === array.length){matching_properties.push(element)}
//     });

//     matching_properties.forEach(property =>{
//         let value_regex = new RegExp('('+property+')(.+?)(\\"\\w+\\":)',"g");
//         let longest = 0;
        
//         for(const match of modified.matchAll(value_regex)){if(match[2].length > longest){longest = match[2].length}}

//         for(const match of modified.matchAll(value_regex)){
//             let whitespaces = (longest-match[2].toString().length)+1;
//             let string_to_be_replaced = match[1] + match[2] + match[3];
//             let replacement_string = (match[1] + " ".repeat(whitespaces) + match[2] + " "+match[3]);
//             modified = modified.replace(string_to_be_replaced, replacement_string);
//         }
//     })
//     return (modified);
// }


var fs = require('fs');

function createFile(name, file){
    var fileContent = beautify_JSON_Obj_Arr(file);
    var filepath = "./Backend/json_files/"+name+".json";
    
    fs.writeFileSync(filepath, fileContent, (err) => {
        if (err) throw err;
    
        console.log("The "+name+" file was succesfully saved!");
    });    
}

createFile("BUILDINGVARIABLES", BUILDINGVARIABLES);
createFile("UNITVARIABLES", UNITVARIABLES);

// console.log("Reading File");

// let test_var = "";
// fs.readFileSync(process.cwd()+"/json_files/BUILDINGVARIABLES.json", (err,data)=>{
//     if(err){console.log(err);}
                
//     else{test_var =JSON.parse(data);};
//     console.log(test_var);
// });


// var variable = fs.readFileSync("./json_files/BUILDINGVARIABLES.json");
// variable = JSON.parse(variable);
// variable.forEach(element=>{
//     console.log(element.name);
// })





// var fileContent = beautify_JSON_Obj_Arr(BUILDINGVARIABLES);
// var filepath = "./json_files/BUILDINGVARIABLES.json";

// fs.writeFile(filepath, fileContent, (err) => {
//     if (err) throw err;

//     console.log("The file was succesfully saved!");
// }); 
