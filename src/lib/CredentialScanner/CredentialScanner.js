import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import * as Permissions from "expo-permissions";

import CenterIdentity from 'centeridentity';

export default class CredentialScanner extends React.Component {
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

  importCredential = async (credentialLink) => {
    this.setState({...this.state,
      link: credentialLink,
    });
    return fetch('https://siasky.net/' + credentialLink)
    .then(async (res) => {
      var credential = await res.json();
      credential.link = await this.props.ci.getCredentialLink(credential)
      await this.props.ci.addCredential(this.props.me, credential);
      this.props.setCredential(credential);
      await this.setState({
        credential: credential
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera 
          style={styles.camera} type={this.state.type}
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          }}
          onBarCodeScanned={(barCode) => {this.importCredential(barCode.data)}}
        >
        </Camera>
        <Text>Credential scanner: {this.state.status}</Text>
        <Text>Credential link: {this.state.link}</Text>
        {this.state.credential && <Text>Credential: {this.state.credential.issuer_signature}</Text>}
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
