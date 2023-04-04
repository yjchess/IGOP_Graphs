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





//Calculates each tick of the Bastion 100 percent accurately
function CalculateAccurateBastion(time, alive){
  if (time <= model.bastion_timeout && alive == Boolean(true) && time!=0){
    if(time % model.bastion_time  ==0){
      return(model.bastion_amount)
    }
  }
  return(0);

}


//A more accurate (than average) model of the alloy intake from workers
function CalculateAccurateWorker(bases_array, time){
  let total = 0;

  //this for loop calculates the alloy mined by workers at any given point
  for(let i=0; i<bases_array.length; i++){
    let base =bases_array[i];
    // console.log(bases.finished <= time && time - bases_array[i].finished>3);

    if (base.finished <= time && time - bases_array[i].finished>3){      // >3 as it takes 4 seconds for the workers to return the first alloy patch and start the pattern
      total+=bases_array[i].alloy(time);
    }

    //Calculates Building workers <--Code inside build_workers checks to see if eligible and not paused.
    // base.build_workers(time);

  }

  

  return(total)

}





//Average Alloy from Workers
function CalculateAverageWorker(bases_array, time){
  let total_long = 0; //total long workers
  let total_short = 0; //total short workers

  for(let i=0; i<bases_array.length; i++){

    if (bases_array[i].finished < time && time - bases_array[i].finished>3 && bases_array[i].base_alloy>0){
      total_long += bases_array[i].long_workers;
      total_short += bases_array[i].short_workers;      
    }


  }
  let average = (total_long*model.alloy_per_trip)/model.time_per_long_trip + (total_short*model.alloy_per_trip)/model.time_per_short_trip;
  return(average);
}

//Note that this is the average at any second, not cumulative average
function CalculateAverageBastion( time, alive){
  if (time <= model.bastion_timeout && alive ==Boolean(true)){
    let average = (model.bastion_amount/model.bastion_time );
    return(average);
  }
  else{
    return (0);
  }

}



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
function Graph_Values(){
  let rateValues= Array(model.graph_length).fill(null).map(x => Array(3).fill(0));
  let cumulativeValues= Array(model.graph_length).fill(null).map(x => Array(3).fill(0));

  let cumulative_avg = 150; //starting minerals
  let cumulative_acc = 150;

  for (let i = 0; i<values.length; i++) {

    // console.log("Time = ",i)
	  for (let j = 0; j<values[i].length; j++){
		  if (j==0){
      //set the first number in the array equal to the x interval of the graph    
    	  rateValues[i][j]= {v:i, f: 'Time: ' + Convert_To_Minute(i)}; 
        cumulativeValues[i][j]= {v:i, f: 'Time: ' + Convert_To_Minute(i)};

      }
      else if ( j ==1 ){
      //Accurate Rate
          rateValues[i][j] = CalculateAccurateWorker(bases, i) + CalculateAccurateBastion(i, model.bastion_state);    
          cumulative_acc += rateValues[i][j];
          cumulativeValues[i][j] = cumulative_acc;


          setValues(rateValues);
          setValues2(cumulativeValues);

          //Do all activities that cost alloy here:
          bases.forEach((base) => {base.build_workers(i)});
          bases.forEach((base) => {base.build_self(i)});
          
          cumulative_acc = cumulativeValues[i][j]; //this value may be changed due to expenditure or cancelling buildings
      
        }
      else if (j==2){
      //Avg Rate
          rateValues[i][j]= CalculateAverageWorker(bases, i) + CalculateAverageBastion(i, model.bastion_state);
          cumulative_avg += rateValues[i][j];
          cumulative_avg += cumulativeValues[i][j];
    	    cumulativeValues[i][j]= cumulative_avg; 
      }   
    }
  }
  setValues(rateValues);
  setValues2(cumulativeValues);
}


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

export{CalculateWorkers, CalculatePattern, CalculateAccurateBastion, CalculateAccurateWorker, CalculateAverageWorker, CalculateAverageBastion, Convert_To_Minute, Graph_Values, Change_Cumulative_Values,fillGraph, potentialBuildTime, getBuildingVariables, getAccurateCumulativeArray}