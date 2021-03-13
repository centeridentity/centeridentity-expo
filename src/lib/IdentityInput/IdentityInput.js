import React from 'react';
import { TextInput } from 'react-native-paper';

import CenterIdentity from 'centeridentity';

export default class IdentityInput extends React.Component {
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