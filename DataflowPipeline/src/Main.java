import org.bson.BsonArray;
import org.bson.BsonValue;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;

import java.io.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

import static java.util.Arrays.asList;

public class Main {

    private static String toDateHourString(Date date) {
        String dateHour = Integer.toString(date.getMonth()) + " Date: " + Integer.toString(date.getDate())
                + " Hour: " + Integer.toString(date.getHours());
        return dateHour;
    }

    private boolean compareDateHour(Date date1, Date date2) {
        if (date1.getYear() == date2.getYear() && date1.getMonth() == date2.getMonth()) {
            if (date1.getDate() == date2.getDate() && date1.getHours() == date2.getHours()) {
                return true;
            }
        }

        return false;
    }

    public static void main(String[] args) throws IOException {
        String path = "newChats.json";

        // take all text and put it into a string
        Scanner scanner = new Scanner(new File(path));
        String jsonText = scanner.useDelimiter("\\A").next();
        scanner.close();

//        String arrStrings[] = jsonText.split("}");
//
//        for (int i = 0; i < arrStrings.length - 2; i++) {
//            arrStrings[i] +=  "},";
//        }
//
//        arrStrings[arrStrings.length - 2] += "}]";
//
//        String jsonFinalText = "";
//        for (String str : arrStrings) {
//            jsonFinalText += str;
//        }
//
//        jsonFinalText = "[" + jsonFinalText;
//
//        // to write big files
//        FileOutputStream fos = new FileOutputStream("newChats.json");
//        OutputStreamWriter w = new OutputStreamWriter(fos, "UTF-8");
//        BufferedWriter bw = new BufferedWriter(w);
//
//        bw.write(jsonFinalText);
//        bw.flush();
//        bw.close();

        //System.out.println(jsonFinalText);
        Hashtable<String, Integer> numAgentsInHour = new Hashtable<>();

        // read through all chats.json
        final CodecRegistry codecRegistry = CodecRegistries.fromProviders(asList(new ValueCodecProvider(),
                new BsonValueCodecProvider(),
                new DocumentCodecProvider()));

        JsonReader reader = new JsonReader(jsonText);
        BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

        BsonArray docArray = arrayReader.decode(reader, DecoderContext.builder().build());

        int hourIndex = 0;
        for (BsonValue document : docArray.getValues()) {
            //System.out.println(doc);
            long milliseconds = document.asDocument().get("createdAt").asDateTime().getValue();
            Date date = new Date(milliseconds);

            DateFormat simple = new SimpleDateFormat("dd MMM yyyy HH:mm:ss:SSS Z");

            Integer val = numAgentsInHour.get(toDateHourString(date));

            if (val != null)
                numAgentsInHour.put(toDateHourString(date), val + 1);
            else
                numAgentsInHour.put(toDateHourString(date), 1);

        }

        for (Map.Entry<String, Integer> entry : numAgentsInHour.entrySet()) {
            System.out.println(entry.getKey() + " Value: " + entry.getValue());
        }



//        Document doc = Document.parse(text);
//
//        System.out.println(doc.toJson());
    }
}
