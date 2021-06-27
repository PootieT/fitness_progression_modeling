import requests
import json
from pprint import pprint

class WorkoutManagerAPI():
	def __init__(self):
		self.uri = "https://wger.de/api/v2/"
		self.api_key = "07df123c436a06da8755834a3cedcde6d974d828"
		self.format = "?format=json"
		self.status = "&status=2"
		self.headers = {'Accept': 'application/json','Authorization': self.api_key}

	def get_exercise(self, name):
		url = self.uri+"exercise/"+self.format+self.status+"&name={name}"
		r = requests.get(url=url, headers=self.headers)
		pprint(json.loads(r.content))

	def get_muscles(self):
		pass

w = WorkoutManagerAPI()
w.get_exercise("skullcrushers")