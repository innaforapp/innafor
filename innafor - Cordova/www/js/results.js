const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des']
const currentMonth = monthName[new Date().getMonth()];


$$(document).on('tab:init', '.tab[id="resultsLeaderMenu"]', async function (e) {

    let res = await getData(`/app/survey/getResults`);
    res = await res.json();

    let results = {
        activeSurveys: res.activeSurvays,
        arcivedSurveys: res.arcivedSurveys
    }
    

    window.localStorage.setItem("results", JSON.stringify(results));

    let groupSelect = getId("resultGroup");
    let groupOptions = "";
    for (i = 0; i < res.groups.length; i++) {
        if (i == 0) {
            groupOptions += `<option value="${res.groups[i]}" selected>${res.groups[i]}</option>`
        } else {
            groupOptions += `<option value="${res.groups[i]}">${res.groups[i]}</option>`
        }
    }
    groupSelect.innerHTML = groupOptions;
    document.getElementById("resultGroupSelected").getElementsByClassName("item-after")[0].innerHTML = res.groups[0]
 
    resultLinks();

});





function resultLinks(){
let results = JSON.parse(localStorage.getItem('results'));
let availebleResults = {};

let survayGroup = getId("resultGroup").value;
let surveyType = Object.keys(results);


let activeSurveysDiv = getId("activeSurveysDiv");
activeSurveysDiv.innerHTML = "";

let arcivedSurveysDiv = getId("arcivedSurveysDiv");
arcivedSurveysDiv.innerHTML = "";

for (i = 0; i < surveyType.length; i++){
    let resultRoute = results[surveyType[i]][survayGroup];

    if(resultRoute && surveyType[i] === "activeSurveys"){
        let survayId = Object.keys(resultRoute);
        resultRoute = results[surveyType[i]][survayGroup][survayId[0]];

        let resultLink = document.createElement("div");
        resultLink.className ="list-group";
        let ul = document.createElement("ul");
        let li = document.createElement("li");

        for (j = 0; j < survayId.length; j++){
        li.innerHTML += `      
        <a class="item-link item-content" onclick="openResult(${survayId[j]})">
        <div class="item-inner">
          <div class="item-title">
            <div class="item-header">${resultRoute.period}</div>
            ${resultRoute.theme}
          </div>
          <div class="item-after">Resultat</div>
        </div>
      </a>`
      availebleResults[survayId[j]] = resultRoute
    };

        activeSurveysDiv.appendChild(resultLink)
        resultLink.appendChild(ul)
        ul.appendChild(li);
        

    }
    else if(resultRoute && surveyType[i] === "arcivedSurveys"){
        let survayId = Object.keys(resultRoute);
        resultRoute = results[surveyType[i]][survayGroup][survayId[0]];

        let resultLink = document.createElement("div");
        resultLink.className ="list-group";
        let ul = document.createElement("ul");
        let li = document.createElement("li");

        for (j = 0; j < survayId.length; j++){
            li.innerHTML += `      
            <a class="item-link item-content" onclick="openResult(${survayId[j]})">
            <div class="item-inner">
              <div class="item-title">
                <div class="item-header">${resultRoute.period}</div>
                ${resultRoute.theme}
              </div>
              <div class="item-after">Resultat</div>
            </div>
          </a>`
          availebleResults[survayId[j]] = resultRoute;
        };

        arcivedSurveysDiv.appendChild(resultLink)
        resultLink.appendChild(ul)
        ul.appendChild(li);
        
    }
}
window.localStorage.setItem("availebleResults", JSON.stringify(availebleResults));
}

let openedResult;
function openResult(survayId){
    openedResult = JSON.parse(localStorage.getItem('availebleResults'))[survayId];
    mainView.router.navigate({name: "resultsLeader"});

}


$$(document).on('page:init', '.page[data-name="resultsLeader"]', function (e) {
    calculateResults(openedResult)
});



let lineChart = [];
function calculateResults(res){
    lineChart = []

    let answers = res["results"]
    let theme = Object.keys(answers[0].results);

    let avarageMonth = {};
    let themes = ["Mnd"];

    answers.forEach(element => {
        avarageMonth[element.month]={}

        theme.forEach(theme => {
            avarageMonth[element.month][theme] = []
        });

    });
    
    for (let i = 0; i < answers.length; i++) {
        let result = answers[i].results;
        let month = answers[i].month;

        for (j = 0; j < theme.length; j++) {
            result = answers[i].results[theme[j]];

            let totalWeightAnswer = 0;
            totalWeight = 0;
            result.forEach(element => {
                let weight = parseInt(element.weight);
                let weightedAnswer = element.answer * weight;

                totalWeightAnswer += weightedAnswer;
                totalWeight += weight
            });

            let avarage = totalWeightAnswer/totalWeight;
            avarageMonth[month][theme[j]].push(avarage);
        }

    }




    let avgMonth = Object.keys(avarageMonth);

    for (i = 0; i < avgMonth.length; i++) {
        let avgMonthThemes = Object.keys(avarageMonth[avgMonth[i]])
        for (j = 0; j < avgMonthThemes.length; j++){
         let avgTheme =  avgMonthThemes[j].split("-")[2]; 
         if(themes.includes(avgTheme) == false)  
         themes.push(avgTheme)
        }
    };
    lineChart.push(themes)


    for (i = 0; i < avgMonth.length; i++) {
        let avgMonthThemes = Object.keys(avarageMonth[avgMonth[i]])
        let avg = [avgMonth[i]]
        for (j = 0; j < avgMonthThemes.length; j++){
            let avgAnswrs = avarageMonth[avgMonth[i]][avgMonthThemes[j]]
            avg.push(avgAnswrs.reduce(getSum)/avgAnswrs.length)
        }

        lineChart.push(avg)
    };



createChart()

}




function createChart() {
    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawLineChart);
    function drawLineChart() {
        var data = google.visualization.arrayToDataTable(lineChart);

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
                width: '90%',
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

