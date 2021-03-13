import React from 'react';

import QRCode from 'react-native-qrcode-svg';


export default class IdentityQrCode extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <QRCode
      value={this.props.value}
      width={this.props.width || 300}
    />
  }
}
