import React from 'react';
import { TextInput } from 'react-native-paper';
import PropTypes from 'prop-types';

import CenterIdentity from 'centeridentity';

export default class IdentityInput extends React.Component {
  static label = 'Identity input'
  static icon = 'text'
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  importIdentity = async (identityLink) => {
    this.setState({...this.state,
      link: identityLink,
    });
    var identity = await this.props.ci.importConnectionFromSkylink(this.props.me, identityLink, this.props.collection || 'default');
    this.props.setIdentity(identity, identityLink);
    await this.setState({
      identity: identity
    });
  }

  render() {
    return <TextInput
      label={this.props.label}
      value={this.state.link || this.props.link} 
      onChange={(e) => {this.importIdentity(e.currentTarget.value)}} 
      placeholder={this.props.placeholder}
    />
  }
}

IdentityInput.propTypes = {
  label: PropTypes.string,
  link: PropTypes.string,
  placeholder: PropTypes.string,
}
