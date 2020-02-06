import {Text, TouchableOpacity, View} from "react-native";
import React, {Component} from "react";

interface IProps {
    text: string;
    pressCallback: Function;
    textStyle?: any
}

export default class CustomButton extends Component<IProps, {}> {
    constructor(props) {
        super(props);
    }

    render() {
        return (<TouchableOpacity
            style={{
                flex: 1,
                alignSelf: 'flex-end',
                alignItems: 'center'
            }}
            onPress={() => {
                this.props.pressCallback();
            }}>
            <Text style={{...{fontSize: 18, marginBottom: 30, color: 'white'}, ...this.props.textStyle}}>{this.props.text}</Text>
        </TouchableOpacity>)
    }
}