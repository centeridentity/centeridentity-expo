import React from 'react';
import CenterIdentity from 'centeridentity';
import { TextInput } from 'react-native-paper';
import PropTypes from 'prop-types';


export default class MyIdentityInput extends React.Component {
  static label = 'My Identity input'
  static icon = 'text'
  constructor(props) {
    super(props);
    this.state = {
      ci: props.ci || new CenterIdentity(props.apiKey),
      identity: props.identity
    }
    props.identity && this.getIdentityLink()
  }

  getIdentityLink = async () => {
      var skylink = await this.state.ci.getIdentityLink(this.state.ci.toObject(this.state.identity));
      this.props.onIdentityLink(skylink)
      this.setState({
        identityLink: skylink
      });
  }

  render() {
    return <TextInput label={this.props.label} value={this.state.identityLink || ''} placeholder={this.props.placeholder} />
  }
}

MyIdentityInput.propTypes = {
  label: PropTypes.string,
  link: PropTypes.string,
  placeholder: PropTypes.string,
}