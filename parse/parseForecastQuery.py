import csv

def calculate_two_week_avg(csvFile):
    csv_file = open('forecastQuery.csv', mode='r'):
    csv_reader = csv.DictReader(csv_file)

    for row in csv_reader:
        
