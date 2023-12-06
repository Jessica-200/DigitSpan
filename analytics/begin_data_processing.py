import sys
import json

from raw_data_script import transferToRawData
from preprocessed_data_script import readFromRawData

currentUser = "User" + str(sys.argv[2])

if (len(sys.argv) == 3):
    with open(sys.argv[1], 'r') as file:
        json_content = file.read()
    try:
        data = json.loads(json_content)
        clicks_info = data['clicks']
        round_info = data['roundInfoArray']
        transferToRawData(clicks_info, round_info, currentUser)
        readFromRawData()

    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")

else:
    print("Error: Expected exactly one argument. ")