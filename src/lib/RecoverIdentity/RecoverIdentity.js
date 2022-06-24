import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, TextInput, Text, Button, ActivityIndicator, Colors, DefaultTheme } from 'react-native-paper';
import CenterIdentity from 'centeridentity';
import { Circle, Marker } from 'react-google-maps';
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';

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
      lng: '',
      busy: false,
      clientSideOnly: props.clientSideOnly,
      placesValue: '',
      childRef: React.createRef()
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

  mapPress = async (e, lat, lng) => {
    if(this.state.busy) return;
    if(!lat || !lng) {
      if (e.nativeEvent) {
        lat = e.nativeEvent.coordinate.latitude.toFixed(3);
        lng = e.nativeEvent.coordinate.longitude.toFixed(3);
      } else {
        lat = e.latLng.lat().toFixed(3);
        lng = e.latLng.lng().toFixed(3);
      }
    }
    this.setState({
      lat: lat,
      lng: lng,
      locationSelectDone: true
    })
    return {
      lat: lat,
      lng: lng
    };
  }

  confirmLocation = async () => {

    setTimeout(async () => {
      try {
        if(this.props.signinUrl) {
          try {
            if (this.props.clientSideOnly) {
              var result = await this.state.ci.get(
                this.state.privateUsername,
                this.state.lat,
                this.state.lng
              )
            } else {
              var result = await this.state.ci.signInWithLocation(
                this.props.sessionIdUrl,
                this.state.privateUsername,
                this.state.publicUsername || this.props.publicUsername,
                this.state.lat,
                this.state.lng,
                this.props.signinUrl
              )
            }
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
              this.state.lng
            )
            if (!root_user.wif) {
              //return this.props.onFailedRecovery(root_user);
              this.setState({
                error: this.props.userNotFoundMessage,
                modalVisible: true
              })
            }
            var public_user = await this.state.ci.reviveUser(
              root_user.wif,
              this.state.publicUsername
            )
            if (this.props.onIdentity) this.props.onIdentity(public_user);
            this.setState({
              busy: false
            })
          } catch(err) {
            this.setState({
              error: this.props.userNotFoundMessage,
              busy: false,
              modalVisible: true
            })
            return this.props.onFailedRecovery(err);
          }
        }
        this.setState({
          busy: false
        })
      } catch(err) {
        if (err.message === 'user not found') {
          this.setState({
            error: this.props.userNotFoundMessage,
            modalVisible: true
          })
        }
      }
    }, 1000)
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

  setPlacesValue(value) {
    this.setState({ placesValue: value })
    geocodeByAddress(value.label)
    .then(results => getLatLng(results[0]))
    .then(({ lat, lng }) =>
      this.state.childRef.current.updateRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 50,
        longitudeDelta: 50,
      })
    );
  }

  render() {
    return <PaperProvider theme={DefaultTheme}>
      <View style={{width: this.props.width || '100%', ...styles.container}}>
        {/* <Text style={{color: 'red'}}>{this.state.error}</Text> */}
        {!this.state.busy && !this.state.publicUsernameDone && !this.state.privateUsernameDone && !this.state.locationSelectDone && !this.state.locationConfirmDone && <View>
          <Text style={styles.mb15}>Specify a public username. This username will be viewable by everyone.</Text>
          <TextInput  label={this.props.publicUsernameLabel || 'Public username'}
            onChange={(e) => {this.publicUsernameChange(e.currentTarget.value || e.nativeEvent.text)}}
            value={this.state.publicUsername}
            style={styles.mb15}
          />
          <Button style={{marginTop: 30}} onPress={() => {
              this.setState({
                publicUsernameDone: true
              })
          }}>
            Confirm
          </Button>
        </View>}
        {!this.state.busy && this.state.publicUsernameDone && !this.state.privateUsernameDone && !this.state.locationSelectDone && !this.state.locationConfirmDone && <View>
          <Text style={styles.mb15}>Specify a private username. This username is only visible to you so make it as memorable and personal as possible.</Text>
          <TextInput  label={this.props.privateUsernameLabel || 'Private username (do not share)'}
            onChange={(e) => {this.privateUsernameChange(e.currentTarget.value || e.nativeEvent.text)}}
            value={this.state.privateUsername}
            style={styles.mb15}
          />
          <Button style={{marginTop: 30}} onPress={() => {
              this.setState({
                privateUsernameDone: true
              })
          }}>
            Confirm
          </Button>
        </View>}
        {!this.state.busy && this.state.publicUsernameDone && this.state.privateUsernameDone && !this.state.locationSelectDone && !this.state.locationConfirmDone && <View>
          <Text style={styles.mb15}>The final step to securing your identity is to select an exact location on the map below. The location you select is not sent to Center Identity, so make it as memorable and personal as possible.</Text>
          <GooglePlacesAutocomplete
            apiKey="AIzaSyDEbmqlzlkU3mErAG-PPdPEbTrv6opHmag"
            selectProps={{
              value: this.state.placesValue,
              onChange: (value) => {this.setPlacesValue(value)},
              placeholder: 'Use this search field to get closer to your secret location.',
              styles: stylez,
              noOptionsMessage:({inputValue}) => { return "No results found"}
            }}
          />
        </View>}
        {!this.state.busy && this.state.publicUsernameDone && this.state.privateUsernameDone && this.state.locationSelectDone && !this.state.locationConfirmDone && <View>
          <Button style={{marginTop: 30}} onPress={() => {
              this.setState({
                locationConfirmDone: true,
                busy: true
              })
              this.confirmLocation()
              setTimeout(async () => {
                this.setModalVisible(!this.state.modalVisible);
                try {
                    var result = await this.state.ci.setFromNew(
                      this.props.sessionIdUrl,
                      this.state.privateUsername,
                      this.state.publicUsername,
                      this.state.lat,
                      this.state.lng,
                      this.props.extraData,
                      this.props.registerUrl
                    );
                    this.setState({
                      busy: false
                    })
                    if (result.status === true) {
                      if (this.props.onIdentity) this.props.onIdentity(result.user);
                      this.props.onSuccessfulRegister && this.props.onSuccessfulRegister(result);
                    } else {
                      this.props.onFailedRegister && this.props.onFailedRegister(result);
                    }
                } catch(err) {
                  this.props.onFailedRegister && this.props.onFailedRegister(err);
                }
              }, 1000);
          }}>
            Confirm
          </Button>
          <Button style={{marginTop: 30}} onPress={() => {
              this.setState({
                locationSelectDone: false
              })
          }}>
            Select different location
          </Button>
        </View>}
        {this.state.busy && <Text
        >&nbsp;</Text>}
        {this.state.busy && <ActivityIndicator animating={this.state.busy} color={Colors.red800} size='large' />}
        <Text
        >&nbsp;</Text>
        {!this.state.busy && this.state.publicUsernameDone && this.state.privateUsernameDone && !this.state.locationSelectDone && !this.state.locationConfirmDone && <Map
          ref={this.state.childRef}
          mapPress={this.mapPress}
          width={this.props.width} height={this.props.height}
        />}
      </View>
    </PaperProvider>
  }
}
const stylez = {
  control: base => ({
    ...base,
    fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    color: 'rgba(0, 0, 0, 0.54)',
    backgroundColor: 'rgb(231, 231, 231)',
    '&:hover': {
      borderColor: 'rgb(98, 0, 238)',
      boxShadow: 'rgb(98, 0, 238)'
    },
    '&:focus': {
      borderColor: 'rgb(98, 0, 238)',
      boxShadow: 'rgb(98, 0, 238)'
    }
  }),
  menu: base => ({
    ...base,
    fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif'
  })
};

const styles = StyleSheet.create({
  container: {
  },
  mt15: {
    marginTop: 15
  },
  mb15: {
    marginBottom: 15
  },
  mtb15: {
    marginTop: 15,
    marginBottom: 15
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
