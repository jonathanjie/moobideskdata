import org.bson.BsonArray;
import org.bson.BsonValue;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

import static java.util.Arrays.asList;

public class Main {

    private static final String OUTPUT_FILE_PATH = "E:/Moobidesk/Moobidesk/moobideskdata/DataflowPipeline/outputUpdatedAt.txt";
    private static final String INPUT_JSON_FILE_NAME = "newChats.json";

    private static String toDateHourString(Date date) {
        return "Month: " + Integer.toString(date.getMonth()) + " Date: " + Integer.toString(date.getDate())
                + " Hour: " + Integer.toString(date.getHours());
    }

    private boolean compareDateHour(Date date1, Date date2) {
        if (date1.getYear() == date2.getYear() && date1.getMonth() == date2.getMonth()) {
            if (date1.getDate() == date2.getDate() && date1.getHours() == date2.getHours()) {
                return true;
            }
        }

        return false;
    }

    private static void convertJsonToArray(String jsonText) throws IOException {
        String arrStrings[] = jsonText.split("}");

        for (int i = 0; i < arrStrings.length - 2; i++) {
            arrStrings[i] +=  "},";
        }

        arrStrings[arrStrings.length - 2] += "}]";

        StringBuilder jsonFinalText = new StringBuilder();
        for (String str : arrStrings) {
            jsonFinalText.append(str);
        }

        jsonFinalText.insert(0, "[");

        // to write big files
        FileOutputStream fos = new FileOutputStream(INPUT_JSON_FILE_NAME);
        OutputStreamWriter w = new OutputStreamWriter(fos, StandardCharsets.UTF_8);
        BufferedWriter bw = new BufferedWriter(w);

        bw.write(jsonFinalText.toString());
        bw.flush();
        bw.close();
    }

    public static void main(String[] args) throws IOException {
        // take all text and put it into a string
        Scanner scanner = new Scanner(new File(INPUT_JSON_FILE_NAME));
        String jsonText = scanner.useDelimiter("\\A").next();
        scanner.close();

        TreeMap<String, Integer> messagesEveryHour = new TreeMap<>();

        // read through all chats.json
        final CodecRegistry codecRegistry = CodecRegistries.fromProviders(asList(new ValueCodecProvider(),
                new BsonValueCodecProvider(), new DocumentCodecProvider()));

        JsonReader reader = new JsonReader(jsonText);
        BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

        BsonArray docArray = arrayReader.decode(reader, DecoderContext.builder().build());

        for (BsonValue document : docArray.getValues()) {
            //System.out.println(doc);
            ObjectId id = document.asDocument().get("_id").asObjectId().getValue();
            System.out.println(id.toString());
            long milliseconds = document.asDocument().get("updatedAt").asDateTime().getValue();
            Date date = new Date(milliseconds);

//            DateFormat simple = new SimpleDateFormat("dd MMM yyyy HH:mm:ss:SSS Z");

            // calculate messagesEveryHour
            Integer val = messagesEveryHour.get(toDateHourString(date));

            if (val != null)
                messagesEveryHour.put(toDateHourString(date), val + 1);
            else
                messagesEveryHour.put(toDateHourString(date), 1);


            // calculate 
        }

        int totalChats = 0;
        StringBuilder lineContent = new StringBuilder();
        for (Map.Entry<String, Integer> entry : messagesEveryHour.entrySet()) {
            lineContent.append(entry.getKey()).append(" Number of messages: ").append(entry.getValue()).append("\n");
            totalChats += entry.getValue();
        }

        BufferedWriter writer = new BufferedWriter(new FileWriter(OUTPUT_FILE_PATH));
        System.out.println("Total chats: " + Integer.toString(totalChats));
        writer.write(lineContent.toString());
        writer.close();

//        Document doc = Document.parse(text);
//
//        System.out.println(doc.toJson());
    }
}
