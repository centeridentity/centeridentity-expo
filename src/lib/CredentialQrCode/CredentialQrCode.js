import React from 'react';

import QRCode from 'react-native-qrcode-svg';


export default class CredentialQrCode extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <QRCode
      value={this.props.value}
      size={this.props.size || 300}
    />
  }
}
