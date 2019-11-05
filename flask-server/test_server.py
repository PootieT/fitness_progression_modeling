import requests
real_data = {'datetime': '2019-10-25T15:00:43.318Z', 'duration': 21.089, 'workout': [{'exercise': '', 'regime': [ {"reps":7, "weight":185, "rest": 90}, {"reps":4, "weight":205, "rest": 90}, {"reps":6, "weight":185, "rest": 90}]}]}
fake_data = {'mytext':'lalala'}
res = requests.post('http://localhost:5000/api/record_workout/patricia', json=real_data)
if res.ok:
	print(res.json())