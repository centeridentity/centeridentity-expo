import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, TextInput, Subheading } from 'react-native-paper';

import LocationPicker from '../LocationPicker/LocationPicker';
import CredentialQrCode from '../CredentialQrCode/CredentialQrCode';


export default class DisplayCredential extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { credential } = this.props;
    return <View style={styles.container}>
      <View style={styles.certificateContainer}>
        <View>
          {credential.image && <a target="_blank" href={'https://siasky.net/' + credential.image}><Image
            style={{
              width: 150,
              height: 150,
              margin: 5
            }}
            source={{uri: 'https://siasky.net/' + credential.image}}
          /></a>}
        </View>
        <View>
          <Text style={styles.certTitle}>Title: <Text style={styles.certValue}>{credential.name}</Text></Text>
          <Text style={styles.certTitle}>Instruction: <Text style={styles.certValue}>{credential.note}</Text></Text>
          <Text style={styles.certTitle}>Start date and time: <Text style={styles.certValue}>{credential.startDate}</Text></Text>
          <Text style={styles.certTitle}>End date and time: <Text style={styles.certValue}>{credential.endDate}</Text></Text>
          {credential.verified === true && <Subheading style={styles.verified}>Verified</Subheading>}
          {credential.verified === false && <Subheading style={styles.notverified}>Not verified</Subheading>}
        </View>
      </View>
      {credential.location &&
        <LocationPicker
          mapPress={(e) => {}}
          markers={[credential.location]}
          width={400}
          height={400}
        />
      }
      <CredentialQrCode
        value={credential.link}
        width="100%"
      />
    </View>
  }
}

var styles = StyleSheet.create({
  container: {
    marginTop: 15
  },
  certificateContainer: {
    dislpay: 'flex',
    flexDirection: 'row'
  },
  certificateInfo: {
    dislpay: 'flex',
    flexDirection: 'column'
  },
  certTitle: {
    fontSize: 14,
    margin: 5,
    fontWeight: 'bold'
  },
  certValue: {
    fontSize: 12,
    margin: 5
  },
  verified: {
    fontSize: 20,
    margin: 5,
    color: 'chartreuse'
  },
  notverified: {
    fontSize: 20,
    margin: 5,
    color: 'red'
  },
  qrcode: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    textAlign: 'center'
  }
});
