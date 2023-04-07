import {bastion} from "../Structures.js"
import {bases} from "../variables.js"

export function Convert_To_Minute(Integer){
    let minute = Math.floor(Integer/60);
      let second = Integer%60;
    
    if(second == 0){
        second = second + '0';
    }
    
      else if(second.toString().length == 1){
        second = '0' + second ;
    }  
    return(minute + ':' + second);
}

export function init_2DArray(arr_length, second_arr_length){
    return Array(arr_length).fill(null).map(x => Array(second_arr_length).fill(0))
}

export function setTimeValues(graph){
    let time_index=0;
    graph.forEach((_,x_coord)=>{
        let time_value = x_coord;
        graph[x_coord][time_index] = {v:time_value, f: 'Time: ' + Convert_To_Minute(time_value)};
    })

    return graph;
}

export function setAccurateAlloyValues(graph){
    let time_index = 0;
    let acc_alloy_index=1;
    graph.forEach((_,x_coord)=>{
        let time = x_coord;
        graph[x_coord][acc_alloy_index] = CalculateAccurateAlloy(time);
    })

    return graph;
}

export function setAccurateAlloyValuesCumulative(cumulative_graph, values_graph, initial_alloy){
    let accAlloyIndex = 1;
    values_graph.forEach((_, x_coord)=>{
        if (x_coord === 0){cumulative_graph[x_coord][accAlloyIndex] = initial_alloy;} else{
            cumulative_graph[x_coord][accAlloyIndex] = cumulative_graph[x_coord-1][accAlloyIndex] + values_graph[x_coord][accAlloyIndex]
        }
    })
    return cumulative_graph;
}

export function setAverageAlloyValues(graph){
    let time_index = 0;
    let avg_alloy_index=2;
    graph.forEach((_,x_coord)=>{
        let time = x_coord;
        graph[x_coord][avg_alloy_index] = CalculateAverageAlloy(time);
    })

    return graph;
}

export function setAverageAlloyValuesCumulative(cumulative_graph, values_graph, initial_alloy){
    let avgAlloyIndex = 2;
    values_graph.forEach((_, x_coord)=>{
        if(x_coord === 0 ){cumulative_graph[x_coord][avgAlloyIndex] = initial_alloy} else {
            cumulative_graph[x_coord][avgAlloyIndex] = cumulative_graph[x_coord-1][avgAlloyIndex] + values_graph[x_coord][avgAlloyIndex]
        }
    })
}


export function CalculateAccurateAlloy(time){
    let total = 0;
    bases.forEach((base)=>{
        total += base.calculateAlloyOutput(time);
    })
    total += bastion.calculateAlloyOutput(time);
    return total;
}

export function CalculateAverageAlloy(time){
    let total = 0;
    bases.forEach((base)=>{
        total += base.calculateAlloyAverage(time);
    })
    
    total += bastion.calculateAlloyAverage(time);
    return total;
}