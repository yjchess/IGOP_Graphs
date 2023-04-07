import * as model from './variables.js';
import { bases, Change_Cumulative_Values } from './variables.js';
import { values, values2, setValues, setValues2, BUILDINGVARIABLES, UNITVARIABLES } from './variables.js';
import { Base, newGroveHeart } from './Structures.js';

function CalculateWorkers(level, workers){ //for any given base, calculates how many workers are long/short workers
  let long_workers = 0;
  let short_workers = 0;

  if (level == 2) {
    if (workers > model.nodes) {
      long_workers = (workers - model.nodes) * 2;
    } else {
      long_workers = 0;
    }
    short_workers = workers - long_workers;
  } else if (level == 1) {
  	if (workers > (model.nodes/2)){
    	long_workers = (workers - (model.nodes / 2)) * 2;
    }
    else{
    	long_workers = 0;
    }
    short_workers = workers - long_workers;
  }

  return([long_workers,short_workers])
}

//Calculates a pattern which predicts how much alloy is returned by workers on a base. i.e. 8 workers give: 5 alloy on second 1, 5 alloy on second 2 and 10 alloy on second 3 repeating.
function CalculatePattern( long_workers, short_workers) {
  let calculation = ((long_workers / model.time_per_long_trip) + (short_workers / model.time_per_short_trip)) * model.alloy_per_trip;
  let count = 1;
  while ((calculation * count) % model.alloy_per_trip != 0 && (Math.trunc(calculation * count) != (calculation * count) - 0.99999999999999)) {
    count += 1;
  }
  calculation *= count

  let pattern = [];
  for (var i = 1; i <= count; i++) {
    pattern.push(0);
  }


  let total = 0;
  count = 1;
  while (total < calculation) {
    pattern[pattern.length - count] += model.alloy_per_trip;
    count += 1;
    for (var i = 0; i < pattern.length; i++) {
      total += pattern[i];
    }

    if (total < calculation) {
      total = 0;
    }

    if (count > pattern.length) {
      count = 1;
    }

  }
  return (pattern);
}
/*

  alloy received goes in the patterns:					Workers:	Long/Short:
  5, 5, 10: 										              	8					8L
  5, 5, 5, 10:						 	    			          7					6L 1S
  5, 5, 5, 5, 5, 10: 									          6					4L 2S
  5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 10: 					5					2L 3S
  5, 5, 5, 5: 4/8:										          4					4S
  0, 5, 5, 5: 3/8										            3					3S
  0, 5: 2/8												              2					2S
  0, 0, 0, 5: 1/8										            1					1S

*/




//Graph functions
//function to covert Integers to Minutes
function Convert_To_Minute(Integer){
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

//Function to populate Graph 1's x and y co-ordinates


function fillGraph() {

  let ticks_array = [];
  let ticks_interval = 30;

  // sets up the x axis so it is labelled: 0:30, 1:00, 1:30 ....
  for (let i=0; i<= model.graph_length; i++){
	  if (i % ticks_interval == 0){
  	  ticks_array.push({v:i, f:Convert_To_Minute(i)});
    }
  }

  var data = new google.visualization.DataTable();
  data.addColumn('number', 'Time');
  data.addColumn('number', 'Accurate');
  data.addColumn('number', 'Avg');
  data.addRows(values);
  
  var data2= new google.visualization.DataTable(); //data for chart 2
  data2.addColumn('number', 'Time');
  data2.addColumn('number', 'Accurate');
  data2.addColumn('number', 'Avg');
  data2.addRows(values2);

  var options = {
    legend:{position:'bottom'},
    chartArea:{left:50,top:25, bottom:80, width:'100%'},
    title: '8 Workers + Bastion, no movement',
    hAxis: {
    
      title: 'Time (Minutes)',
      titleTextStyle: {
        italic: false,
        fontSize: 20,
        fontName:'Georgia',
        bold:true,
      },
      
      textStyle: {
        fontSize: 12,
        fontName: 'Georgia',
        bold: true,
      },
      
      slantedText: true,
      slantedTextAngle: -90,          
      ticks: ticks_array,
      
    },
    vAxis: {
      title: 'Alloy/s',
      titleTextStyle: {
        italic: false,
        fontSize: 20,
        fontName:'Georgia',
        bold:true,
      },
      minValue: 0,
      
    },
    
    explorer:{ 
     keepInBounds: true,
     zoomDelta: 0.99,
     maxZoomOut:1.1,
    },
    backgroundColor: '#f1f8e9'
  };
  
  var options2 = {
    legend:{position:'bottom'},
    chartArea:{left:50,top:25, bottom:80, width:'100%'},
    title: '8 Workers + Bastion, no movement Cumulative',
    hAxis: {
    
      title: 'Time (Minutes)',
      titleTextStyle: {
        italic: false,
        fontSize: 20,
        fontName:'Georgia',
        bold:true,
      },
      
      textStyle: {
        fontSize: 12,
        fontName: 'Georgia',
        bold: true,
      },
      
      slantedText: true,
      slantedTextAngle: -90,          
      ticks: ticks_array,
      
    },
    vAxis: {
      title: 'Alloy/s',
      titleTextStyle: {
        italic: false,
        fontSize: 20,
        fontName:'Georgia',
        bold:true,
      },
      minValue: 0,
      
    },
    
    explorer:{ 
     keepInBounds: true,
     zoomDelta: 0.99,
     maxZoomOut:1.1,
    },
    backgroundColor: '#f1f8e9'
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
  
  var chart2 = new google.visualization.LineChart(document.getElementById('chart2_div'));
  chart2.draw(data2, options2);
  

}



// The following section works with user_interaction.js
function potentialBuildTime(actionName, type){

  let variables =[];
  if(type ==="unit"){variables = UNITVARIABLES}else{variables = BUILDINGVARIABLES}
  let cumulativeArray = getAccurateCumulativeArray();
  for (let index = 0; index < cumulativeArray.length; index++) {
    const value = cumulativeArray[index];

    for (let index = 0; index < variables.length; index++) {
      const action = variables[index];
      if(action.name === action.name){
        if(action.costs.alloy <= value){
          return (value);
        }
      } 
    }
  }
}


function getBuildingVariables(name){
  for (let index = 0; index < BUILDINGVARIABLES.length; index++) {
    const building = BUILDINGVARIABLES[index];
    if(building.name === name){
      return(building);
    }
  }
}


function getAccurateCumulativeArray(){
  let cumulativeArray = []
  for (let i = 0; i<values2.length; i++) {
    cumulativeArray.push(values2[i][1])
  }
  return (cumulativeArray);
}

export{CalculateWorkers, CalculatePattern, Convert_To_Minute, Change_Cumulative_Values,fillGraph, potentialBuildTime, getBuildingVariables, getAccurateCumulativeArray}