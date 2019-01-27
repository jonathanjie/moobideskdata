import csv
import datetime
import calendar
import numpy as np


def parseForecastQuery(inputFile, outputFile, fields):
    fillMissingHours(inputFile, outputFile, fields)
    data = np.genfromtxt(outputFile, delimiter=',')

    for row in data:
        


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
    print(first_line)

    #isFirst = True
    for row in read_csv: 
        # if isFirst:
        #     print(row)
        #     isFirst = False
        #     continue
        
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
                
                d['numConvo'] = 0
                d['chatNumConvos'] = 0
                d['emailNumConvos'] = 0
                d['voiceNumConvos'] = 0

                # d['textAvgMins'] = 0
                # d['emailAvgMins'] = 0
                # d['voiceAvgMins'] = 0

                # d['textAvgChatsPerConvo'] = 0
                # d['emailAvgChatsPerConvo'] = 0
                
                # d['dispositionChatPlanEnquiry'] = 0
                # d['dispositionChatNewSignUp'] = 0
                # d['dispositionChatGeneralSales'] = 0
                # d['dispositionChatSampleDisposition'] = 0
                # d['dispositionChatProductEnquiry'] = 0
                # d['dispositionChatGeneralEnquiry'] = 0
                # d['dispositionChatFeedback'] = 0

                # d['dispositionEmailPlanEnquiry'] = 0
                # d['dispositionEmailNewSignUp'] = 0
                # d['dispositionEmailGeneralSales'] = 0
                # d['dispositionEmailSampleDisposition'] = 0
                # d['dispositionEmailProductEnquiry'] = 0
                # d['dispositionEmailGeneralEnquiry'] = 0
                # d['dispositionEmailFeedback'] = 0

                # d['dispositionVoicePlanEnquiry'] = 0
                # d['dispositionVoiceNewSignUp'] = 0
                # d['dispositionVoiceGeneralSales'] = 0
                # d['dispositionVoiceSampleDisposition'] = 0
                # d['dispositionVoiceProductEnquiry'] = 0
                # d['dispositionVoiceGeneralEnquiry'] = 0
                # d['dispositionVoiceFeedback'] = 0
                
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

def getDateLastSundayMonth(month, year):
    return max(week[-1] for week in calendar.monthcalendar(year, month))

def getMeanAvgMins(contact_type, month, year):
    if contact_type == 'chat':

    elif contact_type == 'email':

    elif contact_type == 'voice':

    else:
        raise ValueError(contact_type, " is invalid, use chat/email/voice")

# get avg from start_day until end_day inclusive
def getAvgInWeek(field, year, month, start_day, end_day):
    for ()


if __name__ == "__main__":
    fields = ["year","month","day","hour","numConvo","chatNumConvos",
            "emailNumConvos","voiceNumConvos","textAvgMins","emailAvgMins","voiceAvgMins",
            "textAvgChatsPerConvo","emailAvgChatsPerConvo","dispositionChatPlanEnquiry","dispositionChatNewSignUp",
            "dispositionChatGeneralSales","dispositionChatSampleDisposition","dispositionChatProductEnquiry","dispositionChatGeneralEnquiry",
            "dispositionChatFeedback","dispositionEmailPlanEnquiry","dispositionEmailNewSignUp","dispositionEmailGeneralSales",
            "dispositionEmailSampleDisposition","dispositionEmailProductEnquiry","dispositionEmailGeneralEnquiry",
            "dispositionEmailFeedback","dispositionVoicePlanEnquiry","dispositionVoiceNewSignUp",
            "dispositionVoiceGeneralSales","dispositionVoiceSampleDisposition","dispositionVoiceProductEnquiry",
            "dispositionVoiceGeneralEnquiry","dispositionVoiceFeedback"]
    fillMissingHours('./test.csv', './output.csv', fields)








