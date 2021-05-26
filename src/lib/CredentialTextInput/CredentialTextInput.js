import React from 'react';
import { TextInput } from 'react-native-paper';
import PropTypes from 'prop-types';


export default class CredentialTextInput extends React.Component {
  static label = 'Text input'
  static icon = 'text'
  constructor(props) {
    super(props)
  }

  render() {
    return (<TextInput {...this.props} />)
  }
}

CredentialTextInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string
}