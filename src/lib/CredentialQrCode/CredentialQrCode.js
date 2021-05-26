import React from 'react';
import PropTypes from 'prop-types';

import QRCode from 'react-native-qrcode-svg';


export default class CredentialQrCode extends React.Component {
  static label = 'Credential QR code'
  static icon = 'card'
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

CredentialQrCode.propTypes = {
  value: PropTypes.string,
  size: PropTypes.number,
}
