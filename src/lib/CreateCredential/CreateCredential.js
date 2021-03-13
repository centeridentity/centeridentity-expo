import React from 'react';
import { View, Image } from 'react-native';
import { TextInput, Text, Menu, Button, Divider, Title, Subheading } from 'react-native-paper';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Circle, Marker } from 'react-google-maps';

import CenterIdentity from 'centeridentity';

import ImagePicker from '../ImagePicker/ImagePicker';
import LocationPicker from '../LocationPicker/LocationPicker';


export default class CreateCredential extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dateModalVisible: false,
      credential: {
        name: '',
        note: '',
        startDate: '',
        endDate: '',
        image: '',
        location: {
          lat: 37.9838,
          lng: 23.7275
        }
      },
      mapCircles: []
    }
  }

  changeName = (value) => {
    
    this.setState({
      credential: {...this.state.credential,
        name: value
      }
    })
  }

  changeNote = (value) => {
    this.setState({
      credential: {...this.state.credential,
        note: value
      }
    })
  }

  changeStartDate = (startDate) => {
    this.setState({
      credential: {...this.state.credential,
        startDate: startDate
      }
    })
  }

  changeEndDate = (endDate) => {
    this.setState({
      credential: {...this.state.credential,
        endDate: endDate
      }
    })
  }

  changeImage = (image) => {
    this.setState({
      credential: {...this.state.credential,
        image: image
      }
    })
  }

  menuVisible = (value) => {
    this.setState({
      visible: value
    })
  }

  dateModalVisible = (value) => {
    this.setState({
      dateModalVisible: value
    })
  }

  setImageUploading = (value) => {
    this.setState({
      imageUploading: value
    })
  }

  mapPress = (e) => {
    console.log(e.latLng.lat());
    console.log(e.latLng.lng());
    this.setState({
      credential: {...this.state.credential,
        location: {lat: e.latLng.lat(), lng: e.latLng.lng()}
      }
    })
  }

  render() {
    const { credential, visible, dateModalVisible } = this.state;
    const date = new Date()
    return (<View>
      <TextInput
        label="Name"
        value={credential.name}
        onChange={(e) => {this.changeName(e.currentTarget.value)}}
      ></TextInput>
      <TextInput
        label="Note"
        value={credential.note}
        onChange={(e) => {this.changeNote(e.currentTarget.value)}}
      ></TextInput>
      <Subheading>Start date</Subheading>
      <DatePicker
        selected={credential.startDate}
        onChange={date => this.changeStartDate(date)}
        showTimeSelect
        dateFormat="MMMM d, yyyy h:mm aa"
      />
      <Subheading>End date</Subheading>
      <DatePicker 
        selected={credential.endDate}
        onChange={date => this.changeEndDate(date)}
        showTimeSelect
        dateFormat="MMMM d, yyyy h:mm aa"
      />
      {credential.image && <Subheading>Image</Subheading>}
      {credential.image && <Image
        style={{
          width: 50,
          height: 50,
        }}
        source={{uri: 'https://siasky.net/' + credential.image}}
      ></Image>}
      <ImagePicker
        disabled={this.state.imageUploading}
        setImageUploading={this.setImageUploading}
        setImageLink={this.changeImage}
      ></ImagePicker>
      <Subheading>Location</Subheading>
      <LocationPicker
        mapPress={(e) => {this.mapPress(e)}}
        markers={[this.state.credential.location]}
        circles={this.state.mapCircles}
        width={400}
        height={400}
      />
      <Button
        onPress={() => {this.props.saveCredential(this.state.credential)}}
        disabled={
          this.state.credential.name.length <= 0 || 
          this.state.credential.startDate.length <= 0 ||
          this.state.credential.endDate.length <= 0 ||
          this.state.imageUploading
        }
      >Save credential</Button>
    </View>)
  }
}
