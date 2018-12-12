$("#populate").html("");

var data = {};
var listOfNeighbourhoods = []
// data.push(
//     {
//         neighbourhood: "Q1763694"
//     },
//     {
//         neighbourhood: "Q2002296"
//     }
// );

var ourDataQuery = [
    "select  distinct ?StationName  ?Address ?Neighbourhood ?Substance  ?Time (AVG(?Value) AS ?Average ) ?Lat  ?Lon where {",
        "?obsPr <http://www.group07.linkeddata.org/property#hasSubstance> ?Substance.",
            "?observation <http://www.w3.org/ns/sosa/observedProperty>  ?obsPr.",
            "?observation <http://www.w3.org/ns/sosa/resultTime> ?Time.",
            "?Station  rdfs:label ?StationName.",
            "?Station  <http://www.group07.linkeddata.org/property#address> ?Address.",
            "?Station <http://www.w3.org/2003/01/geo/wgs84_pos#location> ?Location.",
            "?Location <http://www.group07.linkeddata.org/property#neighbourhood> ?Neighbourhood.",
            "?Location geo:lat ?Lat.",
            "?Location geo:lat ?Lon.",
      "{",
        "select distinct ?Substance  ?Station ?Value where{",
          "?observation a <http://purl.oclc.org/NET/ssnx/ssn#Observation>.",
          "?observation <http://www.w3.org/ns/sosa/observedProperty> ?obsProp.",
          "?obsProp <http://www.group07.linkeddata.org/property#hasSubstance> ?Substance. ",
          "?obsProp <http://www.w3.org/ns/sosa/madeBySensor> ?Station.",
          "?obsProp <http://www.group07.linkeddata.org/property#hasMetricValue> ?Value. ",
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
                [[],[],[],[],[],[],[],[],[],[],[],[]],
                [[],[],[],[],[],[],[],[],[],[],[],[]]
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

// treatData(JSON.parse('{ "head": { "link": [], "vars": ["StationName", "Address", "Neighbourhood", "Substance", "Time", "Average", "Lat", "Lon"] },"results": { "distinct": false, "ordered": true, "bindings": [  { "StationName": { "type": "literal", "value": "Casa de Campo" }	, "Address": { "type": "literal", "value": "Casa de Campo  (Terminal del Telef\u00E9rico)" }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q2017682" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Toluene" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "1.415014305328899" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4194" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4194" }},  { "StationName": { "type": "literal", "value": "Pza. del Carmen" }	, "Address": { "type": "literal", "value": "Plaza del Carmen esq. Tres Cruces. " }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q1763376" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Sulfur_dioxide" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "7.774116086463299" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4192" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4192" }},  { "StationName": { "type": "literal", "value": "Urb. Embajada" }	, "Address": { "type": "literal", "value": "C/ Ria\u00F1o (Barajas) " }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q807230" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Hydrocarbon" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "1.354983912948861" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4625" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4625" }},  { "StationName": { "type": "literal", "value": "Plaza Castilla" }	, "Address": { "type": "literal", "value": "Plaza Castilla (Canal)" }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q1766348" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Nitrous_oxide" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "84.834718145716549" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4656" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4656" }},  { "StationName": { "type": "literal", "value": "Ensanche de Vallecas" }	, "Address": { "type": "literal", "value": "Avda La Gavia / Avda. Las Suertes" }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q1947988" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Nitrogen_dioxide" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "39.517984348331608" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.3729" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.3729" }},  { "StationName": { "type": "literal", "value": "Pza. Fern\u00E1ndez Ladreda" }	, "Address": { "type": "literal", "value": " Pza. Fern\u00E1ndez Ladreda - Avda. Oporto" }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q953368" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Nitrogen_oxide" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "42.294579871757718" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.385" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.385" }},  { "StationName": { "type": "literal", "value": "Escuelas Aguirre" }	, "Address": { "type": "literal", "value": "Entre C/ Alcal\u00E1 y C/ O\u2019 Donell " }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q2002296" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Sulfur_dioxide" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "7.128171903109643" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4216" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4216" }},  { "StationName": { "type": "literal", "value": "Moratalaz" }	, "Address": { "type": "literal", "value": "Avd. Moratalaz  esq. Camino de los Vinateros" }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q2076109" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Nitrogen_dioxide" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "42.309270472159599" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4079" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4079" }},  { "StationName": { "type": "literal", "value": "Villaverde" }	, "Address": { "type": "literal", "value": "C/. Juan Pe\u00F1alver" }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q919536" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Nitrogen_dioxide" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "46.647739405635847" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.3471" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.3471" }},  { "StationName": { "type": "literal", "value": "Sanchinarro" }	, "Address": { "type": "literal", "value": "C/ Princesa de Eboli esq C/ Maria Tudor" }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q1928529" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Carbon_monoxide" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "0.340411111408659" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4942" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4942" }},  { "StationName": { "type": "literal", "value": "Escuelas Aguirre" }	, "Address": { "type": "literal", "value": "Entre C/ Alcal\u00E1 y C/ O\u2019 Donell " }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q2002296" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Hydrocarbon" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "1.559183005737902" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4216" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4216" }},' + 
//  '{ "StationName": { "type": "literal", "value": "Escuelas Aguirre" }	, "Address": { "type": "literal", "value": "Entre C/ Alcal\u00E1 y C/ O\u2019 Donell " }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q2002296" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Toluene" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "2.981734640449949" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4216" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4216" }},  { "StationName": { "type": "literal", "value": "Tres Olivos" }	, "Address": { "type": "literal", "value": "Plaza Tres Olivos " }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q656196" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Nitrogen_oxide" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "13.206482775483744" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.5006" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.5006" }},  { "StationName": { "type": "literal", "value": "El Pardo" }	, "Address": { "type": "literal", "value": "Avda. La Guardia" }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q656196" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Nitrous_oxide" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "25.186231289615215" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.5181" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.5181" }},  { "StationName": { "type": "literal", "value": "Barajas Pueblo" }	, "Address": { "type": "literal", "value": "C/. J\u00FApiter, 21 (Barajas) " }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q807230" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Ozone" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "47.143784270987491" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4769" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4769" }},  { "StationName": { "type": "literal", "value": "Barrio del Pilar" }	, "Address": { "type": "literal", "value": "Avd. Betanzos esq. C/  Monforte de Lemos " }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q656196" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Nitrogen_dioxide" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "40.846803028541116" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4782" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4782" }},  { "StationName": { "type": "literal", "value": "Farolillo" }	, "Address": { "type": "literal", "value": "Calle Farolillo - C/Ervigio" }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q1001991" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Nitrous_oxide" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "77.259139719002096" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.3948" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.3948" }},  { "StationName": { "type": "literal", "value": "Escuelas Aguirre" }	, "Address": { "type": "literal", "value": "Entre C/ Alcal\u00E1 y C/ O\u2019 Donell " }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q2002296" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Methane" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "1.430694963010795" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4216" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4216" }},  { "StationName": { "type": "literal", "value": "Mendez Alvaro" }	, "Address": { "type": "literal", "value": "C/ Juan de Mariana / Pza. Amanecer Mendez Alvaro" }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q2000929" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Nitrous_oxide" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "82.158967985130648" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.3981" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.3981" }},  { "StationName": { "type": "literal", "value": "Casa de Campo" }	, "Address": { "type": "literal", "value": "Casa de Campo  (Terminal del Telef\u00E9rico)" }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q2017682" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Benzene" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "0.346527977713745" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4194" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4194" }},  { "StationName": { "type": "literal", "value": "Parque del Retiro" }	, "Address": { "type": "literal", "value": "Paseo Venezuela- Casa de Vacas" }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q2002296" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Nitrogen_oxide" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "11.562156596500008" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4144" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4144" }},  { "StationName": { "type": "literal", "value": "Plaza Castilla" }	, "Address": { "type": "literal", "value": "Plaza Castilla (Canal)" }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q1766348" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Nitrogen_oxide" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "25.102991534903801" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4656" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4656" }},  { "StationName": { "type": "literal", "value": "Juan Carlos I" }	, "Address": { "type": "literal", "value": "Parque Juan Carlos I (frente oficinas mantenimiento)" }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q807230" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Nitrogen_oxide" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "11.811221048534221" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4653" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4653" }},' + 
//  '{ "StationName": { "type": "literal", "value": "Pza. Fern\u00E1ndez Ladreda" }	, "Address": { "type": "literal", "value": " Pza. Fern\u00E1ndez Ladreda - Avda. Oporto" }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q953368" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Carbon_monoxide" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "0.361392074012003" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.385" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.385" }},  { "StationName": { "type": "literal", "value": "Mendez Alvaro" }	, "Address": { "type": "literal", "value": "C/ Juan de Mariana / Pza. Amanecer Mendez Alvaro" }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q2000929" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Nitrogen_dioxide" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "41.163734321346264" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.3981" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.3981" }},  { "StationName": { "type": "literal", "value": "Escuelas Aguirre" }	, "Address": { "type": "literal", "value": "Entre C/ Alcal\u00E1 y C/ O\u2019 Donell " }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q2002296" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Carbon_monoxide" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "0.401587636790463" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4216" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4216" }},  { "StationName": { "type": "literal", "value": "Plaza Castilla" }	, "Address": { "type": "literal", "value": "Plaza Castilla (Canal)" }	, "Neighbourhood": { "type": "uri", "value": "http://www.wikidata.org/entity/Q1766348" }	, "Substance": { "type": "uri", "value": "http://dbpedia.org/resource/Nitrogen_dioxide" }	, "Time": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2017-01-01T00:00:00+01:00" }	, "Average": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#decimal", "value": "41.456615321821174" }	, "Lat": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4656" }	, "Lon": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#double", "value": "40.4656" }}]}}'));
treatData(result);

// Get means for every station for each neighbourhood
// data.forEach()
Object.keys(data).forEach((neighbourhoodCode) => {
    var neighbourhood = data[neighbourhoodCode];

    Object.keys(neighbourhood.airInfo).forEach((substanceCode) => {
        neighbourhood.airInfo[substanceCode].forEach((year) => {
            if (neighbourhood.airInfo[substanceCode][year] != undefined) {
                neighbourhood.airInfo[substanceCode][year].forEach((month) => {
                var valuesForMonth = neighbourhood.airInfo[substanceCode][year][month];

                if (neighbourhood.airInfo[substanceCode][year][month] != undefined) {
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
            
        })
    })
})


console.log(data);

// $.ajax({
//     url: "https://localhost:8890/sparql?query=" + encodeURIComponent(ourDataQuery) + "&format=json",
//     success: treatData,
//     async: false
// });






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
            // data.forEach((neighbourhood) => {
            //     if ("http://www.wikidata.org/entity/" + neighbourhood.neighbourhood == wdNeigh.neighbourhoodcode.value) {
            //         neighbourhood.neighbourhoodInfo = {};
            //         neighbourhood.neighbourhoodInfo.population = parseInt(wdNeigh.population.value);
            //         neighbourhood.neighbourhoodInfo.area = parseFloat(wdNeigh.area.value);
            //         neighbourhood.neighbourhoodInfo.name = wdNeigh.name.value;
            //         neighbourhood.neighbourhoodInfo.imageURI = wdNeigh.imageURI.value;
            //         $("#populate").after('<li><div class="collapsible-header"><i class="material-icons">location_city</i>'
            //         +neighbourhood.neighbourhoodInfo.name
            //         +'</div><div class="collapsible-body"><span>'
            //         +'<img class="circle" src="'+neighbourhood.neighbourhoodInfo.imageURI+'" width="200" height="200"><br><br>'
            //         +'Population: '+neighbourhood.neighbourhoodInfo.population+' citizens.<br>'
            //         +'Area:  '+neighbourhood.neighbourhoodInfo.area+' km².<br>'
            //         +'</span></div></li>');
            //     }
            // });
        });
    },
    async: false
});



$(document).ready(function(){
    $('.collapsible').collapsible();
    console.log(data);
  });
