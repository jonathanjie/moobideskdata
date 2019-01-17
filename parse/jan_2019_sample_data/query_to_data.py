import csv

def convert_query(source, output, fields):
    source_csv = open(source, "r")
    loaded_csv = csv.DictReader(source_csv)

    output_csv = open(output, "w")
    writer = csv.DictWriter(output_csv, fields)
    writer.writeheader()

    agentsText = set()
    agentsVoice = set()
    agentsEmail = set()
    convosText = set()
    convosVoice = set()
    convosEmail = set()

    temp_loaded_csv = loaded_csv
    first_line = next(temp_loaded_csv)
    prev_year = first_line["year"]
    prev_month = first_line["month"]
    prev_day = first_line["day"]
    prev_hour = first_line["hour"]
    for row in loaded_csv:
        d = {}
        cur_year = row["year"]
        cur_month = row["month"]
        cur_day = row["day"]
        cur_hour = row["hour"]

        if (prev_hour != cur_hour):
            d["year"] = prev_year
            d["month"] = prev_month
            d["day"] = prev_day
            d["hour"] = prev_hour
            d["numAgentsText"] = len(agentsText)
            d["numAgentsVoice"] = len(agentsVoice)
            d["numAgentsEmail"] = len(agentsEmail)
            d["numAgentsTextEmail"] = len(agentsText) + len(agentsEmail)
            d["numAgentsTextVoice"] = len(agentsText) + len(agentsVoice)
            d["numAgentsVoiceEmail"] = len(agentsVoice) + len(agentsEmail)
            d["numAgentsTextVoiceEmail"] = len(agentsText) + len(agentsVoice) + len(agentsEmail)
            d["numConvosText"] = len(convosText)
            d["numConvosVoice"] = len(convosVoice)
            d["numConvosEmail"] = len(convosEmail)
            d["numConvosTextEmail"] = len(agentsText) + len(agentsEmail)
            d["numConvosTextVoice"] = len(agentsText) + len(agentsVoice)
            d["numConvosVoiceEmail"] = len(agentsVoice) + len(agentsEmail)
            d["numConvosTextVoiceEmail"] = len(agentsText) + len(agentsVoice) + len(agentsEmail)
            writer.writerow(d)
            
            agentsText = set()
            agentsVoice = set()
            agentsEmail = set()
            convosText = set()
            convosVoice = set()
            convosEmail = set()

        if (row["channel"] == "Telegram" or row["channel"] == "SMS" or row["channel"] == "Facebook" or row["channel"] == "Web Chat" or row["channel"] == "Twitter" or row["channel"] == "Instagram" or row["channel"] == "WhatsApp" or row["channel"] == "Line"):
            agentsText.add(row["agent"])
            convosText.add(row["conversation_key"])

        if (row["channel"] == "Voice"):
            agentsVoice.add(row["agent"])
            convosVoice.add(row["conversation_key"])

        if (row["channel"] == "Email"):
            agentsEmail.add(row["agent"])
            convosEmail.add(row["conversation_key"])

        prev_year = cur_year
        prev_month = cur_month
        prev_day = cur_day
        prev_hour = cur_hour

if __name__ == "__main__":
    fields = ["year", "month", "day", "hour", "numAgentsText", "numAgentsVoice", "numAgentsEmail", "numAgentsTextEmail",
                "numAgentsTextVoice", "numAgentsVoiceEmail", "numAgentsTextVoiceEmail", "numConvosText", "numConvosVoice",
                "numConvosEmail", "numConvosTextEmail", "numConvosTextVoice", "numConvosVoiceEmail", "numConvosTextVoiceEmail"]
    convert_query("./query_result.csv", "./data.csv", fields = fields)
