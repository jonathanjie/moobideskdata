import csv
import datetime
import calendar

def fillMissingHours(inputFile, outputFile, fields):
    csv_file = open(inputFile, mode='r')
    read_csv = csv.DictReader(csv_file, fields)

    output_csv = open(outputFile, mode='w', newline='')
    writer = csv.DictWriter(output_csv, fields)
    writer.writeheader()

    # temp loaded csv now reading first line (header)
    temp_loaded_csv = read_csv
    
    first_line = next(temp_loaded_csv) # gets headers
    first_line = next(temp_loaded_csv) # gets first line

    prev_year = int(first_line["year"])
    prev_month = int(first_line["month"])
    prev_day = int(first_line["day"])
    prev_hour = int(first_line["hour"])

    writer.writerow(first_line)
    for row in read_csv: 
        year = int(row["year"])
        month = int(row["month"])
        day = int(row["day"])
        hour = int(row["hour"])

        prev_date = datetime.datetime(year=prev_year, month=prev_month, day=prev_day, hour=prev_hour)
        curr_date = datetime.datetime(year=year, month=month, day=day, hour=hour)

        differenceHours = getDifferenceHours(prev_date, curr_date)
                
        if (differenceHours > 1):
            d = dict()

            temp_year = prev_year
            temp_month = prev_month
            temp_day = prev_day
            temp_hour = prev_hour

            ## empty hour
            for i in range(1, differenceHours):
                if temp_hour == 23:
                    monthLastDay = calendar.monthrange(temp_year, temp_month)[1]

                    if temp_day == monthLastDay:
                        # next year
                        if temp_month == 12:
                            temp_hour = 0
                            temp_day = 1
                            temp_month = 1
                            temp_year += 1
                        else:
                            # next month
                            temp_hour = 0
                            temp_day = 1
                            temp_month += 1

                    else:
                        # next day
                        temp_hour = 0
                        temp_day += 1
    
                else:
                    temp_hour += 1

                d['year'] = temp_year
                d['month'] = temp_month
                d['day'] = temp_day 
                d['hour'] = temp_hour
                
                d['numAgentsText'] = 0
                d['numAgentsVoice'] = 0
                d['numAgentsEmail'] = 0
                d['numAgentsTextEmail'] = 0
                d['numAgentsTextVoice'] = 0
                d['numAgentsVoiceEmail'] = 0
                d['numAgentsTextVoiceEmail'] = 0

                d['numConvosText'] = 0
                d['numConvosVoice'] = 0
                d['numConvosEmail'] = 0
                d['numConvosTextEmail'] = 0
                d['numConvosTextVoice'] = 0
                d['numConvosVoiceEmail'] = 0
                d['numConvosTextVoiceEmail'] = 0

                d['textSla'] = 0.0
                d['voiceSla'] = 0.0
                d['emailSla'] = 0.0
                
                writer.writerow(d)

        writer.writerow(row)

        prev_year = curr_date.year
        prev_month = curr_date.month
        prev_day = curr_date.day
        prev_hour = curr_date.hour

## date2 > date1
def getDifferenceHours(date1, date2):
    diff = date2 - date1
    days, seconds = diff.days, diff.seconds
    return days * 24 + seconds // 3600

if __name__ == '__main__':
    fields = ["year","month","day","hour","numAgentsText","numAgentsVoice","numAgentsEmail","numAgentsTextEmail","numAgentsTextVoice","numAgentsVoiceEmail","numAgentsTextVoiceEmail","numConvosText","numConvosVoice","numConvosEmail","numConvosTextEmail","numConvosTextVoice","numConvosVoiceEmail","numConvosTextVoiceEmail","textSla","voiceSla","emailSla"]
    fillMissingHours("rec.csv", "recommendation.csv", fields = fields)