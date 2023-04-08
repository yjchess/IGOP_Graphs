var fs = require('fs')

// sub-functions to format JSON in beautify_JSON_Obj_Arr()
function addNewLines(array){
    let modified = JSON.stringify(array).replaceAll("},{","},\n\t{");
    modified = modified.slice(1,-1);
    modified = "[\n\t" + modified + "\n]";
    return(modified)
}

function get_all_properties(modified_array){
    let property_regex =/(\"\w+\":)/g; 
    let all_properties = modified_array.match(property_regex);
    all_properties = [... new Set(all_properties)];
    return all_properties
}

function specialized_properties(all_properties){
    let specialized_properties = []
    all_properties.forEach( (property)=>{
        //All Special properties start with a capital Letter.
        if(property.charAt(1) === property.charAt(1).toUpperCase()){
            specialized_properties.push(property);
        }
    })
    return specialized_properties;
}

function justify_values(JSON_array, properties){
    properties.forEach(property =>{
        let value_regex = new RegExp('('+property+')(.+?)(\\"\\w+\":|\\},\\n|\\}\\n)',"g");
        let longest = 0;

        for(const match of JSON_array.matchAll(value_regex)){if(match[2].length > longest){longest = match[2].length}}

        for(const match of JSON_array.matchAll(value_regex)){
            let whitespaces = (longest-match[2].toString().length)+1;
            let string_to_be_replaced = match[1] + match[2] + match[3];
            let replacement_string = (match[1] + " ".repeat(whitespaces) + match[2] + " "+match[3]);
            JSON_array = JSON_array.replace(string_to_be_replaced, replacement_string);
        }
    })

    return JSON_array
}

function justify_properties(JSON_array, special_props_array){
    let longest = 0;
    special_props_array.forEach((property)=>{
        if (property.length > longest) {longest = property.length}
    })

    special_props_array.forEach((property)=>{
        let whitespaces = longest - property.length;
        let new_property = property.substring(0, property.length-1) +" ".repeat(whitespaces) +":";
        JSON_array = JSON_array.replaceAll(property, new_property);
    })
    return JSON_array;
}

function format_brackets(JSON_array){
    JSON_array = JSON_array.replaceAll("{ ", "{")
    JSON_array = JSON_array.replaceAll("} ", "}")
    JSON_array = JSON_array.replaceAll("[ ", "[")
    JSON_array = JSON_array.replaceAll("] ", "]")
    return JSON_array;
}

function beautify_JSON_Obj_Arr(array){

    let modified = addNewLines(array);
    modified = format_brackets(modified);
    let all_properties = get_all_properties(modified);
    let special_props = specialized_properties(all_properties);
    
    modified = justify_values(modified, all_properties);
    modified = justify_properties(modified, special_props);
    modified = format_brackets(modified);
    return (modified);
}

//Creation of file
function createFile(name, fileContent){    
    var filepath = `./models/${name}.json`;
    
    fs.writeFile(filepath, fileContent, (err) => {
        if (err) throw err;
        else{console.log(`The ${name} file was succesfully saved!`);}
    
    });    
}
module.exports = {beautify_JSON_Obj_Arr, createFile}