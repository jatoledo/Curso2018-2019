$("#populate").html("");

var data = {};
var listOfNeighbourhoods = []

var ourDataQuery = [
    'PREFIX sosa:<http://www.w3.org/ns/sosa/>',
    'PREFIX property:<http://www.group07.linkeddata.org/property#>',
    'PREFIX geo:<http://www.w3.org/2003/01/geo/wgs84_pos#>',
    "select  distinct ?StationName ?Address ?Neighbourhood ?Substance ?Time (AVG(?Value) AS ?Average ) where {",
    "?obsPr property:hasSubstance ?Substance.",
    "?observation sosa:observedProperty  ?obsPr.",
    "?observation sosa:resultTime ?Time.",
    "?Station rdfs:label ?StationName.",
    "?Station property:address ?Address.",
    "?Station geo:location ?Location.",
    "?Location property:neighbourhood ?Neighbourhood.",
    "{",
    "select distinct ?Substance ?Station ?Value where {",
    "?observation a <http://purl.oclc.org/NET/ssnx/ssn#Observation>.",
    "?observation sosa:observedProperty ?obsProp.",
    "?obsProp property:hasSubstance ?Substance. ",
    "?obsProp sosa:madeBySensor ?Station.",
    "?obsProp property:hasMetricValue ?Value. ",
    "}group by  ?Station",
    "}",
    "} group by ?StationName  ?Address ?Neighbourhood ?Substance ?Lat ?Lon ?Time  order by asc(?Time)"
].join(' ');

var treatData = (_data) => {
    _data.results.bindings.forEach((measurement) => {
        var neighbourhoodCode = measurement.Neighbourhood.value.split('/')[4];

        if (data[neighbourhoodCode] == undefined) {
            var neighbourhood = {
                neighbourhood: neighbourhoodCode,
                airInfo: {}
            }
            data[neighbourhoodCode] = neighbourhood;
            listOfNeighbourhoods.push(neighbourhoodCode);
        }

        var neighbourhood = data[neighbourhoodCode];
        var substanceCode = measurement.Substance.value.split('/')[4];
        if (neighbourhood.airInfo[substanceCode] == undefined) {
            var substance = [
                [[], [], [], [], [], [], [], [], [], [], [], []],
                [[], [], [], [], [], [], [], [], [], [], [], []]
            ]
            neighbourhood.airInfo[substanceCode] = substance;
        }

        var substance = neighbourhood.airInfo[substanceCode];

        var time = measurement.Time.value.split('-');
        var year = parseInt(time[0]);
        if (year == 2018) {
            year = 1;
        }
        else {
            year = 0;
        }
        var month = parseInt(time[1]) - 1;

        substance[year][month].push(parseFloat(measurement.Average.value))
    });
}

$.ajax({
    crossDomain: true,
    dataType: 'jsonp',
    url: "http://localhost:8890/sparql?query=" + encodeURIComponent(ourDataQuery) + "&format=json",
    success: (_data) => {
        //console.log('Success receives', JSON.parse(JSON.stringify(_data)));
        treatData(_data);

        Object.keys(data).forEach((neighbourhoodCode) => {
            var neighbourhood = data[neighbourhoodCode];

            Object.keys(neighbourhood.airInfo).forEach((substanceCode) => {
                Object.keys(neighbourhood.airInfo[substanceCode]).forEach((year) => {
                    if (neighbourhood.airInfo[substanceCode][year] != undefined) {
                        Object.keys(neighbourhood.airInfo[substanceCode][year]).forEach((month) => {
                            var valuesForMonth = neighbourhood.airInfo[substanceCode][year][month];

                            if (neighbourhood.airInfo[substanceCode][year][month] != undefined && neighbourhood.airInfo[substanceCode][year][month].length != 0) {
                                var average = 0;

                                valuesForMonth.forEach((value) => {
                                    average += value;
                                });

                                average /= valuesForMonth.length;

                                neighbourhood.airInfo[substanceCode][year][month] = average;
                            }
                            else {
                                neighbourhood.airInfo[substanceCode][year][month] = 0;
                            }

                        })
                    }
                    else {
                    }


                })
            })
        })












        var neighbourhoodDataQuery = [
            "SELECT distinct ?neighbourhoodcode ?name ?population ?area ?imageURI",
            "WHERE {",
            "?neighbourhoodcode wdt:P31 wd:Q3032114.",
            "?neighbourhoodcode wdt:P1082 ?population.",
            "?neighbourhoodcode wdt:P2046 ?area.",
            "?neighbourhoodcode rdfs:label ?name.",
            "FILTER (lang(?name) in ('es')).",
            "OPTIONAL { ?neighbourhoodcode wdt:P18 ?imageURI. }",
            "}"
        ].join(" ");
        $.ajax({
            url: "https://query.wikidata.org/sparql?query=" + encodeURIComponent(neighbourhoodDataQuery) + "&format=json",
            success: function (_data) {
                _data.results.bindings.forEach((wdNeigh) => {
                    Object.keys(data).forEach((neighbourhoodCode) => {
                        var neighbourhood = data[neighbourhoodCode];
                        if ("http://www.wikidata.org/entity/" + neighbourhood.neighbourhood == wdNeigh.neighbourhoodcode.value) {
                            neighbourhood.neighbourhoodInfo = {};
                            neighbourhood.neighbourhoodInfo.population = parseInt(wdNeigh.population.value);
                            neighbourhood.neighbourhoodInfo.area = parseFloat(wdNeigh.area.value);
                            neighbourhood.neighbourhoodInfo.name = wdNeigh.name.value;
                            if (wdNeigh.imageURI != undefined) {
                                neighbourhood.neighbourhoodInfo.imageURI = wdNeigh.imageURI.value;
                            }
                            $("#populate").after('<li><div class="collapsible-header"><i class="material-icons">location_city</i>'
                            +neighbourhood.neighbourhoodInfo.name
                            +'</div><div class="collapsible-body"><span>'
                            +'<img class="circle" src="'+neighbourhood.neighbourhoodInfo.imageURI+'" width="200" height="200"><br><br>'
                            +'Population: '+neighbourhood.neighbourhoodInfo.population+' citizens.<br>'
                            +'Area:  '+neighbourhood.neighbourhoodInfo.area+' km².<br>'
                            +'</span></div></li>');
                        }
                    });
                });
            },
            async: false
        });







    },
    async: false
});












$(document).ready(function () {
    $('.collapsible').collapsible();
    console.log(data);
});
