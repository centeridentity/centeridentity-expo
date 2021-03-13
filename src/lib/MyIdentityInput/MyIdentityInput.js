import React from 'react';
import CenterIdentity from 'centeridentity';
import { TextInput } from 'react-native-paper';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ci: props.ci || new CenterIdentity(props.apiKey),
      identity: props.identity
    }
    this.getIdentityLink()
  }

  getIdentityLink = async () => {
      var skylink = await this.state.ci.getIdentityLink(this.state.ci.toObject(this.state.identity));
      this.props.onIdentityLink(skylink)
      this.setState({
        identityLink: skylink
      });
  }

  render() {
    return <TextInput label={this.props.label} value={this.state.identityLink || ''} />
  }
}