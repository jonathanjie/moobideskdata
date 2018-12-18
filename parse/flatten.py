from flatten_json import flatten
import json
import csv

source_file = open("moobi.json", "r")
data = json.load(source_file)

# the line below flattens both the keys "conversation" and "contact" in the "records" array
rows = [flatten(conversation) for conversation in data["records"]]

# with open("test.json", "w") as output_json:
# 	json.dump(rows, output_json)

with open("moobi.csv", "w") as output_csv:
	fields = ["_id", "direction", "conversation__id", "conversation_name", "conversation_status", "conversation_updater", 
				"conversation_creator", "conversation_updatedAt", "conversation_createdAt", "conversation_hide", "conversation_lastMessageDir",
				"conversation_lastMessageTS", "conversation_lastMessage", "conversation_fbId", "conversation_moApi", "contact__id", "contact_name", 
				"contact_telegramId", "contact_fbId", "contact_mobile", "contact_status", "contact_updater", "contact_creator",
				"contact_updatedAt", "contact_createdAt", "contact_hasDuplicate", "contact_favorite", "contact_image", "channel",
				"moLog", "message", "status", "updater", "creator", "updatedAt", "createdAt", "mtCount", "hasAttachments"]
	writer = csv.DictWriter(output_csv, fieldnames = fields)

	for row in rows:
		writer.writerow(row)