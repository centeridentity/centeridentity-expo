import React from 'react';
import { Subheading } from 'react-native-paper';
import PropTypes from 'prop-types';


export default class CredentialLabel extends React.Component {
  static label = 'Label'
  static icon = 'text'
  constructor(props) {
    super(props)
  }

  render() {
    return (<Subheading {...this.props}>{this.props.text}</Subheading>)
  }
}

CredentialLabel.propTypes = {
  text: PropTypes.string
}