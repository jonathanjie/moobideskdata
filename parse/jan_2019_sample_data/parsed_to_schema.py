from flatten_json import flatten
import json
import csv
import time
import dateutil.parser

def convert(source, fields, timerows):
    source_file = open(source + ".json", "r")
    data = json.load(source_file)

    with open(source + "_parsed.csv", "w") as output_csv:
        writer = csv.DictWriter(output_csv, fieldnames = fields)
        writer.writeheader()
        print(source)
        for row in data:
            format = '%Y-%m-%d %H:%M:%S'
            for timerow in timerows:
                dt = dateutil.parser.parse(row[timerow])
                row[timerow] = dt.strftime(format)
            writer.writerow(row)

def main():
    sources = ["agents", "channeltypes", "chats", "conversations", "conversationslalogs", "dispositions"]
    fields = [["_id", "key", "channelTypesRep", "bot", "botName", "user", "campaign", "type", "status", "updater", "creator", "updatedAt", "createdAt", "awsAgent", "supervisor", "manager", "channelTypes", "concurrent", "__v", "auxcode", "remarks", "uuid"],
              ["_id", "name", "logo", "status", "updater", "creator", "updatedAt", "createdAt", "__v"],
              ["_id", "message", "direction", "channel", "queue", "agent", "conversation", "conversationKey", "service", "disposition", "subject", "contact", "channelAccount", "channelType", "to", "from", "mtStatus", "moLog", "refId", "type", "status", "updater", "creator", "updatedAt", "createdAt", "mtCount", "attachments", "hasAttachments", "__v", "mtLogId"],
              ["_id", "campaign", "contact", "key", "agent", "lastMessageChannelType", "lastMessageChannelAccount", "lastMessageFrom", "lastMessageDir", "status", "updater", "creator", "updatedAt", "createdAt", "nextStatusTime", "closedTime", "__v", "firstMessageChat", "lastMessageChat", "conversationStatus", "key", "lastSLA", "type", "callId", "abandoned", "queue", "agent", "lastMessageTo", "disposition"],
              ["_id", "agent", "serviceLevelAggrement", "conversation", "status", "updater", "creator", "updatedAt", "createdAt", "isSlaSuccess", "__v"],
              ["_id", "key", "name" , "queue", "status", "updater", "creator", "updatedAt", "createdAt", "__v"]]
    timerows = [["createdAt", "updatedAt"],
                ["createdAt", "updatedAt"],
                ["createdAt", "updatedAt"],
                ["createdAt", "updatedAt", "nextStatusTime", "closedTime"],
                ["createdAt", "updatedAt"],
                ["createdAt", "updatedAt"]]

    for i in range(len(sources)):
        convert(source = sources[i], fields = fields[i], timerows = timerows[i])

if __name__ == "__main__":
    main()
