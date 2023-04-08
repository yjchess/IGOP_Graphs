function techTree(require, requireAlt){return ({require: require, requireAlt: requireAlt, unlocks:[], unlockCombo:[]})}

function costs(alloy, ether, time, supply){
    if(supply !== undefined){return {alloy: alloy, ether: ether, time: time, supply:supply}}
    return {alloy: alloy, ether: ether, time: time}
}


// These Functions are for Specific types of Buildings.
function bastion(tickAmount, tickDuration, timeout){return {amount:tickAmount, time:tickDuration, timeout:timeout}}
function base(workers, workerMax, level, alloy){return {workers:workers, workerInitMax:workerMax, level:level, alloyInitAmount:alloy};}
function ether(amount, gain, increment){return {initAmount:amount, gain:gain, increment:increment};}
var barracks, factory, starport; //These are the same function but w different names
barracks = factory = starport = function(maxProduction, supplyIncrease){return {maxProduction:maxProduction, supplyIncrease:supplyIncrease}}
function upgrade(initial_Upgrade_Total, Unit_Unlocks){return{initUpTotal:initial_Upgrade_Total, unitUnlocks:Unit_Unlocks}}

function defense(air, ground){
    // If the length of either array is 3 - the damage to light/medium/heavy = first element.
    if(air.length === 3){air.unshift(air[0]); air.unshift(air[0]);};
    if(ground.length === 3){ground.unshift(ground[0]); ground.unshift(ground[0]);};

    return {airLightDPS:       air[0],  airMediumDPS:       air[1],  airHeavyDPS:       air[2],  airDmgRange:       air[3], airDmgCD:       air[4],
            groundLightDPS: ground[0],  groundMediumDPS: ground[1],  groundHeavyDPS: ground[2],  groundDmgRange: ground[3], groundDmgCD: ground[4]};
}

function specific_properties_key(object){
    let type = object.type;
    let property = (type.toString().charAt(0).toUpperCase() + type.toString().slice(1));    
    return(property);
}

function texts(object){
    let description = "";

    // Reduce object.type.property to obj.property i.e. object.base.worker becomes obj.worker
    let obj = object[specific_properties_key(object)];
    let array = undefined;

    if(specific_properties_key(object)==="Upgrade"){array = obj.unitUnlocks.join(", ");}
    let startTexts={
        Base: (obj.workers + "/" + obj.workerInitMax + " workers, level " + obj.level + ", " + obj.alloyInitAmount + " Alloy"),
        Ether: (obj.initAmount + " ether, + " + obj.gain + " every " + obj.increment + " seconds" ),
        Barracks:("0/" + obj.maxProduction + " supply producing +" + obj.supplyIncrease + " supply"),
        Factory:("0/" + obj.maxProduction + " supply producing +" + obj.supplyIncrease + " supply"),
        Starport:("0/" + obj.maxProduction + " supply producing +" + obj.supplyIncrease + " supply"),
        Defense:("air/ground:" + obj.airLightDPS + "/" + obj.airMediumDPS + "/" + obj.airHeavyDPS + " " + obj.groundLightDPS + "/" + obj.groundMediumDPS + "/" + obj.groundHeavyDPS +"dps"),
        Upgrade:("0/"+obj.initUpTotal + " up unlock: "+ array)
    };    
    return ({startText: startTexts[specific_properties_key(object)], description:description});
}

function fileRef(object){
    
    let imgName = object.name.replace(/\s/g,'');
    let icons ={base:"Worker", ether:"Ether", alloy:"Alloy",barracks:"Sword", factory:"siege", starport:"Wings", defense:"Shield", upgrade:"Book"};
    let iconName =icons[object.type];

    return {img: "images/aru/structures/"+imgName+".png", icon:"images/action_icons/"+iconName+".svg"};
}

function stats(health, shield, armour){return {health: health, shields: shield, armour: armour===undefined?"Heavy" :armour};}


function post_processing(buildingvariables, unitvariables){
    buildingvariables.forEach(building =>{
        let reqArr=building.techTree.require;
        let reqAltArr=building.techTree.requireAlt;
        if(reqArr !==null){
            if(reqArr.length ===1){buildingvariables.forEach(option => {if(option.name === reqArr[0]){option.techTree.unlocks.push( building.name);};});}
            else if (reqArr.length > 1){buildingvariables.forEach(option => {reqArr.forEach(requirement =>{if(option.name === requirement){option.techTree.unlockCombo.push([reqArr,building.name])}})})};
        }
    
        if(reqAltArr !==null){
            if(reqAltArr.length ===1){buildingvariables.forEach(option => {if(option.name === reqAltArr[0]){option.techTree.unlocks.push( building.name);};});}
            else if (reqAltArr.length > 1){buildingvariables.forEach(option => {reqAltArr.forEach(requirement =>{if(option.name === requirement){option.techTree.unlockCombo.push([reqAltArr,building.name])}})})};
        }
    
    });
    
    
    buildingvariables.forEach(building =>{
        building.files = fileRef(building);
        building.texts = texts(building);
        if(building.techTree.unlocks.length === 0){ building.techTree.unlocks = null};
        if(building.techTree.unlockCombo.length === 0){ building.techTree.unlockCombo = null};  
    });

}

module.exports ={techTree, costs, bastion, base, ether, barracks, factory, starport, upgrade, defense, texts, fileRef, stats, post_processing};