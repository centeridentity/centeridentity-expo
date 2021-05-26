import React from 'react';
import PropTypes from 'prop-types';

import { Menu, Button, List } from 'react-native-paper';

import CenterIdentity from 'centeridentity';


export default class IdentityMenu extends React.Component {
  static label = 'Credential menu'
  static icon = 'menu'
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    }
  }

  select = async (value) => {
    this.props.onPress();
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
    var creds = credentials || [];
    var credentialOptions = creds.filter((item) => {
      if (used_sigs.indexOf(item.identity.username_signature) >= 0) return false;
      used_sigs.push(item.identity.username_signature);
      return true;
    }).map((item) => {
      return <List.Item
        key={item.signature}
        title={item.identity.username}
        left={() => <List.Icon icon="folder" />}
        onPress={() => {this.select(item)}}
      />
    });
    return <List.Section>
      {this.props.subheader && <List.Subheader>{this.props.subheader}</List.Subheader>}
      {credentialOptions}
    </List.Section>
  }
}

IdentityMenu.propTypes = {
  ci: PropTypes.object,
  subheader: PropTypes.string,
  credentials: PropTypes.array,
  onPress: PropTypes.func,
  setLink: PropTypes.func
}
