import { values, values2, setValues, setValues2, graph_length} from './variables.js';
import * as utils from './utils/graphCalculationUtils.js';





//Function to populate Graph 1's x and y co-ordinates
export function Graph_Values(length){

    //rateValues =       [[time,    acc_alloy_rate,    avg_alloy_rate],...]
    //cumulativeValues = [[time,    acc_alloy_cum.,    avg_alloy_cum.],...]
    let rateValues= utils.init_2DArray(length, 3)
    let cumulativeValues= utils.init_2DArray(length, 3);

    utils.setTimeValues(rateValues);
    utils.setTimeValues(cumulativeValues);

    utils.setAccurateAlloyValues(rateValues);
    utils.setAccurateAlloyValuesCumulative(cumulativeValues, rateValues, 150);

    utils.setAverageAlloyValues(rateValues);
    utils.setAverageAlloyValuesCumulative(cumulativeValues, rateValues, 150);


    setValues(rateValues);
    setValues2(cumulativeValues);    

    return([rateValues, cumulativeValues]);
}

  
  
export function fillGraph() {
  
    let ticks_array = [];
    let ticks_interval = 30;
  
    // sets up the x axis so it is labelled: 0:30, 1:00, 1:30 ....
    for (let i=0; i<= model.graph_length; i++){
        if (i % ticks_interval == 0){
          ticks_array.push({v:i, f:utils.Convert_To_Minute(i)});
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
  