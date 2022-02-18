import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, View, Platform, Dimensions } from 'react-native'
import CenterIdentity from 'centeridentity';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Circle, Marker } from 'react-google-maps';
import openMap from 'react-native-open-maps';
import propTypes from 'prop-types';


export default class Map extends React.Component {
  static label = 'Map'
  static icon = 'pin'
  constructor(props) {
    super(props);
    const {markers, circles} = this.props
    this.state = {
      markers,
      circles
    }
  }
  render () {
    const { 
      height = 600,
      width = '100%',
      style,
      source,
      option,
      onLoadStart,
      onLoad,
      onError,
      onLoadEnd,
      onMessage,
      renderLoading,
      renderError
    } = this.props
    const {
      markers,
      circles
    } = this.state
    const location = markers ? markers[0] : {lat: 37.9838, lng: 23.7275};
    return <View style={{...this.props.style, width, height}}>
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        defaultZoom={15}
        provider={PROVIDER_GOOGLE}
        onPress={async (e)=> {
          var marker = await this.props.mapPress(e)
          if (marker && marker.lat && marker.lng) {
            this.setState({
              markers: [{lat: parseFloat(marker.lat), lng: parseFloat(marker.lng)}]
            })
          }
        }}
      >
        {
          circles && circles.map((circle, index) => 
            <Circle
              center={circle.coords}
              radius={circle.radius}
              options={{
                fillColor: circle.background,
                strokeColor: circle.border
              }}
              key={index}
            />
          )
        }
        {markers && markers.filter((coords) => {
          return coords ? true : false;
        }).map((coords)=> {
          console.log(coords);
          return <Marker
            position={{lat: coords.lat, lng: coords.lng}}
            onClick={() => {
              if(window && window.open) {
                //window.open('https://www.google.com/maps/dir/?api=1&destination=' + coords.lat + ',' + coords.lng)
              } else {
                //openMap({ latitude: coords.lat, longitude: coords.lng })
              }
            }}
          />
        })}
      </MapView>
    </View>
  }
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

Map.propTypes = {
  height: PropTypes.number,
  width: PropTypes.string,
  style: PropTypes.object,
  source: PropTypes.string,
  option: PropTypes.string,
  onLoadStart: PropTypes.func,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  onLoadEnd: PropTypes.func,
  onMessage: PropTypes.func,
  renderLoading: PropTypes.bool,
  renderError: PropTypes.bool
}
