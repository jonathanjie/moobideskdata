from flatten_json import flatten
import json
import csv
import time
import dateutil.parser

source_file = open("response.json", "r")
data = json.load(source_file)

# the line below flattens both the keys "conversation" and "contact" in the "records" array
rows = [flatten(conversation) for conversation in data["records"]]

with open("moobi-2.csv", "w") as output_csv:
	fields = ["_id", "direction", "conversation__id", "conversation_name", "conversation_email","conversation_status", "conversation_updater", 
				"conversation_creator", "conversation_updatedAt", "conversation_createdAt", "conversation_hide", "conversation_lastMessageDir",
				"conversation_lastMessageTS", "conversation_lastMessage", "conversation_fbId", "conversation_moApi", "contact__id", "contact_name", 
				"contact_telegramId", "contact_fbId", "contact_mobile", "contact_email", "contact_status", "contact_updater", "contact_creator",
				"contact_updatedAt", "contact_createdAt", "contact_hasDuplicate", "contact_favorite", "contact_image", "channel",
				"moLog", "subject", "message", "status", "updater", "creator", "updatedAt", "createdAt", "mtCount", "hasAttachments"]
	writer = csv.DictWriter(output_csv, fieldnames = fields)

	for row in rows:
		dt = dateutil.parser.parse(row["conversation_createdAt"])
		row["conversation_createdAt"] = dt.strftime('%Y-%m-%d %H:%M:%S')
		writer.writerow(row)