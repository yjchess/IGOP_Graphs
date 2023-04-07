import { Graph_Values} from './graphCalculations.js';
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
Graph_Values(graph_length);

async function get_var(type){
    const test_var = await fetch(`http://localhost:3000/api/${type}`,{method:"GET"});
    const json = await test_var.json();
    return(json);
}

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

export const UNITVARIABLES = await get_var("units")
export const BUILDINGVARIABLES = await get_var("buildings")