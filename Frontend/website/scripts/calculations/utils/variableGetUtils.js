import {BUILDINGVARIABLES, UNITVARIABLES, values2} from '../variables.js'
export function getCumulativeAlloy(time){
    if(time !== undefined){return(values2[time][1]);}
    else{ return (values2.map(indexes => indexes[1])); };
}

export function getBuildingVariables(name){
    if(name===undefined){return BUILDINGVARIABLES};
    for(const building of BUILDINGVARIABLES){
        if(building.name === name){return building}
    }
}

export function getUnitVariables(name){
    if(name===undefined){return UNITVARIABLES};
    for(const unit of UNITVARIABLES){
        if(unit.name === name){return unit}
    }
}

console.log(getBuildingVariables("Bastion"));