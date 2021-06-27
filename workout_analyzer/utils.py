from dateutil.parser import parse
from pprint import pprint
import datetime
import matplotlib.pyplot as plt
from copy import deepcopy
from typing import List, Tuple


def parse_workout_from_list(wk_list):
	wk_dict = {}
	for i, wk in enumerate(wk_list):
		if ':' in wk:
			exercise_name = wk.split(':')[0].lower().replace('    ','')
			try:
				wk_dict[exercise_name] = eval(wk_list[i+1])
			except:
				wk_dict[exercise_name] = eval(wk_list[i+1].replace('+',''))
			if i < len(wk_list)-2 and ':' not in wk_list[i+2]:
				wk_dict[exercise_name].append(eval(wk_list[i+1]))
	return wk_dict

def parse_workout_file(wk_file):
	with open(wk_file, 'r', encoding='utf8') as file:
		data = file.readlines()

	data = [line.replace('\n','').replace('        ','').replace('                ','') for line in data]
	data[0] = data[0].replace('\ufeff','')

	workouts = []
	workout = []
	for i,line in enumerate(data):
		if line == '':
			if data[i-1] == '':
				continue
			workouts.append(workout)
			workout = []
		else:
			workout.append(line)

	for i,workout in enumerate(workouts):
		workouts[i] = {
			"date": workout[0],
			"workout": parse_workout_from_list(workout[2:-1]),
			"sda": workout[-1].split(':')[1].replace(" ",'')
		}
	return workouts


def join_exercise_diff_weight_type(workouts):
	"""
	If same general exercise is performed with different resistance, 
	adjust for weight and combine into same category of exercise.
	For example, bench press with dumbbell (6, 90) would become (6, 180)
	"""
	# 'single_leg', 'single_arm'
	for i,workout in enumerate(workouts):
		new_workout = deepcopy(workout)
		for ex_name, reps in workout['workout'].items():
			if "dumbbell" in ex_name:
				del new_workout['workout'][ex_name]
				new_workout['workout'][ex_name.replace('dumbbell_','')] = \
					[ (ex_set[0],ex_set[1]*2) for ex_set in reps]
		workouts[i] = new_workout
	return workouts

def join_exercise_diff_grip_stance(workouts):
	"""
	Combine exercises with different grip or stance into the same one.
	For example: leg_press_wide/leg_press_narrow --> leg_press
	"""
	keywords = ['hammer', 'hammer', 'close', 'narrow', 'wide', 'reverse', 'cable', 
				'machine', 'vary', 'vertical', 'smith', 'grip']
	for i,workout in enumerate(workouts):
		new_workout = deepcopy(workout)
		for ex_name, reps in workout['workout'].items():
			new_ex_name = ex_name
			for kw in keywords:
				if kw in ex_name:
					new_ex_name = new_ex_name.replace(kw,'')
					new_ex_name = new_ex_name.replace('__','_')
			if new_ex_name[0] == '_':
				new_ex_name = new_ex_name[1:]
			del new_workout['workout'][ex_name]
			new_workout['workout'][new_ex_name] = reps
		workouts[i] = new_workout
	return workouts

def break_up_supersets(workouts):
	"""
	Breaking up super-setted exercise into two sequentially performed 
	exercise
	"""
	for i,workout in enumerate(workouts):
		new_workout = deepcopy(workout)
		for ex_name, reps in workout['workout'].items():
			if "--" in ex_name:
				del new_workout['workout'][ex_name]
				new_workout['workout'][ex_name.split('--')[0]] = reps[:-1]
				new_workout['workout'][ex_name.split('--')[1]] = reps[-1]
		workouts[i] = new_workout
	return workouts

def get_exercise_metric(exercise, metric):
	"""
	given an exercise, return the metric requested.
	exercise example: ('box_step_up', [(7, 162), (9, 162)])
	metric could be one of [max_weight, max_volumne, total_volumne, one_rep_max]
	"""
	if len(exercise[1]) == 0:
		return 0
	if metric == 'max_weight':
		return max([ex_set[1] for ex_set in exercise[1]])
	if metric == 'max_volumne':
		return max([ex_set[0]*ex_set[1] for ex_set in exercise[1]])
	if metric == 'total_volumne':
		return sum([ex_set[0]*ex_set[1] for ex_set in exercise[1]])
	if metric == 'one_rep_max':
		epley_results = max([ex_set[1]*(1+ex_set[0]/30) for ex_set in exercise[1]])
		brzycki_results = max([ex_set[1]/(1.0278-0.0278*ex_set[0]) for ex_set in exercise[1]])
		return (epley_results + brzycki_results)/2


def calculate_one_rep_max(sets: List[Tuple]) -> float:
	"""
	given sets of an exercise, return one rep max. using the average 
	of epley and brzycki equations 
	:param sets: list of rep weight tuples [(7, 162), (9, 162)]
	:return: one rep max
	"""
	epley_results = max([s[1]*(1+s[0]/30) for s in sets])
	brzycki_results = max([s[1]/(1.0278-0.0278*s[0]) for s in sets])
	return (epley_results + brzycki_results)/2

def plot_workout_history_wordcloud(workout_dict):
	exs = []
	for wk in workouts:
	    ex = list(wk["workout"].keys())
	    for e in ex:
	        exs.extend(e.split("--"))
	exs_string = " ".join(exs)

	wordcloud = WordCloud(width = 800, height = 800, 
	                background_color ='white', 
	                min_font_size = 10).generate(exs_string) 
	  
	# plot the WordCloud image                        
	plt.figure(figsize = (8, 8), facecolor = None) 
	plt.imshow(wordcloud) 
	plt.axis("off") 
	plt.tight_layout(pad = 0) 
	  
	plt.show() 