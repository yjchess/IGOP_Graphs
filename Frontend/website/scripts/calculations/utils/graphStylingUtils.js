export function createTable(column_headings, values){
    let table = new google.visualization.DataTable();
    column_headings.forEach(header => {
        table.addColumn('number',header.toString())
    });
    table.addRows(values);

    return table
}

export function defaultStyleTable(title, ticks_array){
    let options = {
        backgroundColor: '#f1f8e9',
        legend:{position:'bottom'},
        chartArea:{left:70,top:25, bottom:80, right:10, width:'100%'},
        title: title,

        hAxis: { 
        
            title: 'Time (Minutes)', 
            titleTextStyle: {italic: false, fontSize: 20,fontName:'Georgia', bold:true,},
            textStyle: {fontSize: 12, fontName: 'Georgia', bold: true,},
            slantedText: true,
            slantedTextAngle: -90,          
            ticks: ticks_array,
          
        },

        vAxis: {
            
            title: 'Alloy/s',
            titleTextStyle: {italic: false, fontSize: 20, fontName:'Georgia', bold:true,},
            minValue: 0,
          
        },
        
        explorer:{ 
            keepInBounds: true,
            zoomDelta: 0.99,
            maxZoomOut:1.1,
        }
    };
    return options
}

export function drawGraph(html_element, data, options ){
    let chart = new google.visualization.LineChart(document.getElementById(html_element));
    chart.draw(data, options);
}