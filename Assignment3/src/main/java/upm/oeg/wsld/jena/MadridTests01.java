package upm.oeg.wsld.jena;

import org.apache.jena.base.Sys;
import org.apache.jena.datatypes.xsd.XSDDateTime;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntClass;
import org.apache.jena.ontology.OntModelSpec;
import org.apache.jena.query.*;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.RDFNode;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.util.FileManager;
import org.apache.jena.util.iterator.ExtendedIterator;

import java.io.InputStream;
import java.io.ObjectStreamClass;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;

public class MadridTests01 {
    public static String ns = "http://www.group07.linkeddata.org/";
    public static String nsIndividual = ns + "individual/";
    public static String nsProperty = ns + "property#";
    public static String nsClass = ns + "class#";
    public static String ssn = "http://purl.oclc.org/NET/ssnx/ssn#";
    public static String sosa = "http://www.w3.org/ns/sosa/";

    public static void main(String args[]) {
//        String filename1 = "/home/luciano/syncthing/actualesUPM/semWeb/Curso2018-2019/HandsOn/Group07/rdf/measurements_2018_reduced-with-links-updated.ttl";
        String filename1 = "/home/luciano/syncthing/actualesUPM/semWeb/Curso2018-2019/HandsOn/Group07/rdf/measurements_2018-with-links-updated.ttl";
        String filename2 = "/home/luciano/syncthing/actualesUPM/semWeb/Curso2018-2019/HandsOn/Group07/rdf/stations-with-links-updated.ttl";

        // Create an empty model
        OntModel model = ModelFactory.createOntologyModel(OntModelSpec.RDFS_MEM);

        // ** TASK 5.1: Read the ontology from the given file **
        // Use the FileManager to find the input file
        InputStream in = FileManager.get().open(filename1);

        if (in == null)
            throw new IllegalArgumentException("File: " + filename1 + " not found");

        // Read the RDF/XML file
        model.read(in, null, "TTL");

        in = FileManager.get().open(filename2);

        if (in == null)
            throw new IllegalArgumentException("File: " + filename2 + " not found");

        model.read(in, null, "TTL");


//        OntClass observation = model.getOntClass(ssn+"Observation");

//        System.out.println(observation);

//        ExtendedIterator instances = observation.listInstances();

//        System.out.println("Instances of Observation");
//        while (instances.hasNext()) {
//            Resource instance = (Resource) instances.next();
//            System.out.println(instance.getURI());
//        }


        // ADDRESS
//        String queryString = "PREFIX ns: <" + ns + "> " +
//                "PREFIX ssn: <" + ssn + "> " +
//                "PREFIX sosa: <" + sosa + "> " +
//                "PREFIX nsprop: <" + nsProperty + "> " +
////                "SELECT ?observation ?sensor" +
//                "SELECT ?observation ?sensor ?address " +
//                "WHERE { " +
//                "?observation a ssn:Observation. " +
//                "?observation sosa:madeBySensor ?sensor. " +
//                "?sensor nsprop:address ?address. " +
//                "}";
//        Query query = QueryFactory.create(queryString);
//        QueryExecution qexec = QueryExecutionFactory.create(query, model) ;
//        ResultSet results = qexec.execSelect() ;
//
//        while (results.hasNext())
//        {
//            QuerySolution binding = results.nextSolution();
//            Resource observation = (Resource) binding.get("observation");
//            RDFNode address = binding.get("address");
//            Resource sensor = (Resource) binding.get("sensor");
//            System.out.println(observation.toString() + " is of sensor " + sensor.toString()  + " the value " + address.toString());
//        }






        // RESULT TIME
        String queryString = "PREFIX ns: <" + ns + "> " +
                "PREFIX ssn: <" + ssn + "> " +
                "PREFIX sosa: <" + sosa + "> " +
                "PREFIX nsprop: <" + nsProperty + "> " +
                "SELECT ?observation ?time " +
                "WHERE { " +
                "?observation a ssn:Observation. " +
                "?observation sosa:resultTime ?time. " +
                "}";
        Query query = QueryFactory.create(queryString);
        QueryExecution qexec = QueryExecutionFactory.create(query, model) ;
        ResultSet results = qexec.execSelect() ;

        while (results.hasNext())
        {
            QuerySolution binding = results.nextSolution();
            Resource observation = (Resource) binding.get("observation");
//            String address = (String) binding.getLiteral("address").getString();
            RDFNode time = binding.get("time");
//            System.out.println(time.asLiteral().get);
//            XSDDateTime time = binding.get("time").as(XSDDateTime);
//            String family = binding.getLiteral("family").getString();
//            Resource sensor = (Resource) binding.get("sensor");
//            Resource prop = (Resource) binding.get("prop");

//            + " and has as property " + prop.toString()
//            + " the value " + address.toString()

            Calendar cal = Calendar.getInstance();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.ENGLISH);
            try{
                cal.setTime(sdf.parse(time.asLiteral().toString()));// all done
//                System.out.println(time.asLiteral().toString() + "was parsed as " + cal.getTime().toString());
                String date = cal.get(cal.YEAR) + " " + (cal.get(cal.MONTH)+1);

                System.out.println(observation.toString() + " was taken on " + date);
            }
            catch (Exception e) {
                System.out.println("Could not parse date");
            }
//            System.out.println(prop.toString());
//            System.out.println(address.toString());
//            System.out.println(observation.getURI());
//            System.out.println(sensor.getURI());
        }


        // MONTH OF MEASUREMENT AND STATION

        // GET ALL MEASUREMENTS FOR MONTH AND STATION AND MAKE THE MEANS (via Sysout)

        // GET ALL MEASUREMENTS FOR MONTH AND STATION AND MAKE THE MEANS (making a new model). And save the model


        // ** TASK 5.2: Write the ontology **
        //model.write(System.out, "RDF/XML-ABBREV");
//        model.write(System.out, "TURTLE");

    }
}
