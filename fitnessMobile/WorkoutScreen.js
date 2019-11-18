/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  AsyncStorage,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import StopWatch from './StopWatch/StopWatch';
import DropDown from './DropDown/DropDown';
import InputForm from './InputForm/InputForm';

class WorkoutScreen extends Component {
  static navigationOptions = {
    title: null,
    headerLeft: null,
    headerStyle: {backgroundColor: '#e2c499'},
  };
  state = {
    time: '00-00-00',
    workoutStartTime: new Date(),
    bodyParts: ['Chest', 'Back', 'Legs', 'Arms', 'Shoulder', 'Abs', 'Cardio'],
    exercises: {
      'Chest':['Bench Press','Incline Bench Press','Decline Bench Press','Flye',
                'Dips','Hex Press'],
      'Back':['Lateral Pulldown','Pullup','Bentover Row','Chinup','Seated Row','Facepull','Shrug'],
      'Legs':['Deadlift','Romanian Deadlift','Front Squat','Back Squat','Goblet Squat','Overhead Squat',
                'Lunges','Bulgarian Split Squat','Leg Extension','Leg Curls',],
      'Arms':['Bicep Curl','Tricep Extension','Skull Crusher'],
      'Shoulder':['Lateral Raise','Arnold Press','Shoulder Press','Military Press','Rear Delt Raise',
                'Reverse Flye'],
      'Abs':['Plank','Russian Twist','Leg Raise','Knee Raise'],
      'Cardio':['Jog','Sprint','Row','Bike']
    },
    weightsType: ['Body Weight', 'Barbell', 'Dumbbell', 'Kettlebell', 'Plate', 'Cable','Machine'],
    grips: ['Regular Grip', 'Reverse Grip', 'Wide Grip', 'Narrow Grip','Hammer Grip','Rope'],
    bodyPartSelected: 'Chest',
    exerciseSelected: 'Bench Press',
    weightsTypeSelected: 'Body Weight',
    workoutOrRest: 'Rest',
    hideInputForms: true,
    currentWeight: 0,
    currentRepetition: 0,
    currentExercise: {exercise: "", regime: []},
    currentWorkout: []
  }

  _storeData = async (key, value) => {
    try {
      // await AsyncStorage.setItem(key, value);
      await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (error) {}
  };

  _retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        console.log("previous",key,"found! and it is:",JSON.parse(value));
        this.setState({
          [key.split(':').slice(1)]: JSON.parse(value)
        })
      } 
    } catch (error) {}
  };

  componentDidMount = () => {
    this._retrieveData('@MySuperStore:bodyPartSelected')
    this._retrieveData('@MySuperStore:exerciseSelected')
    this._retrieveData('@MySuperStore:weightsTypeSelected')
    this._retrieveData('@MySuperStore:hideInputForms')
    this._retrieveData('@MySuperStore:currentWeight')
    this._retrieveData('@MySuperStore:currentRepetition')
    this._retrieveData('@MySuperStore:currentExercise')
    this._retrieveData('@MySuperStore:currentWorkout')
  }

  updateWorkoutOrRestHandler = (workoutState) => {
    this.setState({
      workoutOrRest: workoutState
    })
  }

  updateBodyPartSelectedHandler = (bodyPart) => {
    this.setState({
      bodyPartSelected: bodyPart
    })
    this._storeData('@MySuperStore:bodyPartSelected', bodyPart)
  }

  updateExerciseSelectedHandler = (exercise) => {
    console.log("the exercise is now changed to:", exercise)
    this.setState({
      exerciseSelected: exercise
    })
    this._storeData('@MySuperStore:exerciseSelected', exercise)
  }
  
  updateWeightsTypeSelectedHandler = (weights) => {
    console.log("the weight type is now changed to:", weights)
    this.setState({
      weightsTypeSelected: weights
    })
    this._storeData('@MySuperStore:weightsTypeSelected', weights)
  }

  updateCurrentWeightHandler = (weight) => {
    console.log("the weight is now changed to:", weight)
    this.setState({
      currentWeight: weight
    })
    this._storeData('@MySuperStore:currentWeight', weight)
  }

  updateCurrentRepetitionHandler = (rep) => {
    this.setState({
      currentRepetition: rep
    })
    this._storeData('@MySuperStore:currentRepetition', rep)
  }

  updateCurrentExerciseHandler = (timerDuration) => {
    // beginning of workout, current'Jane'Exercise is empty, when user enter Beast Mode
    console.log("current exercise:", this.state.currentExercise)
    console.log("current exercise and weight types:", this.state.exerciseSelected, this.state.weightsTypeSelected)
    console.log("rest or beastmode:",this.state.workoutOrRest, this.state.workoutOrRest === "Rest")
    if (this.state.currentExercise.exercise.length === 0 & 
        this.state.workoutOrRest === "Rest") {
      // initialize exercise
      this.setState({
        currentExercise: {
          exercise: (this.state.exerciseSelected +"_"+ this.state.weightsTypeSelected).toLowerCase().replace(/ /g,"_"),
          regime: []
        },
        hideInputForms: false
      })
    // beginning of new exercise, currentExercise name is different from exerciseSelected
    } else if (this.state.workoutOrRest === "Rest"){
      this.setState({
        currentExercise: {
          exercise: this.state.currentExercise.exercise,
          regime: [
            ...this.state.currentExercise.regime, 
            {
                "reps":parseInt(this.state.currentRepetition), 
                "weight":parseInt(this.state.currentWeight), 
                "rest":parseInt(timerDuration)
            }
          ]
        }
      })
    }
    this._storeData('@MySuperStore:currentExercise', this.state.currentExercise)
    this._storeData('@MySuperStore:hideInputForms', this.state.hideInputForms)
  }

  appendExercise = () => {  
    const tempCurrentExercise = {
      exercise: this.state.currentExercise.exercise,
      regime: [
        ...this.state.currentExercise.regime, 
        {
          "reps":parseInt(this.state.currentRepetition), 
          "weight":parseInt(this.state.currentWeight), 
          "rest":90
        }
      ]
    }
    console.log("current exercise", tempCurrentExercise)
    this.setState({
      currentWorkout: [
        ...this.state.currentWorkout, 
        tempCurrentExercise
      ],
      currentExercise: {exercise: "", regime: []},
      hideInputForms: true
    })
    this._storeData('@MySuperStore:currentWorkout', this.state.currentWorkout)
    this._storeData('@MySuperStore:currentExercise', this.state.currentExercise)
    this._storeData('@MySuperStore:hideInputForms', this.state.hideInputForms)
  }

  recordWorkout = async () => {
    const { navigation } = this.props;
    const finishTime = new Date();
    const duration = (finishTime.getTime() - this.state.workoutStartTime.getTime())/1000;
    const finalWorkoutData = {
        datetime: this.state.workoutStartTime.toISOString(),
        duration: duration,
        workout: [...this.state.currentWorkout]
    }
    console.log("final workout data", finalWorkoutData)
    console.log("username:", navigation.getParam('username','fake_user'))
    try {
      // const data = await this.postData('http://localhost:5000/api/record_workout/'+ JSON.stringify(this.props.navigation.getParam('username')), finalWorkoutData);
      const data = await this.postData('http://fitnessprogressionmodelingserver.us-east-2.elasticbeanstalk.com/api/record_workout/' + this.props.navigation.getParam('username'), finalWorkoutData);
      console.log("post response:",JSON.stringify(data)); // JSON-string from `response.json()` call
    } catch (error) {
      console.error(error);
    }

    this._storeData('@MySuperStore:bodyPartSelected','Chest')
    this._storeData('@MySuperStore:exerciseSelected','Bench Press')
    this._storeData('@MySuperStore:weightsTypeSelected','Body Weight')
    this._storeData('@MySuperStore:hideInputForms',true)
    this._storeData('@MySuperStore:currentWeight',0)
    this._storeData('@MySuperStore:currentRepetition',0)
    this._storeData('@MySuperStore:currentExercise',{exercise: "", regime: []})
    this._storeData('@MySuperStore:currentWorkout',[])

  }

  postData = async (url = '', data = {}) => {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST',
      // mode: 'cors', // no-cors, *cors, same-origin
      // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      // redirect: 'follow', // manual, *follow, error
      // referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  }

  formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // months are zero indexed
    const day = date.getDate();
    const hour = date.getHours();
    const hourFormatted = hour % 12 || 12;
    return month+"_"+day+"_"+year+"_"+hourFormatted;
  }
  
  render() {
    return (
      <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
        <View style={styles.body}>
          <StopWatch updateWorkoutStateHandler={this.updateWorkoutOrRestHandler}
                    updateExerciseHandler={this.updateCurrentExerciseHandler}/>
          <DropDown options={this.state.bodyParts} 
                    updateFunction={this.updateBodyPartSelectedHandler}
                    initialValue={this.state.bodyPartSelected}
                    id='Body Part'>
            Body Part
          </DropDown>
          <DropDown options={this.state.exercises[this.state.bodyPartSelected]}
                    updateFunction={this.updateExerciseSelectedHandler}
                    initialValue={this.state.exerciseSelected}>
            Exercises
          </DropDown>
          <DropDown options={this.state.weightsType}
                    updateFunction={this.updateWeightsTypeSelectedHandler}
                    initialValue={this.state.weightsTypeSelected}>
            Weights Type
          </DropDown>
          { !this.state.hideInputForms &&
            <View>
              <InputForm updateHandler={this.updateCurrentWeightHandler} historyValue={this.state.currentWeight}>Weight</InputForm>
              <InputForm updateHandler={this.updateCurrentRepetitionHandler} historyValue={this.state.currentRepetition}>Reps</InputForm>
            </View>
          }
          <View style={styles.SubmitButtonView}>
            <TouchableOpacity onPress={this.appendExercise} style={styles.SubmitButton} >
              <Text style={styles.SubmitButtonText}>Finish Exercise</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.recordWorkout} style={styles.SubmitButton}>
              <Text style={styles.SubmitButtonText}>Finish Workout</Text>
          </TouchableOpacity>
          </View>
          
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: '#e2c499',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  SubmitButtonView: {
    marginTop: 10,
    marginBottom: '43%',
    flexDirection:'row',
    alignSelf:'center',
  },
  SubmitButton: {
    marginTop: 10,
    width: '40%',
    marginLeft: '5%',
    marginRight: '5%',
    height: 50,
    backgroundColor: '#e8a735',
    borderWidth: 0,
  },
  SubmitButtonText:{
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

export default WorkoutScreen;
