import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
  } from 'react-native';

class StopWatch extends Component {
  state = {
    time: new Date(),
    restTimerStart: new Date(),
    timerDuration: "",
    stopWatchText: "Beast Mode"
  };

  componentDidMount(){
    this.intervalID = setInterval(
      this.tick, 1000
    )
  }

  componentWillUnmount() {
      clearInterval(this.intervalID);
  }

  tick = () => {
    if (this.state.stopWatchText === "Beast Mode") {     //end of resting, REPS!
      this.setState({
        timerDuration: (Math.floor((this.state.time - this.state.restTimerStart)/1000)).toLocaleString()
      });
    }
    this.setState({time: new Date()})
  }

  onClickChangeText = () => {
    if (this.state.stopWatchText === "Beast Mode") {
      this.setState(                                  //end of set, resting
        {
          stopWatchText: "Rest",
          restTimerStart: new Date(this.state.time),
          timerDuration: ""
        }
      );
    } else {                                         //end of resting, REPS!
      this.setState(
        {
          stopWatchText: "Beast Mode",
          restTimerStart: new Date(this.state.time)
        }
      );
    }

    this.props.updateWorkoutStateHandler(this.state.stopWatchText)
    this.props.updateExerciseHandler(this.state.timerDuration)
  }

  render() {
    var buttonStyle = {
      "backgroundColor": this.state.stopWatchText === "Beast Mode"? "#C8000A":"#E8A735",
      "borderRadius": 100,
      "height": 200,
      "width": 200,
      "borderWidth":0,
      "alignSelf": 'center'
    }

    return (
      <View style={styles.StopWatch}>
        <TouchableOpacity onPress={this.onClickChangeText} style={buttonStyle}>
          <Text style={styles.buttonText}>{this.state.stopWatchText + "\n" + this.state.timerDuration}</Text>
        </TouchableOpacity>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  StopWatch: {
    minWidth: 300,
    paddingTop: '0%',
    marginBottom: '5%',
    backgroundColor: '#e2c499',
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 30,
    marginTop: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default StopWatch;
