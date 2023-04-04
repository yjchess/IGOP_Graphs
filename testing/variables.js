import { Graph_Values} from './functions.js';
import { modelBuildings } from './classes.js';
import { Base } from './classes.js';


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
export let graph_length = 100;


//Structure arrays
export let bases = [];

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
    console.log("Values2 after setValues2: ");
    console.log(values2);
}

export function getCumulativeAlloy(time){
    
    // console.log(values2[time][1]);
    return(values2[time][1]);
}

export function Change_Cumulative_Values(time, amount){

    values2[time][1] += amount;
    values2[time][2] += amount;
}