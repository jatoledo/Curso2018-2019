#http://localhost:8890/group07/
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX   pr: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX   ssn: <http://purl.oclc.org/NET/ssnx/ssn#> 

select ?Observation where {

  ?s pr:type ssn:Sensor.
  ?s rdfs:label ?Observation.
} 


----

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX   pr: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX   ssn: <http://purl.oclc.org/NET/ssnx/ssn#> 

select ?s where {

  ?s pr:type ssn:Observation.
 
  
} 

----

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX   pr: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX   ssn: <http://purl.oclc.org/NET/ssnx/ssn#>
PREFIX   sosa: <http://www.w3.org/ns/sosa/> 
PREFIX  property: <http://www.group07.linkeddata.org/property#>
select ?s ?o ?v ?IDstation ?name where {

  ?s pr:type ssn:Observation.
  ?s sosa:observedProperty ?o.
  ?o property:hasMetricValue ?v.
  ?o sosa:madeBySensor ?IDstation.
  BIND(URI(REPLACE(STR(?IDstation),"#","/")) AS ?p)
  ?p rdfs:label ?name .
  
}
-----
#falta revisar
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX   pr: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX   ssn: <http://purl.oclc.org/NET/ssnx/ssn#>
PREFIX   sosa: <http://www.w3.org/ns/sosa/> 
PREFIX  property: <http://www.group07.linkeddata.org/property#>

PREFIX  geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>

select ?position ?lat ?long ?o ?value ?IDstation ?name where {

  ?s pr:type ssn:Observation.
  ?s sosa:observedProperty ?o.
  ?o property:hasMetricValue ?value.
  ?o sosa:madeBySensor ?IDstation.
  BIND(URI(REPLACE(STR(?IDstation),"#","/")) AS ?p).
  ?p rdfs:label ?name .
  ?position geo:lat ?lat.
?position geo:long ?long. 
  
  
}
------------------
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX   pr: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX   ssn: <http://purl.oclc.org/NET/ssnx/ssn#>
PREFIX   sosa: <http://www.w3.org/ns/sosa/> 
PREFIX  property: <http://www.group07.linkeddata.org/property#>
select  ?Station  ?Date  ?Month  ("Febrero" as ?Mes) ?Substance  (group_concat(?obsProp) as ?obsProps)   where {
  
	 
   ?observation a ssn:Observation.
   ?observation sosa:observedProperty ?obsProp.
   ?observation sosa:resultTime ?Time.
   ?obsProp   property:hasSubstance  ?Substance.
   ?obsProp  property:hasMetricValue  ?Value.
   ?obsProp  sosa:madeBySensor  ?Station.

  FILTER(xsd:dateTime(?Time)>= "2017-02-01T00:00:00.000+01:00"^^xsd:dateTime &&  xsd:dateTime(?Time)< "2017-03-01T00:00:00.000+01:00"^^xsd:dateTime ).
  BIND(year(?Time) AS ?Date).
  BIND(month(?Time) AS ?Month).

} group by ?Station  ?Date  ?Month ?Substance

-----------------
select  distinct ?StationName  ?Address ?Neighbourhood ?Substance  ?Time (AVG(?Value) AS ?Average ) ?Lat  ?Lon where {
  
	?obsPr <http://www.group07.linkeddata.org/property#hasSubstance> ?Substance.
        ?observation <http://www.w3.org/ns/sosa/observedProperty>  ?obsPr.
        ?observation <http://www.w3.org/ns/sosa/resultTime> ?Time.
        ?Station  rdfs:label ?StationName.
        ?Station  <http://www.group07.linkeddata.org/property#address> ?Address.
        ?Station <http://www.w3.org/2003/01/geo/wgs84_pos#location> ?Location.
        ?Location <http://www.group07.linkeddata.org/property#neighbourhood> ?Neighbourhood.
        ?Location geo:lat ?Lat.
        ?Location geo:lat ?Lon.

  {
    select distinct ?Substance  ?Station ?Value where{
      ?observation a <http://purl.oclc.org/NET/ssnx/ssn#Observation>.
      ?observation <http://www.w3.org/ns/sosa/observedProperty> ?obsProp.
      ?obsProp <http://www.group07.linkeddata.org/property#hasSubstance> ?Substance. 
      ?obsProp <http://www.w3.org/ns/sosa/madeBySensor> ?Station.
      ?obsProp <http://www.group07.linkeddata.org/property#hasMetricValue> ?Value. 
    }group by  ?Station

  }

} group by ?StationName  ?Address ?Neighbourhood ?Substance ?Lat ?Lon ?Time  order by asc(?Time)
