import React from 'react';

import { Menu, Button, List } from 'react-native-paper';

import CenterIdentity from 'centeridentity';


export default class IdentityMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    }
  }

  select = async (value) => {
    await this.setState({
      identity: value,
      visible: false,
      busy: true
    });
    var link = await this.props.ci.getCredentialLink(value);
    value.link = link;
    this.props.setLink(value, link);
    this.setState({
      busy: false,
      issuerLink: link
    });
  }

  render() {
    const { credentials } = this.props;
    var used_sigs = []
    var credentialOptions = credentials.filter((item) => {
      if (used_sigs.indexOf(item.signature) >= 0) return false;
      used_sigs.push(item.signature);
      return true;
    }).map((item) => {
      return <List.Item
        key={item.signature}
        title={item.name}
        left={() => <List.Icon icon="folder" />}
        onPress={() => {this.select(item)}}
      />
    });
    return <List.Section>
      <List.Subheader>{this.props.subheader}</List.Subheader>
      {credentialOptions}
    </List.Section>
  }
}