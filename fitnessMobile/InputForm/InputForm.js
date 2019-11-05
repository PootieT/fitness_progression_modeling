import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';

class InputForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: ''};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event});
        this.props.updateHandler(event)
    }
  
    handleSubmit(event) {
      alert('A name was submitted: ' + this.state.value);
      event.preventDefault();
    }
  
    render() {
      return (
        <ScrollView>
          <View>
            <Text style={styles.header}>{this.props.children}</Text>
            <TextInput
              keyboardType='numeric'
              style={styles.InputForm}
              placeholder={this.props.children}
              onChangeText={(text)=> this.handleChange(text)}
              value={this.state.value} 
              maxLength={5}/>
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
      textAlign: 'center'
    }
  });

  export default InputForm