console.log("I am Calculation.js")
import { CONSTANTS as g, BUILDINGVARIABLES, UNITVARIABLES } from './variables.js';
import { getBuildingVariables, getCumulativeAlloy, getUnitVariables } from './utils/variableGetUtils.js';

function CalculateWorkers(level, workers){ //for any given base, calculates how many workers are long/short workers
  let long_workers = 0;
  let short_workers = 0;

  if (level === 2) {
    if (workers > g.nodes) {
      long_workers = (workers - g.nodes) * 2;
    } else {
      long_workers = 0;
    }
    short_workers = workers - long_workers;
  } else if (level === 1) {
  	if (workers > (g.nodes/2)){
    	long_workers = (workers - (g.nodes / 2)) * 2;
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
  let calculation = ((long_workers / g.timePerLongTrip) + (short_workers / g.timePerShortTrip)) * g.alloyPerTrip;
  let count = 1;
  while ((calculation * count) % g.alloyPerTrip != 0 && (Math.trunc(calculation * count) != (calculation * count) - 0.99999999999999)) {
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
    pattern[pattern.length - count] += g.alloyPerTrip;
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
  console.log(pattern);
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






// The following section works with user_interaction.js
function potentialBuildTime(actionName, type){
  let variables =[];
  let variable = null;

  if(type ==="unit"){
    variables = UNITVARIABLES;
    variable = getUnitVariables(actionName);

  }else{
    variables = BUILDINGVARIABLES
    variable = getBuildingVariables(actionName)
  }

  let cumulative = getCumulativeAlloy();
  let totalAlloy = 0;
  for (let time = 0; time < cumulative.length; time++) {
    totalAlloy += cumulative[time];
    if (totalAlloy > variable.costs.alloy){return time}
  }
}



export{CalculateWorkers, CalculatePattern, potentialBuildTime}