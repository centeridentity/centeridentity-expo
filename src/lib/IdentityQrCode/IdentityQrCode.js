import React from 'react';
import PropTypes from 'prop-types';

import QRCode from 'react-native-qrcode-svg';


export default class IdentityQrCode extends React.Component {
  static label = 'Identity QR code'
  static icon = 'card'
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

IdentityQrCode.propTypes = {
  value: PropTypes.string,
  width: PropTypes.number,
}
