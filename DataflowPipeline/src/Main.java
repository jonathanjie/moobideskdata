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

    public static final String OUTPUT_FILE_PATH = "E:/Moobidesk/Moobidesk/moobideskdata/DataflowPipeline/output.txt";

    private static String toDateHourString(Date date) {
        String dateHour = "Month: " + Integer.toString(date.getMonth()) + " Date: " + Integer.toString(date.getDate())
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
        TreeMap<String, Integer> messagesEveryHour = new TreeMap<>();

        // read through all chats.json
        final CodecRegistry codecRegistry = CodecRegistries.fromProviders(asList(new ValueCodecProvider(),
                new BsonValueCodecProvider(),
                new DocumentCodecProvider()));

        JsonReader reader = new JsonReader(jsonText);
        BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

        BsonArray docArray = arrayReader.decode(reader, DecoderContext.builder().build());

        for (BsonValue document : docArray.getValues()) {
            //System.out.println(doc);
            long milliseconds = document.asDocument().get("createdAt").asDateTime().getValue();
            Date date = new Date(milliseconds);

            DateFormat simple = new SimpleDateFormat("dd MMM yyyy HH:mm:ss:SSS Z");

            Integer val = messagesEveryHour.get(toDateHourString(date));

            if (val != null)
                messagesEveryHour.put(toDateHourString(date), val + 1);
            else
                messagesEveryHour.put(toDateHourString(date), 1);

        }

        StringBuilder lineContent = new StringBuilder();
        for (Map.Entry<String, Integer> entry : messagesEveryHour.entrySet()) {
            lineContent.append(entry.getKey()).append(" Number of messages: ").append(entry.getValue()).append("\n");
        }

        BufferedWriter writer = new BufferedWriter(new FileWriter(OUTPUT_FILE_PATH));
        System.out.println("Printing");
        writer.write(lineContent.toString());
        writer.close();

//        Document doc = Document.parse(text);
//
//        System.out.println(doc.toJson());
    }
}
