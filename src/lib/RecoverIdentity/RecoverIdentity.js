import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, TextInput, Text, Button, ActivityIndicator, Colors } from 'react-native-paper';
import CenterIdentity from 'centeridentity';
import { Circle, Marker } from 'react-google-maps';

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
    let lat;
    let lng;
    if (e.nativeEvent) {
      lat = e.nativeEvent.coordinate.latitude.toFixed(3);
      lng = e.nativeEvent.coordinate.longitude.toFixed(3);
    } else {
      lat = e.latLng.lat().toFixed(3);
      lng = e.latLng.lng().toFixed(3);
    }
    if(this.state.lat && this.state.long && (lat === this.state.lat && lng === this.state.long)) {
      this.setState({
        busy: true
      })
      setTimeout(async () => {
        try {
          if(this.props.signinUrl) {
            try {
              var result = await this.state.ci.signInWithLocation(
                this.props.sessionIdUrl,
                this.state.privateUsername,
                this.state.publicUsername || this.props.publicUsername,
                this.state.lat,
                this.state.long,
                this.props.signinUrl
              )
              if (result.message === 'user not found') {
                if (this.props.signInOnly === true) {
                  return this.setState({
                    modalSignInOnlyVisible: true
                  })
                } else {
                  return this.setState({
                    modalVisible: true
                  })
                }
              }
              if (result.status === true) {
                if (this.props.onIdentity) this.props.onIdentity(result.user);
                this.props.onSuccessfulSignIn(result.user);
              } else {
                this.props.onFailedSignIn(result);
              }
            } catch(err) {
              return err
            }
          } else {
            try {
              var root_user = await this.state.ci.get(
                this.state.privateUsername,
                this.state.lat,
                this.state.long
              )
              if (!root_user.wif) {
                //return this.props.onFailedRecovery(root_user);
                this.setState({
                  error: 'User not found',
                  modalVisible: true
                })
              }
              var public_user = await this.state.ci.reviveUser(
                root_user.wif,
                this.state.publicUsername
              )
              this.setState({
                busy: false
              })
            } catch(err) {
              this.setState({
                error: 'User not found',
                busy: false,
                modalVisible: true
              })
              return this.props.onFailedRecovery(err);
            }
            if(this.props.onSuccessfulRecovery) this.props.onSuccessfulRecovery(public_user);
          }
          this.setState({
            busy: false
          })
        } catch(err) {
          if (err.message === 'user not found') {
            this.setState({
              error: 'User not found',
              modalVisible: true
            })
          }
        }
      }, 1000)
    } else if(this.state.lat && this.state.long && (lat !== this.state.lat || lng !== this.state.long)) {
      this.setState({
        lat: lat,
        long: lng
      })
    } else {
      this.setState({
        lat: lat,
        long: lng
      })
    }
    return {
      lat: lat,
      long: lng
    };
  }
  setModalVisible = (value) => {
    this.setState({
      modalVisible: value
    })
  }
  setModalSignInOnlyVisible = (value) => {
    this.setState({
      modalSignInOnlyVisible: value
    })
  }

  render() {
    return <PaperProvider>
      <View style={{width: this.props.width || '100%', ...styles.container}}>
        <ActivityIndicator animating={this.state.busy} color={Colors.red800} />
        <Text style={{color: 'red'}}>{this.state.error}</Text>
        <TextInput label={this.props.publicUsernameLabel || 'Public username'}
          onChange={(e) => {this.publicUsernameChange(e.currentTarget.value)}}
          value={this.state.publicUsername}
        />
        <TextInput label={this.props.privateUsernameLabel || 'Private username (do not share)'}
          onChange={(e) => {this.privateUsernameChange(e.currentTarget.value)}}
          value={this.state.privateUsername}
        />
        <Map
          mapPress={this.mapPress}
          width={this.props.width} height={this.props.height}
        />
        <Portal>
          <Modal 
            visible={this.state.modalVisible}
            onDismiss={() => {this.setModalVisible(!this.state.modalVisible)}}
            contentContainerStyle={containerStyle}
          >
            <Text>{this.props.userNotFoundMessage || 'Identity not found for provided username and coordinates.'}</Text>
            <Button style={{marginTop: 30}} onPress={async () => {
              this.setState({
                busy: true
              })
              setTimeout(async () => {
                this.setModalVisible(!this.state.modalVisible);
                try {
                  var result = await this.state.ci.registerWithLocation(
                    this.props.sessionIdUrl,
                    this.state.privateUsername,
                    this.state.publicUsername,
                    this.state.lat,
                    this.state.long,
                    this.props.extraData,
                    this.props.registerUrl
                  );
                } catch(err) {
                  this.props.onFailedRegister && this.props.onFailedRegister(err);
                }
                this.setState({
                  busy: false
                })
                if (result.status === true) {
                  if (this.props.onIdentity) this.props.onIdentity(result.user);
                  this.props.onSuccessfulRegister && this.props.onSuccessfulRegister(result);
                } else {
                  this.props.onFailedRegister && this.props.onFailedRegister(result);
                }
              }, 1000);
            }}>
              {this.props.createText || 'Create'}
            </Button>
            <Button style={{marginTop: 30}} onPress={() => {
                this.setState({
                  busy: false
                })
                this.setModalVisible(!this.state.modalVisible);
            }}>
              {this.props.tryAgainText || 'Try again'}
            </Button>
          </Modal>
        </Portal>
        <Portal>
          <Modal 
            visible={this.state.modalSignInOnlyVisible}
            onDismiss={() => {this.setModalSignInOnlyVisible(!this.state.modalSignInOnlyVisible)}}
            contentContainerStyle={containerStyle}
          >
            <Text>{this.props.userNotFoundMessage || 'Identity not found for provided username and coordinates.'}</Text>
            <Button style={{marginTop: 30}} onPress={() => {
                this.setState({
                  busy: false
                })
                this.setModalSignInOnlyVisible(!this.state.modalSignInOnlyVisible);
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
  onSuccessfulRecovery: PropTypes.func,
  onFailedRegister: PropTypes.func,
  onFailedSignIn: PropTypes.func,
  onFailedRecovery: PropTypes.func,
  createText: PropTypes.string,
  tryAgainText: PropTypes.string,
  width: PropTypes.any,
  height: PropTypes.any,
  signInOnly: PropTypes.bool
}
