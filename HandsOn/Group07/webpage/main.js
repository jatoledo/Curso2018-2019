$("#populate").html("");

var data = [];
data.push(
    {
        neighbourhood: "Q1763694"
    },
    {
        neighbourhood: "Q2002296"
    }
);

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
    success: function(_data) {
        // console.log(_data.results.bindings);
        _data.results.bindings.forEach((wdNeigh) => {
            data.forEach((neighbourhood) => {
                if ("http://www.wikidata.org/entity/" + neighbourhood.neighbourhood == wdNeigh.neighbourhoodcode.value) {
                    neighbourhood.neighbourhoodInfo = {};
                    neighbourhood.neighbourhoodInfo.population = parseInt(wdNeigh.population.value);
                    neighbourhood.neighbourhoodInfo.area = parseFloat(wdNeigh.area.value);
                    neighbourhood.neighbourhoodInfo.name = wdNeigh.name.value;
                    neighbourhood.neighbourhoodInfo.imageURI = wdNeigh.imageURI.value;
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



$(document).ready(function(){
    $('.collapsible').collapsible();
    console.log(data);
  });
