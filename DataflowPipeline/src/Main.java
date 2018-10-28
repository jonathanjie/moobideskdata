
import org.bson.BsonArray;
import org.bson.BsonValue;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;

import java.io.*;
import java.util.*;

import static java.util.Arrays.asList;

public class Main {

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
        HashMap<Integer, HashSet<String>> numAgentsInHour = new HashMap<>();

        // read through all chats.json
        final CodecRegistry codecRegistry = CodecRegistries.fromProviders(asList(new ValueCodecProvider(),
                new BsonValueCodecProvider(),
                new DocumentCodecProvider()));

        JsonReader reader = new JsonReader(jsonText);
        BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

        BsonArray docArray = arrayReader.decode(reader, DecoderContext.builder().build());

        for (BsonValue doc : docArray.getValues()) {
            //System.out.println(doc);
//            if (doc.asDocument().get("agent"))
            System.out.println(doc.asDocument().get("createdAt").asDateTime());
        }
//
//        Document doc = Document.parse(text);
//
//        System.out.println(doc.toJson());
    }
}
