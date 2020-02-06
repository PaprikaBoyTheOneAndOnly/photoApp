import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {Camera} from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from "./CustomButton";

interface IState {
    permissionToCamera: string;
    permissionToRoll: string;
    flashMode: any;
    type: any;
    image: string;
}

export default class App extends Component<{}, IState> {
    private camera: Camera;

    constructor(props) {
        super(props);
        this.state = {
            image: null,
            permissionToCamera: null,
            permissionToRoll: null,
            flashMode: Camera.Constants.FlashMode.off,
            type: Camera.Constants.Type.back,
        };
    }

    componentDidMount() {
        this.askCameraPermission().then();
        this.askRollPermission().then();
    }

    private flipCam() {
        const type = this.state.type === Camera.Constants.Type.back
            ? Camera.Constants.Type.front
            : Camera.Constants.Type.back;
        this.setState({type})
    }

    private changeFlash() {
        const flashMode = this.state.flashMode === Camera.Constants.FlashMode.off
            ? Camera.Constants.FlashMode.on
            : Camera.Constants.FlashMode.off;
        this.setState({flashMode});
    }

    private async askCameraPermission() {
        const {status} = await Camera.requestPermissionsAsync();
        if (!this.state.permissionToCamera) {
            this.setState({permissionToCamera: status});
        }
    }

    private async askRollPermission() {
        const {status} = await MediaLibrary.requestPermissionsAsync();
        if (!this.state.permissionToRoll) {
            this.setState({permissionToRoll: status});
        }
    }

    private async takePicture() {
        if (this.camera) {
            const {uri} = await this.camera.takePictureAsync();
            this.setState({image: uri});
        }
    }

    private async savePicture() {
        await MediaLibrary.saveToLibraryAsync(this.state.image);
        this.resetImage();
    }

    private async openLibrary() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 1
        });

        if (!result.cancelled) {
            // @ts-ignore
            this.setState({image: result.uri});
        }
    }

    private resetImage() {
        this.setState({image: null});
    }

    private isFlashOn(): boolean {
        return  this.state.flashMode === Camera.Constants.FlashMode.on;
    }

    render() {
        if (this.state.permissionToCamera !== 'granted') {
            return <Text>No access to camera</Text>;
        } else if (this.state.permissionToRoll !== 'granted') {
            return <Text>No access to Roll</Text>;
        }

        if (!this.state.image) {
            return (<View style={{flex: 1}}>
                <Camera style={{flex: 8}} type={this.state.type} flashMode={this.state.flashMode}
                        ref={ref => {
                            this.camera = ref;
                        }}>

                    <View style={styles.inline}>
                        <CustomButton textStyle={{color: this.isFlashOn()? 'yellow': 'white'}} text="flash" pressCallback={() => this.changeFlash()}/>
                    </View>
                </Camera>
                <View style={styles.footer}>
                    <CustomButton text="Flip" pressCallback={() => this.flipCam()}/>
                    <CustomButton text="O" pressCallback={() => this.takePicture()}/>
                    <CustomButton text="LIB" pressCallback={() => this.openLibrary()}/>
                </View>
            </View>);
        } else {
            return (<View style={{flex: 1}}>
                    <Image source={{uri: this.state.image}} style={{width: '100%', height: '100%', flex: 8}}/>
                    <View style={styles.footer}>
                        <CustomButton text="Back" pressCallback={() => this.resetImage()}/>
                        <CustomButton text="Save" pressCallback={() => this.savePicture()}/>
                    </View>
                </View>);
        }
    }
}

const styles = StyleSheet.create({
    flash: {
        color: 'yellow',
    },
    inline: {
      flex: 1,
        marginTop: 10,
        marginRight: 10,
    },
    footer: {
        flex: 1,
        backgroundColor: 'black',
        flexDirection: 'row',
    }
});