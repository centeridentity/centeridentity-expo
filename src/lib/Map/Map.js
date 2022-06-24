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
    const location = markers ? markers[0] : {lat: 37.9838, lng: 23.7275};
    this.state = {
      markers,
      circles,
      region: {
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 50,
        longitudeDelta: 50,
      },
      childRef: React.createRef()
    }
  }

  updateRegion(region) {
    this.setState({ region })
  }

  onRegionChangeComplete = (region) => {
    if(region) {
      if(this.lastRegion && this.lastRegion.latitude === region.latitude && this.lastRegion.longitude === region.longitude) return
      this.lastRegion = region
      this.setState({ region });
    } else {
      if(this.lastRegion && this.lastRegion.latitude === this.state.childRef.current.map.getCenter().lat() && this.lastRegion.longitude === this.state.childRef.current.map.getCenter().lng()) return
      region = {
        latitude: this.state.childRef.current.map.getCenter().lat(),
        longitude: this.state.childRef.current.map.getCenter().lng(),
        latitudeDelta: 50,
        longitudeDelta: 50
      }
      this.lastRegion = region
      this.setState({
        region: region
      })
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
    return <View style={{...this.props.style, width, height}}>
      <MapView
        ref={this.state.childRef}
        style={styles.map}
        initialRegion={this.state.region}
        region={this.state.region}
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
        onRegionChangeComplete={this.onRegionChangeComplete}
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
            onClick={async () => {
              await this.props.mapPress(null, coords.lat, coords.lng)
              // if(window && window.open) {
              //   //window.open('https://www.google.com/maps/dir/?api=1&destination=' + coords.lat + ',' + coords.lng)
              // } else {
              //   //openMap({ latitude: coords.lat, longitude: coords.lng })
              // }
            }}
          />
        })}
      </MapView>
    </View>
  }
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
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
