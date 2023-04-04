import { alloy_per_worker, getCumulativeAlloy, Change_Cumulative_Values } from './variables.js';
import { CalculateWorkers, CalculatePattern } from './functions.js';
import { worker_build_time, nodes } from "./variables.js";
import { bases } from './variables.js';


//testing purposes
import { values2 } from './variables.js';



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
}


export class Base extends Structures{
    constructor(name, alloy_cost, build_time, ether_cost, time_started, unlocked_time, immortal, workers, level){
        super(name, alloy_cost, build_time, ether_cost, time_started, unlocked_time, immortal);
        this.base_alloy = 8000;
        this.workers = workers;
        this.level = level;
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
                console.log("Build worker for base:" +this.finished)
                this.worker_progress += 1;
                console.log("worker progress: " + this.worker_progress);
                console.log(worker_build_time);
                
                Change_Cumulative_Values( time, - (alloy_per_worker/worker_build_time));
                if(this.worker_progress == worker_build_time){
                    this.workers += 1;
                    console.log("Worker Built");
                    console.log(this.workers);
                }
            }
            else{
                this.worker_progress = 0;
            }
        }

    }


    build_self(time){ //simple takes the alloy cost away from the cumulative graph

        if(this.time_started != -100 && this.built ==false && time == this.time_started) { //-100 seconds is the time for the first base to be created
            console.log("Time: " +time);
            console.log("About to build self:");
            console.log(values2[this.time_started]);
            console.log(values2[this.time_started][1]);
            console.log(this.time_started);
            Change_Cumulative_Values(this.time_started, - this.alloy_cost);
            this.built = true;
        }
    }
}

export function newGroveHeart(time_started, workers, level){

    bases.push(new Base("Grove Heart", 400, 100, 0, time_started, 0, 'Xol', workers, level));
    
}

export function modelBuildings(){
    newGroveHeart(-100,8,2);
    newGroveHeart(22,0,2);
}
  