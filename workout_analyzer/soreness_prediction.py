import numpy as np
from sklearn.svm import SVC, LinearSVC
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_val_score
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer


from utils import parse_workout_file, break_up_supersets, \
join_exercise_diff_weight_type,join_exercise_diff_grip_stance, get_exercise_metric

def print_feature_importance(clf, feature_names, top_features=10, print_raw_weights=False):
	if len(clf.coef_.shape) >1:
		coef = np.mean(clf.coef_, axis=0)
	else:
		coef = clf.coef_

	if top_features > len(coef):
		top_features = int(len(coef)/2)

	top_positive_coefficients = np.argsort(coef)[-top_features:]
	top_negative_coefficients = np.argsort(coef)[:top_features]
	if print_raw_weights:
		print("raw_weights:", coef)
		print("features:", feature_names)
	print("top_positive_coefficients:", [feature_names[i] for i in top_positive_coefficients])
	print("top_negative_coefficients:", [feature_names[i] for i in top_negative_coefficients])

def build_sda_estimator_with_exercise_name_ex1(cv=3):
	"""
	Build a machine learning model that predicts the soreness day after
	using only the name of the exercise performed the day before
	"""
	workouts = parse_workout_file('workout_full.txt')
	workouts = break_up_supersets(workouts)
	workouts = join_exercise_diff_weight_type(workouts)
	workouts = join_exercise_diff_grip_stance(workouts)

	all_exercise = []
	soreness = []
	for workout in workouts:
		exercise = " ".join(list(workout['workout'].keys()))
		all_exercise.append(exercise)
		soreness.append(int(workout['sda']))

	vectorizer = CountVectorizer()
	X = vectorizer.fit_transform(all_exercise)
	# print(vectorizer.get_feature_names())
	# print("training data shape:", X.toarray().shape)  
	# X_train, X_test, y_train, y_test = train_test_split(X, soreness, \
	# 	test_size=0.2, random_state=42)
	# clf = SVC(gamma='auto')
	clf = LinearRegression()
	# clf.fit(X_train, y_train)
	scores = cross_val_score(clf, X, soreness, cv=cv)
	print("\n\n===================================")
	print("exp1 cross validation score:", scores)

	# assess feature importance
	X_train, X_test, y_train, y_test = train_test_split(X, soreness, \
		test_size=0.2, random_state=42)
	# clf = LinearSVC()
	clf = LinearRegression()
	clf.fit(X_train, y_train)
	print_feature_importance(clf, vectorizer.get_feature_names())

def build_sda_estimator_with_exercise_name_ex2(cv=3):
	"""
	Build a machine learning model that predicts the soreness day after
	using only the name of the exercise performed the day before
	"""
	workouts = parse_workout_file('workout_full.txt')
	workouts = break_up_supersets(workouts)

	all_exercise = []
	soreness = []
	for workout in workouts:
		exercise = " ".join(list(workout['workout'].keys()))
		exercise = exercise.replace("_"," ")
		all_exercise.append(exercise)
		soreness.append(int(workout['sda']))

	vectorizer = CountVectorizer()
	X = vectorizer.fit_transform(all_exercise)
	# print(X.toarray().shape)  
	
	# clf = SVC(gamma='auto')
	clf = LinearRegression()
	scores = cross_val_score(clf, X, soreness, cv=cv)
	print("\n\n===================================")
	print("exp2 cross validation score:", scores)

	# assess feature importance
	X_train, X_test, y_train, y_test = train_test_split(X, soreness, \
		test_size=0.2, random_state=42)
	# clf = LinearSVC()
	clf = LinearRegression()
	clf.fit(X_train, y_train)
	print_feature_importance(clf, vectorizer.get_feature_names())

def build_sda_estimator_with_exercise_metric_ex1(cv=3):
	"""
	Predict soreness using weight, reps, volumes
	how to incorporate previous related workouts?
		- bench press is closer to close grip bench press than hex dumbell press than lateral 

	"""
	workouts = parse_workout_file('workout_full.txt')
	workouts = break_up_supersets(workouts)
	features = ['num_ex', 'total_vol', 'max_ex_vol', 'max_weight', 'max_set_vol', 'sum_max_vol']
	# features = ['num_ex', 'total_vol']
	exercise_data = []
	soreness = []
	for workout in workouts:
		data = []
		max_weights = [get_exercise_metric(ex, 'max_weight') for ex in workout['workout'].items()]
		max_volumnes = [get_exercise_metric(ex, 'max_volumne') for ex in workout['workout'].items()]
		total_volumnes = [get_exercise_metric(ex, 'total_volumne') for ex in workout['workout'].items()]
		one_rep_maxs = [get_exercise_metric(ex, 'one_rep_max') for ex in workout['workout'].items()]
		if 'num_ex' in features:
			data.append(len(workout['workout'])) # number of exercise
		if 'total_vol' in features:
			data.append(sum(total_volumnes))
		if 'max_ex_vol' in features:
			data.append(max(total_volumnes))
		if 'max_weight' in features:
			data.append(max(max_weights))
		if 'max_set_vol' in features:
			data.append(max(max_volumnes))
		if 'sum_max_vol' in features:
			data.append(sum(max_volumnes))
		exercise_data.append(data)
		soreness.append(int(workout['sda']))

	# clf = SVC(gamma='auto')
	clf = LinearRegression()
	scores = cross_val_score(clf, exercise_data, soreness, cv=cv)
	print("\n\n===================================")
	print("exp2 cross validation score:", scores)

	# assess feature importance
	X_train, X_test, y_train, y_test = train_test_split(exercise_data, soreness, \
		test_size=0.2, random_state=42)
	# clf = LinearSVC(max_iter=1000)
	clf = LinearRegression()
	clf.fit(X_train, y_train)
	print_feature_importance(clf, features, print_raw_weights=True)

build_sda_estimator_with_exercise_name_ex1(cv=5)
# after preprocessing, using whole exercise word, about 0.4 accuracy

build_sda_estimator_with_exercise_name_ex2(cv=5)
# without preprocessing, use individual words within exercise name, same accuracy

build_sda_estimator_with_exercise_metric_ex1(cv=5)


# need to build a similarity metrics between these exercises in terms of the groups of muscle 
# they use, so i can use this to calculate features such as previous similar exercise volumne
# or day since worked out similar muscle group. this is great for preprocessing as well