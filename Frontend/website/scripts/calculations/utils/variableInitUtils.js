export const [GROVEHEART, ETHER_MAW, ALTAR, MURDER_HOLLOW, NEUROCYTE, RED_VALE, AMBER_WOMB, BONE_CANOPY, DEEPNEST, GODHEART, AEROVORE, OMNIVORE, GUARDIAN] 
= ["GroveHeart","Ether Maw", "Altar Of The Worthy", "Murder Hollow", "Neurocyte","Red Vale", "Amber Womb", "Bone Canopy", "Deepnest", "GodHeart", "Aerovore", "Omnivore", "Guardian Of The Grove"];

// export async function get_var(type){
//     const test_var = await fetch(`http://localhost:3000/api/${type}`,{method:"GET"});
//     const json = await test_var.json();
//     return(json);
// }

export function get_var(type){

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET",`http://localhost:3000/api/${type}`, false)
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    xmlhttp.send();
    return(JSON.parse(xmlhttp.responseText))
   
}

export function createAllStructuresHash(faction){
    let tempHash = new Map();
    if(faction === "Aru"){
        tempHash.set(GROVEHEART,1);
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