#!/usr/bin/python
import json
import uuid
import psycopg2
from psycopg2.extras import Json
from configparser import ConfigParser
 
 
def config(filename='database.ini', section='postgresql'):
	# create a parser
	parser = ConfigParser()
	# read config file
	parser.read(filename)
 
	# get section, default to postgresql
	db = {}
	if parser.has_section(section):
		params = parser.items(section)
		for param in params:
			db[param[0]] = param[1]
	else:
		raise Exception('Section {0} not found in the {1} file'.format(section, filename))
	return db

def create_table():
	""" create tables in the PostgreSQL database"""
	commands = """
		CREATE TABLE public.workout_table
		(
		    workout_uuid text NOT NULL,
		    "user" text NOT NULL,
		    workout_time timestamp without time zone NOT NULL,
		    duration double precision NOT NULL,
		    workout json NOT NULL,
		    PRIMARY KEY (workout_uuid)
		)
		WITH (
		    OIDS = FALSE
		);

		ALTER TABLE public.workout_table
		    OWNER to postgres;
		"""
	conn = None
	try:
		# read the connection parameters
		params = config()
		# connect to the PostgreSQL server
		conn = psycopg2.connect(**params)
		cur = conn.cursor()
		# create table one by one
		print(commands)
		cur.execute(commands)
		# close communication with the PostgreSQL database server
		cur.close()
		# commit the changes
		conn.commit()
	except (Exception, psycopg2.DatabaseError) as error:
		print(error)
	finally:
		if conn is not None:
			conn.close()
 
def insert_row(entry):
	""" insert a new vendor into the vendors table """
	sql = """ INSERT INTO workout_table(workout_uuid, "user", workout_time, duration, workout)
	VALUES(%s, %s, %s, %s, %s) RETURNING workout_uuid;"""
	conn = None
	workout_uuid = None
	try:
		# read database configuration
		params = config()
		# connect to the PostgreSQL database
		conn = psycopg2.connect(**params)
		# create a new cursor
		cur = conn.cursor()
		# execute the INSERT statement
		cur.execute(sql, (
			entry['workout_uuid'], 
			entry['user'], 
			entry['workout_time'], 
			entry['duration'], 
			entry['workout']
			))
		print("try susccess")
		# get the generated id back
		workout_uuid = cur.fetchone()[0]
		# commit the changes to the database
		conn.commit()
		# close communication with the database
		cur.close()
	except (Exception, psycopg2.DatabaseError) as error:
		print(error)
	finally:
		if conn is not None:
			conn.close()
 
	return workout_uuid

if __name__ == '__main__':
	# create_table()
	workout = {
				'workout_uuid': uuid.uuid1().int>>64,
				# "workout_uuid": 11,
				'user':'Peter Tang',
				'workout_time':'2019-10-25T15:00:43.318Z',
				'duration':420.0,
				'workout':json.dumps([{'exercise': '', 'regime': [ {'reps':7, 'weight':185,'rest': 90}, {'reps':4, 'weight':205, 'rest': 90}, {'reps':6, 'weight':185, 'rest': 90}]}])
			}
	print(insert_row(workout))