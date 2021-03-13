import React from 'react';

import { Menu, Button, List } from 'react-native-paper';

import CenterIdentity from 'centeridentity';


export default class IdentityMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  select = async (value) => {
    await this.setState({
      identity: value,
      visible: false,
      busy: true
    });
    var link = await this.props.ci.getIdentityLink(value);
    this.props.setLink(value, link);
    this.setState({
      busy: false,
      link: link
    });
  }

  render() {
    var identityElements = this.props.identities.map((identity) => {
      return <List.Item
        key={identity.username_signature}
        title={identity.username} 
        left={() => <List.Icon icon="head" />}
        onPress={() => {this.select(identity)}}
      />
    });
    return <List.Section>
      <List.Subheader>{this.props.subheader}</List.Subheader>
      {identityElements}
    </List.Section>
  }
}