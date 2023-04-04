function techTree(require, requireAlt){return ({require: require, requireAlt: requireAlt, unlocks:[], unlockCombo:[]})}

function costs(alloy, ether, time, supply){
    if(supply !== undefined){return {alloy: alloy, ether: ether, time: time, supply:supply}}
    return {alloy: alloy, ether: ether, time: time}
}


// These Functions are for Specific types of Buildings.
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

function specific_properties(object){
    let type = object.type;
    let property = (type.toString().charAt(0).toUpperCase() + type.toString().slice(1));    
    return(property);
}

function texts(object){
    let description = "";

    // Reduce object.type.property to obj.property i.e. object.base.worker becomes obj.worker
    let obj = object[specific_properties(object)];
    let array = undefined;

    if(specific_properties(object)==="Upgrade"){array = obj.unitUnlocks.join(", ");}
    let startTexts={
        Base: (obj.workers + "/" + obj.workerInitMax + " workers, level " + obj.level + ", " + obj.alloyInitAmount + " Alloy"),
        Ether: (obj.initAmount + " ether, + " + obj.gain + " every " + obj.increment + " seconds" ),
        Barracks:("0/" + obj.maxProduction + " supply producing +" + obj.supplyIncrease + " supply"),
        Factory:("0/" + obj.maxProduction + " supply producing +" + obj.supplyIncrease + " supply"),
        Starport:("0/" + obj.maxProduction + " supply producing +" + obj.supplyIncrease + " supply"),
        Defense:("air/ground:" + obj.airLightDPS + "/" + obj.airMediumDPS + "/" + obj.airHeavyDPS + " " + obj.groundLightDPS + "/" + obj.groundMediumDPS + "/" + obj.groundHeavyDPS +"dps"),
        Upgrade:("0/"+obj.initUpTotal + " up unlock: "+ array)
    };    
    return ({startText: startTexts[specific_properties(object)], description:description});
}

function fileRef(object){
    
    let imgName = object.name.replace(/\s/g,'');
    let icons ={base:"Worker", ether:"Ether", alloy:"Alloy",barracks:"Sword", factory:"siege", starport:"Wings", defense:"Shield", upgrade:"Book"};
    let iconName =icons[object.type];

    return {img: "images/aru/structures/"+imgName+".png", icon:"images/action_icons/"+iconName+".svg"};
}

function stats(health, shield, armour){
    if(armour){return{health: health, shields: shield, armour:armour}}
    return {health: health, shields: shield, armour:"Heavy"};
}


function post_processing(){

}
// BUILDINGVARIABLES.forEach(building =>{
//     let reqArr=building.techTree.require;
//     let reqAltArr=building.techTree.requireAlt;
//     if(reqArr !==null){
//         if(reqArr.length ===1){BUILDINGVARIABLES.forEach(option => {if(option.name === reqArr[0]){option.techTree.unlocks.push( building.name);};});}
//         else if (reqArr.length > 1){BUILDINGVARIABLES.forEach(option => {reqArr.forEach(requirement =>{if(option.name === requirement){option.techTree.unlockCombo.push([reqArr,building.name])}})})};
//     }

//     if(reqAltArr !==null){
//         if(reqAltArr.length ===1){BUILDINGVARIABLES.forEach(option => {if(option.name === reqAltArr[0]){option.techTree.unlocks.push( building.name);};});}
//         else if (reqAltArr.length > 1){BUILDINGVARIABLES.forEach(option => {reqAltArr.forEach(requirement =>{if(option.name === requirement){option.techTree.unlockCombo.push([reqAltArr,building.name])}})})};
//     }

// });


// BUILDINGVARIABLES.forEach(building =>{
//     building.files = fileRef(building);
//     building.texts = texts(building);
//     if(building.techTree.unlocks.length === 0){ building.techTree.unlocks = null};
//     if(building.techTree.unlockCombo.length === 0){ building.techTree.unlockCombo = null};  
// });


// Code Regarding File Creation Starts here
function beautify_JSON_Obj_Arr(array){
    // let propertiesHash = newMap();
    let modified = JSON.stringify(array).replaceAll("},{","},\n\t{");
    modified = modified.slice(1,-1);
    modified = "[\n\t" + modified + "\n]";

    // let property_regex =/(\"(([a-z])+(([A-Z])*([a-z])+)*)+\":)/g;
    let property_regex =/(\"\w+\":)/g; 
    let all_properties = modified.match(property_regex);
    let matching_properties = [];
    const elementCounts = {};
    all_properties.forEach(element => {
        elementCounts[element] = (elementCounts[element] || 0) + 1;
        if (elementCounts[element] === array.length){matching_properties.push(element)}
    });

    matching_properties.forEach(property =>{
        let value_regex = new RegExp('('+property+')(.+?)(\\"\\w+\\":)',"g");
        let longest = 0;
        
        for(const match of modified.matchAll(value_regex)){if(match[2].length > longest){longest = match[2].length}}

        for(const match of modified.matchAll(value_regex)){
            let whitespaces = (longest-match[2].toString().length)+1;
            let string_to_be_replaced = match[1] + match[2] + match[3];
            let replacement_string = (match[1] + " ".repeat(whitespaces) + match[2] + " "+match[3]);
            modified = modified.replace(string_to_be_replaced, replacement_string);
        }
    })
    return (modified);
}

module.exports ={techTree, costs, base, ether, barracks, factory, starport, upgrade, defense, specific_properties, texts, fileRef, stats, beautify_JSON_Obj_Arr};