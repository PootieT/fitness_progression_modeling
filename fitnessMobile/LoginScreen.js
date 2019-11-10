import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  TouchableOpacity
} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import DefaultInputForm from './DefaultInputForm/DefaultInputForm';


class LoginScreen extends React.Component {
  
  state = {
    username: ''
  }

  updateUsername = (username) => {
    this.setState({
      username: username.toLowerCase().replace(/ /g,"_")
    })
    console.log("login screen state:", this.state.username)
  }

  static navigationOptions = {
    title: "Welcome to Peter Fitness Tracking App",
    headerStyle: {backgroundColor: '#e2c499'},
    headerTitleStyle: { color: 'white' },
  };
  render() {
    const {navigate} = this.props.navigation;
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.usernameInput}>
          <DefaultInputForm updateHandler={this.updateUsername}>Username</DefaultInputForm>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => navigate('Workout', {username: this.state.username})}>
          <Text style={styles.buttonText}>Begin Workout</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#e2c499',
  },
  usernameInput: {
    // position: 'absolute',
    // top: '30%'
    marginTop: '50%'
  },
  button: {
    backgroundColor: '#e8a735',
    alignSelf: 'center',
    marginTop: '10%',
    width: '60%',
    height: 40,
  },
  buttonText: {
    marginTop: 5,
    fontSize: 20,
    color: 'white',
    textAlign: 'center'
  }
});

export default LoginScreen;