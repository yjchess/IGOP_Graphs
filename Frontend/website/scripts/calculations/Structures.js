console.log("I am Structures.js")
import { CONSTANTS as g} from './variables.js';
import { CalculateWorkers, CalculatePattern } from './Calculations.js';
import { bases, ethers, armyStructures, allStructures} from './variables.js';
import { Change_Cumulative_Values } from './utils/variableSetUtils.js';
import { getCumulativeAlloy, getUnitVariables, getBuildingVariables } from './utils/variableGetUtils.js';

import {GROVEHEART, ETHER_MAW, ALTAR, MURDER_HOLLOW, NEUROCYTE, RED_VALE, AMBER_WOMB, BONE_CANOPY, DEEPNEST, GODHEART, AEROVORE, OMNIVORE, GUARDIAN} from "./variables.js"
import { Graph_Values } from './graphCalculations.js';
//testing purposes

export function addStructureToHash(structureName){
    allStructures.set(structureName, (allStructures.get(structureName) + 1));
}
class Structures{
    constructor(name, time_started, unlocked_time, immortal){
        this.name = name;
        this.building = getBuildingVariables(name)
        this.alloy_cost = this.building.costs.alloy;
        this.ether_cost = this.building.costs.ether;
        this.build_time = this.building.costs.time;
        this.time_started = time_started;
        this.unlocked_time = unlocked_time; //Time building becomes unlocked
        this.immortal = immortal; //Array of immortals that can build this building
        allStructures.set(this.name, allStructures.get(this.name)+1);
        this.build_self(time_started)

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
            console.log("building self")
            Change_Cumulative_Values(this.time_started, - this.alloy_cost);
            allStructures.set(this.name, allStructures.get(this.name)+1);
            this.built = true;
        }

        if(this.time_started === -100){
            console.log("building self")
            allStructures.set(this.name, allStructures.get(this.name)+1);
        }
    }

    destroyed(){

    }
}

class Bastion extends Structures{
    constructor(name, time_started, unlocked_time, immortal, status){
        super(name, time_started, unlocked_time, immortal);
        this.bastion_time = this.building.Bastion.time
        this.bastion_amount = this.building.Bastion.amount
        this.bastion_timeout = this.building.Bastion.timeout
        this.status = status;
        this.built = true;
    }
    calculateAlloyOutput(time){
        if(this.status === "alive" && time < this.bastion_timeout && time!=0){
            if(time % this.bastion_time  ==0){
                return(this.bastion_amount)
            }
        }
        return(0);
    }
    
    calculateAlloyAverage(time){
        if(this.status === "alive" && time < this.bastion_timeout && time >2){
            return (this.bastion_amount/this.bastion_time);
        }
        else{
            return(0);
        }
    }
}
export const bastion = new Bastion( "Bastion",0,0,"Xol", "alive");



class UpgradeStructure extends Structures{
    constructor(name, time_started, unlocked_time, immortal){
        super(name, time_started, unlocked_time, immortal);
        
        this.finished = time_started + this.build_time;        
        this.built = false;  
    }
}

class ArmyStructure extends Structures{
    constructor(name, time_started, unlocked_time, immortal){
        super(name, time_started, unlocked_time, immortal);
        
        this.finished = time_started + this.build_time;        
        this.built = false;  
    }

    build_army(){

    }
}

class StaticDefense extends Structures{
    constructor(name, time_started, unlocked_time, immortal){
        super(name, time_started, unlocked_time, immortal);
        
        this.finished = time_started + this.build_time;        
        this.built = false;  
    }
}

class EtherStructure extends Structures{
    constructor(name, time_started, unlocked_time, immortal){
        super(name, time_started, unlocked_time, immortal);
        
        this.finished = time_started + this.build_time;        
        this.built = false;  
    }

}

export class Base extends Structures{
    constructor(name, time_started, unlocked_time, immortal, workers, level){
        super(name, time_started, unlocked_time, immortal);
        this.base_alloy = 8000;
        this.workers = workers;
        this.level = level;
        this.time_started = time_started;
        this.finished = time_started + this.build_time;
        this.nodes = g.nodes; //Total Nodes (not just nodes unlocked)
        this.long_workers = CalculateWorkers(this.level, this.workers)[0];
        this.short_workers = CalculateWorkers(this.level, this.workers)[1];
        
        this.paused = []; //array of seconds paused
        this.worker_progress = 0; //progress of a building worker
        this.built = false
        this.mined_out = undefined;  
    }

    build_workers(time){
        if(this.paused.includes(time) == false && this.workers < this.level*this.nodes && getCumulativeAlloy(time)>(g.alloyPerTrip/g.workerBuildTime) && this.finished <time){
            
            if (this.worker_progress != g.workerBuildTime){ //when the worker has been built for 18 seconds, the base pops out a worker and may build a new worker
                this.worker_progress += 1;

                
                Change_Cumulative_Values( time, - (g.alloyPerWorker/g.workerBuildTime));
                if(this.worker_progress == g.workerBuildTime){
                    this.workers += 1;

                }
            }
            else{
                this.worker_progress = 0;
            }
        }

    }

    calculateAlloyOutput(time){
        if(this.base_alloy >0 && time !=0){
            this.long_workers = CalculateWorkers(this.level, this.workers)[0];
            this.short_workers = CalculateWorkers(this.level, this.workers)[1];
            let pattern = CalculatePattern(this.long_workers, this.short_workers); //calculate every second as this may change
            //note time - 1 is used as arrays start at 0
            this.base_alloy -= pattern[((time-1) -this.finished) % pattern.length];
            return(pattern[((time-1) -this.finished) % pattern.length]);
        }
        else{
            if(this.base_alloy <5 && this.mined_out===undefined){this.mined_out = time;}
            return(0);
        }
    }

    calculateAlloyAverage(time){
        if(time<this.mined_out){return(this.long_workers*(5/6)+this.short_workers*(5/4))}
        return(0);

    }

    getBaseAlloy(time){
        
    }

    pause_workers(start_time, end_time){
        
    }

    upgrade_base_level(time){

    }

    upgrade_base_structure(time){

    }

    
}



export function newGroveHeart(time_started, workers, level){

    bases.push(new Base( GROVEHEART, time_started, 0, 'Xol', workers, level));
    
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

export function check_unlocked(type){
    let unlocked = [];
    let variables = [];
    if(type ==="unit"){variables = getUnitVariables()}else{variables = getBuildingVariables()}
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



export function modelBuildings(){
    newGroveHeart(-100,8,2);
    // newGroveHeart(22,0,2);
}

modelBuildings();