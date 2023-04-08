var path = require('path');

const {techTree, costs, base, ether, barracks, factory, starport, upgrade, defense, texts, fileRef, stats, post_processing, bastion } = require(".\\generation_functions.cjs");
const {beautify_JSON_Obj_Arr, createFile} = require("./json_file_functions.cjs") 

const [GROVEHEART, ETHER_MAW, ALTAR, MURDER_HOLLOW, NEUROCYTE, RED_VALE, AMBER_WOMB, BONE_CANOPY, DEEPNEST, GODHEART, AEROVORE, OMNIVORE, GUARDIAN, BASTION] 
= ["GroveHeart","Ether Maw", "Altar Of The Worthy", "Murder Hollow", "Neurocyte","Red Vale", "Amber Womb", "Bone Canopy", "Deepnest", "GodHeart", "Aerovore", "Omnivore", "Guardian Of The Grove", "Bastion"];

const [SYMBIOTE, BONESTALKER, UNDERSPINE, XACAL, ICHOR, REDSEER, WWR, WRAITHBOW, RESINANT, AAROX, THRUM, BEHEMOTH]
=["Symbiote","Bone Stalker", "Underspine", "Xacal", "Ichor", "Red Seer", "White Wood Reaper", "Wraith Bow", "Resinant", "Aarox", "Thrum", "Behemoth"]


const BUILDINGNAMES ={
    GROVEHEART:   "GroveHeart",
    ETHER_MAW:    "Ether Maw", 
    ALTAR:        "Altar Of The Worthy", 
    MURDER_HOLLOW:"Murder Hollow", 
    NEUROCYTE:    "Neurocyte", 
    RED_VALE:     "Red Vale", 
    AMBER_WOMB:   "Amber Womb", 
    BONE_CANOPY:  "Bone Canopy", 
    DEEPNEST:     "Deepnest", 
    GODHEART:     "GodHeart", 
    AEROVORE:     "Aerovore", 
    OMNIVORE:     "Omnivore", 
    GUARDIAN:     "Guardian Of The Grove", 
    BASTION:      "Bastion",
}
const UNTINAMES = {
    SYMBIOTE:   "Symbiote", 
    BONESTALKER:"Bone Stalker", 
    UNDERSPINE: "Underspine", 
    XACAL:      "Xacal", 
    ICHOR:      "Ichor", 
    REDSEER:    "Red Seer", 
    WWR:        "White Wood Reaper", 
    WRAITHBOW:  "Wraith Bow", 
    RESINANT:   "Resinant", 
    AAROX:      "Aarox", 
    THRUM:      "Thrum", 
    BEHEMOTH:   "Behemoth",
}

const UNITVARIABLES = [
    {name:SYMBIOTE,   immortal:["Xol","Mala"],techTree:techTree([GROVEHEART],[GODHEART]),                 costs: costs(50, 0, 18, 0),  stats:stats(75, 15, "LIGHT", 400),   damage:defense(["00","00","00"],[8, 40, 1.25]) },
    {name:BONESTALKER,immortal:["Xol"]       ,techTree:techTree([ALTAR],null),                            costs: costs(50, 0, 16, 2),  stats:stats(85, 10, "LIGHT", 380),   damage:defense([11,11,10, 400, 1.02],[11,11,10, 400, 1.02])},
    {name:XACAL,      immortal:["Xol","Mala"],techTree:techTree([ALTAR, NEUROCYTE],null),                 costs: costs(80, 30, 20, 3), stats:stats(160, 70, "MEDIUM", 370), damage:defense(["00","00","00"], [18,23,28,400,-1.786]) },
    {name:UNDERSPINE, immortal:["Xol"]       ,techTree:techTree([ALTAR, NEUROCYTE],null,),                costs: costs(70, 50, 20, 3), stats:stats(140, 40, "MEDIUM", 350), damage:defense([9,600,-1.253], [9,600,-1.253],[9,700,1.4]) },
    {name:ICHOR,      immortal:["Xol","Mala"],techTree:techTree([ALTAR, MURDER_HOLLOW],null),             costs: costs(80, 0, 24, 3),  stats:stats(80, 50, "MEDIUM", 424),  damage:defense(["00","00","00"], [22,18,14]) },
    {name:WWR,        immortal:["Xol","Mala"],techTree:techTree([ALTAR, RED_VALE],null),                  costs: costs(80, 30, 20, 3), stats:stats(160, 70, "MEDIUM"), damage:defense(["00","00","00"], ["00","00","00"]) },
    {name:REDSEER,    immortal:["Xol"]       ,techTree:techTree([ALTAR, NEUROCYTE, RED_VALE],null),       costs: costs(80, 30, 20, 3), stats:stats(160, 70, "MEDIUM"), damage:defense(["00","00","00"], ["00","00","00"]) },
    {name:WRAITHBOW,  immortal:["Xol","Mala"],techTree:techTree([AMBER_WOMB, GODHEART],null),             costs: costs(80, 30, 20, 3), stats:stats(160, 70, "MEDIUM"), damage:defense(["00","00","00"], ["00","00","00"]) },
    {name:RESINANT,   immortal:["Xol","Mala"],techTree:techTree([AMBER_WOMB, GODHEART, NEUROCYTE],null),  costs: costs(80, 30, 20, 3), stats:stats(160, 70, "MEDIUM"), damage:defense(["00","00","00"], ["00","00","00"]) },
    {name:AAROX,      immortal:["Xol","Mala"],techTree:techTree([BONE_CANOPY],null),                      costs: costs(80, 30, 20, 3), stats:stats(160, 70, "MEDIUM"), damage:defense(["00","00","00"], ["00","00","00"]) },
    {name:THRUM,      immortal:["Xol","Mala"],techTree:techTree([BONE_CANOPY, NEUROCYTE],null),           costs: costs(80, 30, 20, 3), stats:stats(160, 70, "MEDIUM"), damage:defense(["00","00","00"], ["00","00","00"]) },
    {name:BEHEMOTH,   immortal:["Xol","Mala"],techTree:techTree([BONE_CANOPY, NEUROCYTE, DEEPNEST],null), costs: costs(80, 30, 20, 3), stats:stats(160, 70, "MEDIUM"), damage:defense(["00","00","00"], ["00","00","00"]) },
];


const BUILDINGVARIABLES = [
    {name:GROVEHEART,    faction: "Aru", techTree:techTree(null,null),                type: "base",     costs: costs(400, 0, 100),  stats:stats(2000, 400), files:undefined, texts:undefined, Base:base(1,4,1,8000)},
    {name:GODHEART,      faction: "Aru", techTree:techTree([GROVEHEART, ALTAR],null), type: "base",     costs: costs(100, 75, 60),  stats:stats(2200, 500), files:undefined, texts:undefined, Base:base(1,4,1,8000)},
    {name:ETHER_MAW,     faction: "Aru", techTree:techTree([GROVEHEART],[GODHEART]),  type: "ether",    costs: costs(100, 0, 30),   stats:stats(400, 100),  files:undefined, texts:undefined, Ether:ether(2000,5,3)},
    {name:ALTAR,         faction: "Aru", techTree:techTree([GROVEHEART],[GODHEART]),  type: "barracks", costs: costs(250, 0, 30),   stats:stats(900, 300),  files:undefined, texts:undefined, Barracks:barracks(8,16)},
    {name:AMBER_WOMB,    faction: "Aru", techTree:techTree([GODHEART],null),          type: "factory",  costs: costs(250, 80, 42),  stats:stats(950, 300),  files:undefined, texts:undefined, Factory:factory(8,16)},
    {name:BONE_CANOPY,   faction: "Aru", techTree:techTree([GODHEART],null),          type: "starport", costs: costs(250, 80, 42),  stats:stats(950, 300),  files:undefined, texts:undefined, Starport:starport(8,16)},
    {name:MURDER_HOLLOW, faction: "Aru", techTree:techTree([ALTAR],null),             type: "upgrade",  costs: costs(100, 50, 25),  stats:stats(750, 200),  files:undefined, texts:undefined, Upgrade:upgrade(2, ["ichor"])},
    {name:NEUROCYTE,     faction: "Aru", techTree:techTree([ALTAR],null),             type: "upgrade",  costs: costs(100, 75, 30),  stats:stats(650, 150),  files:undefined, texts:undefined, Upgrade:upgrade(3, ["underspine","xacal"])},
    {name:RED_VALE,      faction: "Aru", techTree:techTree([GODHEART, ALTAR],null),   type: "upgrade",  costs: costs(100, 100, 60), stats:stats(800, 200),  files:undefined, texts:undefined, Upgrade:upgrade(2, ["Red Seer","WWR"])},
    {name:DEEPNEST,      faction: "Aru", techTree:techTree([BONE_CANOPY],null),       type: "upgrade",  costs: costs(175, 150, 70), stats:stats(850, 200),  files:undefined, texts:undefined, Upgrade:upgrade(1, ["Behemoth"])},
    {name:AEROVORE,      faction: "Aru", techTree:techTree(null,null),                type: "defense",  costs: costs(100, 0, 18),   stats:stats(300, 50),   files:undefined, texts:undefined, Defense:defense([24, 700, 1.639], ["00", "00", "00"] )},
    {name:OMNIVORE,      faction: "Aru", techTree:techTree(null,null),                type: "defense",  costs: costs(100, 0, 18),   stats:stats(400, 50),   files:undefined, texts:undefined, Defense:defense([24, 700, 1.639], [12, 14, 16, 700, 2.439])},
    {name:GUARDIAN,      faction: "Aru", techTree:techTree(null,null),                type: "defense",  costs: costs(100, 0, 18),   stats:stats(1200, 200), files:undefined, texts:undefined, Defense:defense([24, 39, 24, 700, 1.639], [12, 14, 16, 700, 2.439])},
    {name:BASTION,       faction: "Aru", techTree:techTree(null,null),                type: "bastion",  costs: costs(100, 0, 18),   stats:stats(1200, 200), files:undefined, texts:undefined, Bastion:bastion(20, 3, 900)},
];

//Some properties reference other properties in the object and thus are initialized with null before being changed.
//These include: techTree.unlocks and techTree.unlockCombo as well as: fileRef and texts.
post_processing(BUILDINGVARIABLES);


// Code Regarding File Creation Starts here
let building_variable_content = beautify_JSON_Obj_Arr(BUILDINGVARIABLES)
let building_name_content = JSON.stringify(BUILDINGNAMES, null, 2)

let user_variable_content = beautify_JSON_Obj_Arr(UNITVARIABLES)
let unit_name_content = JSON.stringify(UNTINAMES, null, 2)

createFile("BUILDINGVARIABLES", building_variable_content);
createFile("UNITVARIABLES", user_variable_content);

createFile("BUILDINGNAMES", building_name_content);
createFile("UNITNAMES", unit_name_content);

