import os
import json
import uuid

from flask import Flask, request, jsonify
from flask_cors import CORS

print(os.listdir())
try:
	from postgres_utils import insert_row
except ImportError:
	from .postgres_utils import insert_row

application = Flask(__name__)
CORS(application)

@application.route("/")
def index():
	return "You have reached the index page of Fitness Progression Modeling Project by Peter Tang\
	If you are interested, please email zilu.p.tang@gmail.com for further information. Stayed tuned\
	for our Medium post soon for my results!"

@application.route("/members/<string:name>/")
def getMember(name):
	return name

@application.route('/api/record_workout/<string:username>', methods=['GET', 'POST'])
# @cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def record_workout(username):
	content = request.json
	# do some basic checking this is actually my workout data
	is_fake_data = False
	for key in list(content.keys()):
		is_fake_data = is_fake_data or (key not in ['datetime', 'duration','workout'])
	if content == {} or len(username) > 15 or (not username.isalnum()):
		is_fake_data = True

	if is_fake_data:
		print("This is fake data, get out of here")
		return jsonify({"status": "FAILED!","uuid":username})
	else:
		print("content of the post request:", content)
		print("Workout Data Received:",content['workout'])

		# send data to AWS RDS (postgres)
		workout_uuid = uuid.uuid1().int>>64,
		row = {
			'workout_uuid': workout_uuid,
			'user': username,
			'workout_time': content['datetime'],
			'duration': content['duration'],
			'workout': json.dumps(content['workout'])
		}
		result = insert_row(row)



		return jsonify({"status": "SUCCESS!","username":username,"uuid":result})

if __name__ == "__main__":
	application.run(debug=True)