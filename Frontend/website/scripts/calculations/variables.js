console.log("I am variables.js")
import * as initUtils from './utils/variableInitUtils.js'
// import { Graph_Values} from './graphCalculations.js';

export const [GROVEHEART, ETHER_MAW, ALTAR, MURDER_HOLLOW, NEUROCYTE, RED_VALE, AMBER_WOMB, BONE_CANOPY, DEEPNEST, GODHEART, AEROVORE, OMNIVORE, GUARDIAN] 
= ["GroveHeart","Ether Maw", "Altar Of The Worthy", "Murder Hollow", "Neurocyte","Red Vale", "Amber Womb", "Bone Canopy", "Deepnest", "GodHeart", "Aerovore", "Omnivore", "Guardian Of The Grove"];

export const[SYMBIOTE, BONESTALKER, UNDERSPINE, XACAL, ICHOR, REDSEER, WWR, WRAITHBOW, RESINANT, AAROX, THRUM, BEHEMOTH]
=["Symbiote","Bone Stalker", "Underspine", "Xacal", "Ichor", "Red Seer", "White Wood Reaper", "Wraith Bow", "Resinant", "Aarox", "Thrum", "Behemoth"]

//Set Variables and values
export const CONSTANTS={
    alloyPerWorker: 50,
    workerBuildTime: 18,
    starting_alloy: 150,
    nodes: 4,
    alloyPerTrip: 5,
    timePerLongTrip: 6,
    timePerShortTrip: 4,
}

//graphing variables
export let graph_length = 1230;


//Structure arrays
export let buildings = [];
export let bastion = [];
export let bases = [];
export let ethers = [];
export let staticD = [];
export let armyStructures = [];
export let upgradeStructures = [];
export let allStructures = initUtils.createAllStructuresHash("Aru"); // ex of data if immortal is xol: allStructures["Altar of the Worthy"] = 0;
export let unlocked = [];

// let WaitForElement = ()=>{if (typeof values !== "undefined"){ console.log(values); }else{setTimeout(callee(),250)}};
// WaitForElement();
export let values= Array(graph_length).fill(null).map(x => Array(3).fill(0));
export let values2= Array(graph_length).fill(null).map(x => Array(3).fill(0));

export let UNITVARIABLES = await initUtils.get_var("units")
export let BUILDINGVARIABLES = await initUtils.get_var("buildings")


export function setGraphValues(new_values, new_values2){
    console.log(new_values)
    values = new_values;
    values2 = new_values2;
}