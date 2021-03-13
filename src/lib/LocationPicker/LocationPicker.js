import React from 'react';
import { View } from 'react-native';
import Map from '../Map/Map';


export default class LocationPicker extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const circles = [
      // { radius: 100, border: '#FFFF00', background: '#FF0000', coords: this.props.markers[0] },
      // { radius: 200, border: '#FF0000', background: '#FF0000', coords: this.props.markers[0] },
      // { radius: 300, border: '#00FF00', background: '#00FF00', coords: this.props.markers[0] },
      // { radius: 500, border: '#E99D31', background: '#E99D31', coords: this.props.markers[0] },
    ]
    return <Map
      style={this.props.style}
      mapPress={this.props.mapPress}
      width={this.props.width} height={this.props.height}
      markers={this.props.markers}
      circles={circles}
    />
  }
}