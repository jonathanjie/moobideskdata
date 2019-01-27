import csv
import datetime
import calendar
import numpy as np
import math
import pandas as df

def parseForecastQuery(inputFile, outputFile, fields, startMonth, startYear, endMonth):
    fillMissingHours(inputFile, outputFile, fields)
    data = np.genfromtxt(outputFile, delimiter=',')

    for month in range(startMonth, endMonth):
        lastSunday = getDateLastSundayMonth(month, startYear)
        lastMonday = lastSunday - 6

        mondayIdx = -1

        # look for Monday idx data
        for idx, row in enumerate(data):
            if row[0] == startYear and row[1] == month and row[2] == lastMonday:
                mondayIdx = idx
                break
            
        avg8 = getMeanAvgMins(8, mondayIdx, data)
        avg9 = getMeanAvgMins(9, mondayIdx, data)
        avg10 = getMeanAvgMins(10, mondayIdx, data)
        avg11 = getMeanAvgMins(11, mondayIdx, data)

        avg12 = getMeanAvgMins(12, mondayIdx, data)
        avg13 = getMeanAvgMins(13, mondayIdx, data)
        avg14 = getMeanAvgMins(14, mondayIdx, data)
        avg15 = getMeanAvgMins(15, mondayIdx, data)

        avg16 = getMeanAvgMins(16, mondayIdx, data)
        avg17 = getMeanAvgMins(17, mondayIdx, data)
        avg18 = getMeanAvgMins(18, mondayIdx, data)
        avg19 = getMeanAvgMins(19, mondayIdx, data)
        
        avg20 = getMeanAvgMins(20, mondayIdx, data)
        avg21 = getMeanAvgMins(21, mondayIdx, data)
        avg22 = getMeanAvgMins(22, mondayIdx, data)
        avg23 = getMeanAvgMins(23, mondayIdx, data)

        avg24 = getMeanAvgMins(24, mondayIdx, data)
        avg25 = getMeanAvgMins(25, mondayIdx, data)
        avg26 = getMeanAvgMins(26, mondayIdx, data)
        avg27 = getMeanAvgMins(27, mondayIdx, data)

        avg28 = getMeanAvgMins(28, mondayIdx, data)
        avg29 = getMeanAvgMins(29, mondayIdx, data)
        avg30 = getMeanAvgMins(30, mondayIdx, data)
        avg31 = getMeanAvgMins(31, mondayIdx, data)

        avg32 = getMeanAvgMins(32, mondayIdx, data)
        avg33 = getMeanAvgMins(33, mondayIdx, data)

        foundMonth = False

        for row in data:
            if row[0] == startYear and row[1] == month:
                foundMonth = True
                if math.isnan(row[8]):
                    row[8] = avg8
                if math.isnan(row[9]):
                    row[9] = avg9
                if math.isnan(row[10]):
                    row[10] = avg10
                if math.isnan(row[11]):
                    row[11] = avg11
                if math.isnan(row[12]):
                    row[12] = avg12
                if math.isnan(row[13]):
                    row[13] = avg13
                if math.isnan(row[14]):
                    row[14] = avg14
                if math.isnan(row[15]):
                    row[15] = avg15
                if math.isnan(row[16]):
                    row[16] = avg16
                if math.isnan(row[17]):
                    row[17] = avg17
                if math.isnan(row[18]):
                    row[18] = avg18
                if math.isnan(row[19]):
                    row[19] = avg19
                if math.isnan(row[20]):
                    row[20] = avg20
                if math.isnan(row[21]):
                    row[21] = avg21
                if math.isnan(row[22]):
                    row[22] = avg22
                if math.isnan(row[23]):
                    row[23] = avg23
                if math.isnan(row[24]):
                    row[24] = avg24
                if math.isnan(row[25]):
                    row[25] = avg25
                if math.isnan(row[26]):
                    row[26] = avg26
                if math.isnan(row[27]):
                    row[27] = avg27
                if math.isnan(row[28]):
                    row[28] = avg28
                if math.isnan(row[29]):
                    row[29] = avg29
                if math.isnan(row[30]):
                    row[30] = avg30
                if math.isnan(row[31]):
                    row[31] = avg31
                if math.isnan(row[32]):
                    row[32] = avg32
                if math.isnan(row[33]):
                    row[33] = avg33
    
            elif foundMonth == True:
                break

    df = pd.DataFrame(data.astype(float), index=)
    np.savetxt('testingout.csv', data.astype(float), '%5.2f', delimiter=',')

def getMeanAvgMins(index, mondayIdx, data):
    sum = 0
    counter = 0

    for i in range(mondayIdx, mondayIdx + 168):
        if not math.isnan(data[i][index]):
            sum += data[i][index]
            counter += 1

    if counter != 0:
        avg = sum/counter
    else:
        avg = 0

    return avg
        





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
    #print(first_line)

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

                #d['textAvgMins'] = -1
                # d['emailAvgMins'] = 0
                # d['voiceAvgMins'] = 0

                # d['textAvgChatsPerConvo'] = -1
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



# # get avg from start_day until end_day inclusive
# def getAvgInWeek(field, year, month, start_day, end_day):
#     for ()


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
    parseForecastQuery('./test.csv', './output.csv', fields, 7, 2018, 12)








