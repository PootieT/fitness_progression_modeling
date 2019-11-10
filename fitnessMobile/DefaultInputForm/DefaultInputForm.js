import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  AsyncStorage,
} from 'react-native';

class DefaultInputForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: ''}
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    componentDidMount = () => {
      this._retrieveData()
    }
    handleChange(event) {
      this.setState({value: event});
      this._storeData(event)
      this.props.updateHandler(event);
    }
  
    handleSubmit(event) {
      alert('A name was submitted: ' + this.state.value);
      event.preventDefault();
    }

    _retrieveData = async () => {
        try {
          const value = await AsyncStorage.getItem('@MySuperStore:FitnessAppPreviousAppUsername');
          // const value = await AsyncStorage.getAllKeys();

          if (value !== null & typeof value === 'string') {
            // We have data!!
            console.log("previous username found:", value);
            this.setState({value: value}) 
            return value
          } else {
            return ''
          }
        } catch (error) {
          // Error retrieving data
          console.log(error)
          // return ''
        }
      };

    _storeData = async (username) => {
    try {
        await AsyncStorage.setItem('@MySuperStore:FitnessAppPreviousAppUsername', username);
    } catch (error) {
        // Error saving data
        console.log(error)
    }
    };

    render() {
      return (
        <ScrollView>
          <View>
            <Text style={styles.header}>{this.props.children}</Text>
            <TextInput
              keyboardType='ascii-capable'
              style={styles.InputForm}
              placeholder={this.state.value}
              onChangeText={(text)=> this.handleChange(text)}
              value={this.state.value} 
              maxLength={15}/>
          </View>
        </ScrollView>

      );
    }
  }

  const styles = StyleSheet.create({
    InputForm: {
      width: '80%',
      marginTop: 15,
      borderBottomWidth: 2,
      height: 35,
      alignSelf: 'center'
    },
    header: {
      textAlign: 'center',
      fontSize: 15
    }
  });

  export default DefaultInputForm