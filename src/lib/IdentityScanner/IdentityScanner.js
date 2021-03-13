import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import * as Permissions from "expo-permissions";

import CenterIdentity from 'centeridentity';

export default class IdentityScanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: Camera.Constants.Type.back,
      status: '',
      barCode: ''
    }
  }

  componentDidMount = async () => {
    console.log(result);
    if (await Camera.isAvailableAsync()) {
      var result = await Permissions.askAsync(Permissions.CAMERA);
      var types = await Camera.getAvailableCameraTypesAsync();
      this.setState({
        status: result.status,
        types: types
      })
    }
  }

  importIdentity = async (identityLink) => {
    this.setState({...this.state,
      link: identityLink,
    });
    var identity = await this.props.ci.importConnectionFromSkylink(this.props.me, identityLink, this.props.collection || 'default');
    this.props.setIdentity(identity);
    await this.setState({
      identity: JSON.stringify(identity)
    });
  }

  render() {
    // return <BarCodeScanner
    //   onBarCodeScanned={(value) => {this.importIdentity(value)}}
    //   style={StyleSheet.absoluteFillObject}
    // />
    return (
      <View style={styles.container}>
        <Camera 
          style={styles.camera} type={this.state.type}
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          }}
          onBarCodeScanned={(barCode) => {this.importIdentity(barCode.data)}}
        >
        </Camera>
        <Text>Identity scanner: {this.state.status}</Text>
        <Text>Identity: {this.state.link}</Text>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    minHeight: 300
  },
  button: {

  },
  buttonContainer: {

  },
  text: {

  }
})
