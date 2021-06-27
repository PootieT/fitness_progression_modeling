class Workout():
	def __init__(self, workout_dict):
		self.date = workout_dict["date"]
		self.sda = workout_dict["sda"]
		self.workout = workout_dict["workout"]
		self.compute_basic_workout_stats()

	def compute_basic_workout_stats(self):
		pass

	def infer_workout_body_part(self):
		pass


class Exercise():
	def __init__(self, exercise_dict):
		self.name = exercise_dict.keys()[0]
		self.sets = exercise_dict[name]
		self.compute_basic_exercise_stats()

	def compute_basic_exercise_stats(self):
		self.num_sets = len(self.sets)
		self.reps = int(sum([s[0] for s in self.sets])/self.num_sets) # avg reps
		self.volumn = sum([s[0]*s[1] for s in self.sets])
		self.max_weight = max([s[1] for s in self.sets])
		self.max_orm = calculate_one_rep_max(self.sets)

	def infer_exercise_body_parts(self):
		pass


