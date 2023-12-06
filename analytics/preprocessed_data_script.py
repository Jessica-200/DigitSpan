import os 
import csv
import ast


prePath = 'data/preprocessed_data.csv'
preHeader = ['user', 'started_at', 'finished_at', 'sequence_type', 'sequence', 'user_input', 'total_reaction_time', 'accuracy', 'reaction_between_touches']

def findFirstAllowedClickIndex(clicks):
    index = 0;
    allowedToClick = clicks[index]['allowedToClick']
    while not allowedToClick:
        index += 1
        allowedToClick = clicks[index]['allowedToClick']
    return index

def findLastAllowedClickIndex(begin, clicks):
    index = begin
    while index < len(clicks) - 1:
        if clicks[index + 1]['allowedToClick']:
            index += 1
        else:
            break
    return index

def gatherUserInputData(sequenceInfo):
    sequenceType = 'Forward'
    if sequenceInfo['backwards']:
        sequenceType = 'Backward'
    else:
        sequenceType = 'Forward'

    sequence = sequenceInfo['sequence']
    userInput = sequenceInfo['userSequence']
    clickInfo = sequenceInfo['clickInfo']

    startIndex = findFirstAllowedClickIndex(clickInfo)
    endIndex = findLastAllowedClickIndex(startIndex, clickInfo)

    start = clickInfo[startIndex]['time']
    end = clickInfo[endIndex]['time']
    reactionTime = end - start

    if sequenceInfo['roundWin']:
        accuracy = "Passed"
    else:
        accuracy = "Failed"
    
    reactionTimeBetweenClicks = []
    if reactionTime != 0:
        for i in range(startIndex, endIndex):
            previousClick = clickInfo[i]['time']
            nextClick = clickInfo[i + 1]['time']
            reactionTimeBetweenClicks.append(nextClick - previousClick)
    
    return sequenceType, sequence, userInput, reactionTime, accuracy, reactionTimeBetweenClicks
    


def writeToPreData(name, sequences, start, end):
    fileExists = os.path.exists(prePath) and os.stat(prePath).st_size > 0
    with open(prePath, 'a', newline = '') as file:
        csvWriter = csv.DictWriter(file, fieldnames = preHeader)

        if not fileExists:
            csvWriter.writeheader()

        for i in sequences:
            seqType, seq, input, rTime, accu, rTimeBetweenClicks= gatherUserInputData(i)
            csvWriter.writerow({'user': name, 
                                'started_at': start, 
                                'finished_at': end, 
                                'sequence_type': seqType, 
                                'sequence': seq, 
                                'user_input': input, 
                                'total_reaction_time': rTime, 
                                'accuracy': accu, 
                                'reaction_between_touches': rTimeBetweenClicks})


def readFromRawData():
    with open('data/raw_data.csv', 'r') as file:
        reader = csv.DictReader(file, delimiter = ',')
        for row in reader:
            user = row['user']
            data = ast.literal_eval(row['raw_data_sequences'])
            startTime = row['started_at']
            endTime = row['finished_at']
            writeToPreData(user, data, startTime, endTime)
