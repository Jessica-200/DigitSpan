import datetime

import os
import csv

rawPath = 'data/raw_data.csv'
rawHeaders = ['user', 'raw_data_sequences', 'started_at', 'finished_at']

def getTimeDate(milisec):
    utcTime = datetime.datetime.fromtimestamp(milisec / 1000.0, tz = datetime.timezone.utc)
    offSetTime = datetime.timedelta(hours = -8)
    return utcTime + offSetTime

def writeToRawFile(rawInfo, user, start, end):
    fileExists = os.path.exists(rawPath) and os.stat(rawPath).st_size > 0

    with open(rawPath, 'a', newline='') as file:
        csvWriter = csv.DictWriter(file, fieldnames = rawHeaders)

        if not fileExists:
            csvWriter.writeheader()

        csvWriter.writerow({'user': user, 'raw_data_sequences': rawInfo, 'started_at': start, 'finished_at': end})

def transferToRawData(c_info, r_info, currUser):
    sizeOfRoundInfo = len(r_info)
    trueStartTime = r_info[0]['sequenceStart']
    trueEndTime = 0
    currentClickIndex = 0

    for i in range(0, sizeOfRoundInfo - 1):
        nextSequenceStart = r_info[i + 1]['sequenceStart']
        r_info[i]['clickInfo'] = []

        while c_info[currentClickIndex]['time'] < nextSequenceStart:
             r_info[i]['clickInfo'].append(c_info[currentClickIndex])
             currentClickIndex += 1

    r_info[sizeOfRoundInfo - 1]['clickInfo'] = []

    for i in range(currentClickIndex, len(c_info)):
        if (i == len(c_info) - 1):
            trueEndTime = c_info[i]['time']
            
        r_info[sizeOfRoundInfo - 1]['clickInfo'].append(c_info[i])

    trueStartTime = getTimeDate(trueStartTime)
    trueEndTime = getTimeDate(trueEndTime)

    writeToRawFile(r_info, currUser, trueStartTime, trueEndTime)