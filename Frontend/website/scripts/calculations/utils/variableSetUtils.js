import {values, values2} from '../variables.js'

export function Change_Cumulative_Values(time, amount){
    console.log("Changing:",values2[time][1],"to",values[time][1]-amount)
    console.log(values2[time][1])
    values2[time][1] += amount;
    values2[time][2] += amount;
    console.log(values2[time][1])
}