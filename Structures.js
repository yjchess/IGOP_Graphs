import { alloy_per_worker, getCumulativeAlloy, Change_Cumulative_Values} from './variables.js';
import { CalculateWorkers, CalculatePattern } from './Calculations.js';
import { worker_build_time, nodes, BUILDINGVARIABLES, UNITVARIABLES} from "./variables.js";
import { bases, ethers, staticD, armyStructures, upgradeStructures, allStructures } from './variables.js';


//testing purposes
import { values2 } from './variables.js';

export const [GROVEHEART, ETHER_MAW, ALTAR, MURDER_HOLLOW, NEUROCYTE, RED_VALE, AMBER_WOMB, BONE_CANOPY, DEEPNEST, GODHEART, AEROVORE, OMNIVORE, GUARDIAN] 
= ["GroveHeart","Ether Maw", "Altar Of The Worthy", "Murder Hollow", "Neurocyte","Red Vale", "Amber Womb", "Bone Canopy", "Deepnest", "GodHeart", "Aerovore", "Omnivore", "Guardian Of The Grove"];

export const[SYMBIOTE, BONESTALKER, UNDERSPINE, XACAL, ICHOR, REDSEER, WWR, WRAITHBOW, RESINANT, AAROX, THRUM, BEHEMOTH]
=["Symbiote","Bone Stalker", "Underspine", "Xacal", "Ichor", "Red Seer", "White Wood Reaper", "Wraith Bow", "Resinant", "Aarox", "Thrum", "Behemoth"]

export function createAllStructuresHash(faction){
    let tempHash = new Map();
    if(faction === "Aru"){
        tempHash.set(GROVEHEART,0);
        tempHash.set(ETHER_MAW,0);
        tempHash.set(ALTAR,0);
        tempHash.set(NEUROCYTE,0);
        tempHash.set(MURDER_HOLLOW,0);
        tempHash.set(RED_VALE,0);
        tempHash.set(AMBER_WOMB,0);
        tempHash.set(BONE_CANOPY,0);
        tempHash.set(DEEPNEST,0);
        tempHash.set(GODHEART,0);
        tempHash.set(AEROVORE,0);
        tempHash.set(OMNIVORE,0);
        tempHash.set(GUARDIAN,0);
    }
    return(tempHash)
}

export function addStructureToHash(structureName){
    allStructures.set(structureName, (allStructures.get(structureName) + 1));
}


class Structures{
    constructor(name, alloy_cost, build_time, ether_cost, time_started, unlocked_time, immortal){
        this.name = name;
        this.alloy_cost = alloy_cost;
        this.ether_cost = ether_cost;
        this.build_time = build_time;
        this.time_started = time_started;
        this.unlocked_time = unlocked_time; //Time building becomes unlocked
        this.immortal = immortal; //Array of immortals that can build this building

    }

    cancel_possibility(time){
        if(time < time_started + build_time){
            return(true);
        }
        else{
            return(false);
        }
    }

    cancel_alloy_amount(){
        return(Math.trunc((this.alloy_cost*3)/4));
    }

    cancel_ether_amount(){        
        return(Math.trunc((this.ether_cost*3)/4));
    }

    build_self(time){ //simple takes the alloy cost away from the cumulative graph

        if(this.time_started != -100 && this.built ==false && time == this.time_started) { //-100 seconds is the time for the first base to be created

            Change_Cumulative_Values(this.time_started, - this.alloy_cost);
            allStructures.set(this.name, allStructures.get(this.name)+1);
            this.built = true;
        }

        if(this.time_started === -100){
            allStructures.set(this.name, allStructures.get(this.name)+1);
        }
    }

    destroyed(){

    }
}

class UpgradeStructure extends Structures{
    constructor(name, alloy_cost, build_time, ether_cost, time_started, unlocked_time, immortal){
        super(name, alloy_cost, build_time, ether_cost, time_started, unlocked_time, immortal);
        
        this.finished = time_started + this.build_time;        
        this.built = false;  
    }
}

class ArmyStructure extends Structures{
    constructor(name, alloy_cost, build_time, ether_cost, time_started, unlocked_time, immortal){
        super(name, alloy_cost, build_time, ether_cost, time_started, unlocked_time, immortal);
        
        this.finished = time_started + this.build_time;        
        this.built = false;  
    }

    build_army(){

    }
}

class StaticDefense extends Structures{
    constructor(name, alloy_cost, build_time, ether_cost, time_started, unlocked_time, immortal){
        super(name, alloy_cost, build_time, ether_cost, time_started, unlocked_time, immortal);
        
        this.finished = time_started + this.build_time;        
        this.built = false;  
    }
}

class EtherStructure extends Structures{
    constructor(name, alloy_cost, build_time, ether_cost, time_started, unlocked_time, immortal){
        super(name, alloy_cost, build_time, ether_cost, time_started, unlocked_time, immortal);
        
        this.finished = time_started + this.build_time;        
        this.built = false;  
    }

}

export class Base extends Structures{
    constructor(name, alloy_cost, build_time, ether_cost, time_started, unlocked_time, immortal, workers, level){
        super(name, alloy_cost, build_time, ether_cost, time_started, unlocked_time, immortal);
        this.base_alloy = 8000;
        this.workers = workers;
        this.level = level;
        this.time_started = time_started;
        this.finished = time_started + this.build_time;
        this.nodes = nodes; //Total Nodes (not just nodes unlocked)
        this.long_workers = CalculateWorkers(this.level, this.workers)[0];
        this.short_workers = CalculateWorkers(this.level, this.workers)[1];
        
        this.paused = []; //array of seconds paused
        this.worker_progress = 0; //progress of a building worker
        this.built = false;  
    }

    alloy(time) {
        if(this.base_alloy >0 && time !=0){
            this.long_workers = CalculateWorkers(this.level, this.workers)[0];
            this.short_workers = CalculateWorkers(this.level, this.workers)[1];
            let pattern = CalculatePattern(this.long_workers, this.short_workers); //calculate every second as this may change
            //note time - 1 is used as arrays start at 0
            this.base_alloy -= pattern[((time-1) -this.finished) % pattern.length];
            return(pattern[((time-1) -this.finished) % pattern.length]);
        }
        else{
            return(0);
        }

    }

    build_workers(time){
        if(this.paused.includes(time) == false && this.workers < this.level*this.nodes && getCumulativeAlloy(time)>(alloy_per_worker/worker_build_time) && this.finished <time){
            
            if (this.worker_progress != worker_build_time){ //when the worker has been built for 18 seconds, the base pops out a worker and may build a new worker
                this.worker_progress += 1;

                
                Change_Cumulative_Values( time, - (alloy_per_worker/worker_build_time));
                if(this.worker_progress == worker_build_time){
                    this.workers += 1;

                }
            }
            else{
                this.worker_progress = 0;
            }
        }

    }

    pause_workers(start_time, end_time){
        
    }

    upgrade_base_level(time){

    }

    upgrade_base_structure(time){

    }

    
}

export function newGroveHeart(time_started, workers, level){

    bases.push(new Base( GROVEHEART, 400, 100, 0, time_started, 0, 'Xol', workers, level));
    
}

export function newEtherMaw(time_started){

    ethers.push(new EtherStructure("Ether Maw", 100, 30, 0, time_started, 0, 'Xol'));
    
}


export function newAltarOfTheWorthy(time_started){

    armyStructures.push(new ArmyStructure("Altar of the Worthy", 250, 38, 0, time_started, 0, 'Xol'));
    
}

export function newAmberWomb(time_started){

    armyStructures.push(new ArmyStructure("Amber Womb", 250, 42, 80, time_started, 0, 'Xol'));
    
}

export function check_unlocked_aru_structures(){ //This function is called to check the unlocked structures for all Aru immortals
    let unlocked = [GROVEHEART]
    
    if(allStructures.get(GROVEHEART) > 0 || allStructures.get(GODHEART) > 0){unlocked.push(ALTAR, ETHER_MAW);}
    if(allStructures.get(ALTAR) > 0){unlocked.push(NEUROCYTE, MURDER_HOLLOW, GODHEART);}
    if(allStructures.get(GODHEART) > 0){unlocked.push(AMBER_WOMB, BONE_CANOPY);}
    if(allStructures.get(GODHEART) > 0 &&  allStructures.get(ALTAR) > 0){unlocked.push(RED_VALE);}
    if(allStructures.get(BONE_CANOPY) > 0){unlocked.push(DEEPNEST);}

    unlocked.push(AEROVORE, OMNIVORE);
    return (unlocked);

}

export function check_unlocked_units(){ //This function is called to check the unlocked structures for all Aru immortals
    let unlocked = [];

        UNITVARIABLES.forEach(unit => {
            let tech = unit.techTree;
            if (tech.require === null){unlocked.push(unit.name);}
            else {
                let unitReq = true;
                tech.require.forEach(requirement => {if(allStructures.get(requirement) <=0){unitReq = false;}});
                if(unitReq === true){unlocked.push(unit.name);}
    
                else if(tech.requireAlt!==null){
                    tech.requireAlt.forEach(requirement => {if(allStructures.get(requirement) <=0){unitReq = false;}});
                    if(buildReq === true){unlocked.push(building.name);}
                }
            }
        });

    return (unlocked);
}

// export function check_unlocked_structures(){ //This function is called to check the unlocked structures for all Aru immortals
//     let unlocked = [];
//     BUILDINGVARIABLES.forEach(building => {
//         let tech = building.techTree;
//         if (tech.require === null){unlocked.push(building.name);}

//         else {
//             let buildReq = true;
//             tech.require.forEach(requirement => {if(allStructures.get(requirement) <=0){buildReq = false;}});
//             if(buildReq === true){unlocked.push(building.name);}

//             else if(tech.requireAlt!==null){
//                 tech.requireAlt.forEach(requirement => {if(allStructures.get(requirement) <=0){buildReq = false;}});
//                 if(buildReq === true){unlocked.push(building.name);}
//             }
//         }
//     });

//     return (unlocked);
// }

export function check_unlocked(type){
    let unlocked = [];
    let variables = [];
    if(type ==="unit"){variables = UNITVARIABLES}else{variables = BUILDINGVARIABLES}
    variables.forEach(action => {
        let tech = action.techTree;
        if (tech.require === null){unlocked.push(action.name);}
        

        else {
            let actionReq = true;
            tech.require.forEach(requirement => {if(allStructures.get(requirement) <=0){actionReq = false;}});
            if(actionReq === true){unlocked.push(action.name);}

            else if(tech.requireAlt!==null){
                tech.requireAlt.forEach(requirement => {if(allStructures.get(requirement) <=0){actionReq = false;}});
                if(actionReq === true){unlocked.push(action.name);}
            }
        }
    });

    return (unlocked);
}

export function check_unlocked_xol(){
    let unlocked = check_unlocked_structures();

    //check if the user has more than 0 of the following buildings
    let altar = allStructures.get(ALTAR) > 0;               
    let neurocyte = allStructures.get(NEUROCYTE) > 0;
    let murder_hollow = allStructures.get(MURDER_HOLLOW) >0;
    let red_vale = allStructures.get(RED_VALE) > 0;

    let amber_womb = allStructures.get(AMBER_WOMB) > 0;
    let godheart = allStructures.get(GODHEART) > 0;

    let bone_canopy = allStructures.get(BONE_CANOPY) > 0;
    let deepnest = allStructures.get(DEEPNEST) >0;


    //Altar of the Worthy Units: If the building exists, add the unlocked units to the array 
    if(altar){unlocked.push("Bone Stalkers");}
    if(altar && neurocyte){unlocked.push("Xacal","Underspine");}
    if(altar && murder_hollow){unlocked.push("Ichor");}
    if(altar && red_vale){unlocked.push("White Wood Reapers");}
    if(altar &&  neurocyte && red_vale){unlocked.push("Red Seer");}

    //Amber Womb Units
    if(amber_womb && godheart){unlocked.push("Wraith Bow");}
    if(amber_womb && godheart && neurocyte){unlocked.push("Resinant");}

    //Bone Canopy Units
    if(bone_canopy){unlocked.push("Thrums");}
    if(bone_canopy && neurocyte){unlocked.push("Aarox");}
    if(bone_canopy && neurocyte && deepnest){unlocked.push("Behemoth");}

    return (unlocked);
}


export function modelBuildings(){
    newGroveHeart(-100,8,2);
    // newGroveHeart(22,0,2);
}
  