import csv

f = open("test.csv", "r")
data_with_headers = list(csv.reader(f))

header = data_with_headers[0]
data = data_with_headers[1:]

print(header)
print(data)