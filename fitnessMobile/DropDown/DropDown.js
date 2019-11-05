import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Picker,
  } from 'react-native';

class dropDown extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      headerDisplay: this.props.children
    }
  }

  selectHandle = (event) => {
    this.setState({
      headerDisplay: event
    })

    // update the parent value in app
    if (this.props.updateFunction) {
      this.props.updateFunction(event)
    }
  }

  render(){
    return (
      <View>
        <Text style={styles.Text}>{this.props.children}</Text>
        <Picker style={styles.DropDown} selectedValue={this.state.headerDisplay} onValueChange={this.selectHandle}>
            {this.props.options.map(option => {
            return <Picker.Item key={option} label={option} value={option} />
            })}
        </Picker>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  DropDown: {
    width: '90%',
    height: 50,
    margin:0,
    color: 'white',
    backgroundColor: '#E8A735',
    borderWidth:1,
    alignSelf: 'center',
  },
  Text: {
    marginBottom: 0,
    color: 'black',
    textAlign: 'center',
  },
});

export default dropDown;
