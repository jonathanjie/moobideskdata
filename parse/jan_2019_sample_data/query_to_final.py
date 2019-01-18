from __future__ import division
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
    slaText = set()
    slaVoice = set()
    slaEmail = set()

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
            d["numConvosTextEmail"] = len(convosText) + len(convosEmail)
            d["numConvosTextVoice"] = len(convosText) + len(convosVoice)
            d["numConvosVoiceEmail"] = len(convosVoice) + len(convosEmail)
            d["numConvosTextVoiceEmail"] = len(convosText) + len(convosVoice) + len(convosEmail)

            if (len(convosText) != 0):
                d["textSla"] = len(slaText) / (len(convosText))
            else:
                d["textSla"] = "~"

            if (len(convosVoice) != 0):
                if (len(slaVoice) != len(convosVoice)):
                    print("SLA: " + str(len(slaVoice)))
                    print("Convos: " + str(len(convosVoice)))
                    print((len(slaVoice)) / (len(convosVoice)))
                d["voiceSla"] = (len(slaVoice)) / (len(convosVoice))
            else:
                d["voiceSla"] = "~"

            if (len(convosEmail) != 0):
                d["emailSla"] = (len(slaEmail)) / (len(convosEmail))
            else:
                d["emailSla"] = "~"
            
            writer.writerow(d)
            
            agentsText = set()
            agentsVoice = set()
            agentsEmail = set()
            convosText = set()
            convosVoice = set()
            convosEmail = set()
            slaText = set()
            slaVoice = set()
            slaEmail = set()

        if (row["channel"] == "Telegram" or row["channel"] == "SMS" or row["channel"] == "Facebook" or row["channel"] == "Web Chat" or row["channel"] == "Twitter" or row["channel"] == "Instagram" or row["channel"] == "WhatsApp" or row["channel"] == "Line"):
            agentsText.add(row["agent"])
            if (row["abandoned"] == "false" or row["abandoned"] == ""):
                convosText.add(row["conversation_key"])
                if (row["sla"] == "true"):
                    slaText.add(row["conversation_key"])


        if (row["channel"] == "Voice"):
            agentsVoice.add(row["agent"])
            if (row["abandoned"] == "false" or row["abandoned"] == ""):
                convosVoice.add(row["conversation_key"])
                if (row["sla"] == "true"):
                    slaVoice.add(row["conversation_key"])

        if (row["channel"] == "Email"):
            agentsEmail.add(row["agent"])
            if (row["abandoned"] == "false" or row["abandoned"] == ""):
                convosEmail.add(row["conversation_key"])
                if (row["sla"] == "true"):
                    slaEmail.add(row["conversation_key"])

        prev_year = cur_year
        prev_month = cur_month
        prev_day = cur_day
        prev_hour = cur_hour

if __name__ == "__main__":
    fields = ["year", "month", "day", "hour", "numAgentsText", "numAgentsVoice", "numAgentsEmail", "numAgentsTextEmail",
                "numAgentsTextVoice", "numAgentsVoiceEmail", "numAgentsTextVoiceEmail", "numConvosText", "numConvosVoice",
                "numConvosEmail", "numConvosTextEmail", "numConvosTextVoice", "numConvosVoiceEmail", "numConvosTextVoiceEmail", "textSla", "voiceSla", "emailSla"]
    convert_query("./query_data/query_result.csv", "./final_recommendation.csv", fields = fields)
