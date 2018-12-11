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