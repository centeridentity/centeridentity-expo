import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, TextInput, Text, Button, ActivityIndicator, Colors } from 'react-native-paper';
import CenterIdentity from 'centeridentity';

import { Provider as PaperProvider } from 'react-native-paper';
import Map from '../Map/Map';


const containerStyle = {backgroundColor: 'white', padding: 20};

export default class RecoverIdentity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ci: props.ci || new CenterIdentity(props.apiKey),
      publicUsername: props.publicUsername || '',
      privateUsername: '',
      lat: '',
      long: '',
      busy: false
    }
  }

  publicUsernameChange = (val) => {
    this.setState({
      publicUsername: val
    })
  }

  privateUsernameChange = (val) => {
    this.setState({
      privateUsername: val
    })
  }

  mapPress = async (e) => {
    if(this.state.busy) return;
    console.log(e.latLng.lat());
    console.log(e.latLng.lng());
    if(this.state.lat && this.state.long && (e.latLng.lat().toFixed(3) === this.state.lat && e.latLng.lng().toFixed(3) === this.state.long)) {
      this.setState({
        busy: true
      })
      setTimeout(async () => {
        try {
          var result = await this.state.ci.signInWithLocation(
            this.props.sessionIdUrl,
            this.state.privateUsername,
            this.state.publicUsername || this.props.publicUsername,
            this.state.lat,
            this.state.long,
            this.props.signinUrl
          )
          this.setState({
            busy: false
          })
          if (result.message === 'user not found') {
            this.setState({
              modalVisible: true
            })
            return;
          }
          if (result.status === true) {
            this.props.onIdentity(result.user);
            this.props.onSuccessfulSignIn(result);
          } else {
            this.props.onFailedSignIn(result);
          }
        } catch(err) {
          if (err.message === 'user not found') {
            this.setState({
              modalVisible: true
            })
          }
        }
      }, 1000)
    } else if(this.state.lat && this.state.long && (e.latLng.lat().toFixed(3) !== this.state.lat || e.latLng.lng().toFixed(3) !== this.state.long)) {
      this.setState({
        lat: e.latLng.lat().toFixed(3),
        long: e.latLng.lng().toFixed(3)
      })
    } else {
      this.setState({
        lat: e.latLng.lat().toFixed(3),
        long: e.latLng.lng().toFixed(3)
      })
    }
  }
  setModalVisible = (value) => {
    this.setState({
      modalVisible: value
    })
  }

  render() {
    return <PaperProvider>
      <View style={{width: this.props.width || '100%', ...styles.container}}>
        <ActivityIndicator animating={this.state.busy} color={Colors.red800} />
        {!this.props.publicUsername && <TextInput label={this.props.publicUsernameLabel || 'Public username'}
          onChange={(e) => {this.publicUsernameChange(e.currentTarget.value)}}
          value={this.state.publicUsername}
        />}
        <TextInput label={this.props.privateUsernameLabel || 'Private username (do not share)'}
          onChange={(e) => {this.privateUsernameChange(e.currentTarget.value)}}
          value={this.state.privateUsername}
        />
        <Map
          mapPress={this.mapPress}
          width={this.props.width || '100%'} height={this.props.height || 600}
        />
        <Portal>
          <Modal 
            visible={this.state.modalVisible}
            onDismiss={() => {this.setModalVisible(!this.state.modalVisible)}}
            contentContainerStyle={containerStyle}
          >
            <Text>{this.props.userNotFoundMessage || 'Identity not found for provided username and coordinates. Create a new identity?'}</Text>
            <Button style={{marginTop: 30}} onPress={async () => {
              this.setState({
                busy: true
              })
              setTimeout(async () => {
                this.setModalVisible(!this.state.modalVisible);

                var result = await this.state.ci.registerWithLocation(
                  this.props.sessionIdUrl,
                  this.state.privateUsername,
                  this.state.publicUsername,
                  this.state.lat,
                  this.state.long,
                  this.props.extraData,
                  this.props.registerUrl
                );
                this.setState({
                  busy: false
                })
                if (result.status === true) {
                  this.props.onIdentity(result.user);
                  this.props.onSuccessfulRegister(result);
                } else {
                  this.props.onFailedRegister(result);
                }
              }, 1000);
            }}>
              {this.props.createText || 'Create'}
            </Button>
            <Button style={{marginTop: 30}} onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
            }}>
              {this.props.tryAgainText || 'Try again'}
            </Button>
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  }
}

const styles = StyleSheet.create({
  container: {
  }
})

RecoverIdentity.propTypes = {
  ci: PropTypes.object,
  sessionIdUrl: PropTypes.string,
  registerUrl: PropTypes.string,
  signinUrl: PropTypes.string,
  userNotFoundMessage: PropTypes.string,
  publicUsername: PropTypes.string,
  publicUsernameLabel: PropTypes.string,
  privateUsernameLabel: PropTypes.string,
  extraData: PropTypes.object,
  onSuccessfulRegister: PropTypes.func,
  onSuccessfulSignIn: PropTypes.func,
  onFailedRegister: PropTypes.func,
  onFailedSignIn: PropTypes.func,
  createText: PropTypes.string,
  tryAgainText: PropTypes.string,
  width: PropTypes.any,
  height: PropTypes.any
}
