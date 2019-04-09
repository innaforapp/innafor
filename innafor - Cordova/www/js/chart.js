function createChart() {
    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Måned', 'Trivsel', 'Motivasjon', 'Hoppetau', 'Hibbabibba'],
          ['Januar', 4, 1, 3, 5],
          ['Februar', 2, 2, 2, 1],
          ['Mars', 2, 3, 3, 5],
          ['April', 3, 4, 5, 2]
        ]);

        var optionsdark = {
            curveType: 'function',
            
            hAxis: {
                titleTextStyle: {
                    color: '#222222'
                },
                gridlines: {
                    count: 0
                },
                textStyle: {
                    color: '#222222',
                    fontName: 'Roboto',
                    fontSize: '12',
                    bold: true
                }
            },
            vAxis: {
                minValue: 0,
                maxValue: 5,
                gridlines: {
                    color: '#ffffff',
                    count: 4
                },
                baselineColor: 'transparent',
                title: 'Dager',
                textStyle: {
                    color: '#222222',
                    fontName: 'Roboto',
                    fontSize: '12',
                    bold: true
                }
            },
            
            legend: {
                position: 'top',
                alignment: 'center',
                textStyle: {
                    color: '#222222',
                    fontName: 'Roboto',
                    fontSize: '12'
                }
            },
            
            colors: ["#47bcc2", "#FE5554", "#dd8132", "#54d354"],
            areaOpacity: 0.24,
            lineWidth: 2.5,
            pointSize: 15,
            pointShape: 'circle',
            
            backgroundColor: 'transparent',
            chartArea: {
                backgroundColor: "transparent",
                width: '100%',
                height: '80%'
            },
            
            height: 300,
            pieSliceBorderColor: '#263238',
            pieSliceTextStyle: {
                color: '#607d8b'
            },
            pieHole: 0.9,
            bar: {
                groupWidth: "40"
            },
            colorAxis: {
                colors: ["#3f51b5", "#2196f3", "#03a9f4", "#00bcd4"]
            },
            backgroundColor: 'transparent',
            datalessRegionColor: '#37474f',
            displayMode: 'regions'
        };
        // options for light backgrounds, makes use of general styles applied to dark
        var optionslight = optionsdark;
        optionslight['legend']['textStyle'] = {
            color: '#607d8b'
        };
        optionslight['hAxis']['textStyle'] = {
            color: '#78909c',
            fontName: 'Roboto',
            fontSize: '12',
            bold: true
        };
        optionslight['vAxis']['gridlines'] = {
            color: '#cfd8dc'
        };
        optionslight['datalessRegionColor'] = {
            color: '#f00'
        };
        optionslight['pieSliceBorderColor'] = {
            color: '#eceff1'
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

        chart.draw(data, optionsdark);
    }

}
