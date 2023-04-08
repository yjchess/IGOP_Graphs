console.log("I am graphCalculations.js")
import { values, values2, graph_length, setGraphValues} from './variables.js';
import * as calcUtils from './utils/graphCalculationUtils.js';
import * as styleUtils from './utils/graphStylingUtils.js';

export function Graph_Values(){
  //rateValues =       [[time,    acc_alloy_rate,    avg_alloy_rate],...]
  //cumulativeValues = [[time,    acc_alloy_cum.,    avg_alloy_cum.],...]
  let rateValues= calcUtils.init_2DArray(graph_length, 3)
  let cumulativeValues= calcUtils.init_2DArray(graph_length, 3);

  calcUtils.setTimeValues(rateValues);
  calcUtils.setTimeValues(cumulativeValues);

  calcUtils.setAccurateAlloyValues(rateValues);
  calcUtils.setAccurateAlloyValuesCumulative(cumulativeValues, rateValues, 150);

  calcUtils.setAverageAlloyValues(rateValues);
  calcUtils.setAverageAlloyValuesCumulative(cumulativeValues, rateValues, 150);

  setGraphValues(rateValues, cumulativeValues);
}

  
export function fillGraph() {
    
  let ticks_interval = 30;
  let ticks_array = calcUtils.calculateTicksArray(graph_length, ticks_interval);
  let column_headings = ['Time', 'Accurate', 'Average']

  let data = styleUtils.createTable(column_headings, values);    
  let data2= styleUtils.createTable(column_headings, values2); 

  let options = styleUtils.defaultStyleTable("Rate Graphs", ticks_array)
  let options2 = styleUtils.defaultStyleTable("Cumulative Graphs", ticks_array)

  styleUtils.drawGraph('chart_div', data, options)
  styleUtils.drawGraph('chart2_div', data2, options2)
    
}
  