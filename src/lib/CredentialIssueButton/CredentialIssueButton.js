import React from 'react';
import { Button } from 'react-native-paper';
import PropTypes from 'prop-types';
import propTypes from 'prop-types';



export default class CredentialIssueButton extends React.Component {
  static label = 'Credential issue button'
  static icon = 'card'

  issueCredential = async () => {
    const { ci, me, subject, credential } = this.props;
    var messageToSign = (
      credential.name +
      credential.note +
      credential.startDate +
      credential.endDate +
      credential.image +
      credential.location.lat +
      credential.location.lng +
      subject.username +
      subject.username_signature +
      subject.public_key +
      credential.issuer.username +
      credential.issuer.username_signature +
      credential.issuer.public_key +
      credential.identity.username +
      credential.identity.username_signature +
      credential.identity.public_key +
      credential.signature
    )
    var issuedCredential = await ci.issueCredential(
      me,
      subject,
      credential,
      messageToSign
    );
    issuedCredential = JSON.parse(issuedCredential.message);
    issuedCredential.link = await ci.getCredentialLink(issuedCredential);
    this.setState({
      issuedCredential: issuedCredential
    })
    if(this.props.onIssuedCredential) this.props.onIssuedCredential(issuedCredential);
  }

  render() {
    const { credential = {}, subject = {}, label = 'Issue credential to' } = this.props;
    return (
      <Button 
        style={{marginTop: 25}}
        onPress={() => {this.issueCredential()}}
        disabled={!subject || !credential.identity}
      >{label + (subject.username || '')}</Button>
    )
  }
}

CredentialIssueButton.propTypes = {
  me: PropTypes.object,
  ci: PropTypes.object,
  label: PropTypes.string,
  subject: PropTypes.object,
  credential: PropTypes.object,
  onIssuedCredential: propTypes.func
}








