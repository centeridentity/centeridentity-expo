import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { TextInput, Text, Menu, Button, Divider, Title, Subheading, List, ActivityIndicator } from 'react-native-paper';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Circle, Marker } from 'react-google-maps';

import CenterIdentity from 'centeridentity';

import CredentialLabel from '../CredentialLabel/CredentialLabel';
import CredentialMenu from '../CredentialMenu/CredentialMenu';
import CredentialQrCode from '../CredentialQrCode/CredentialQrCode';
import CredentialScanner from '../CredentialScanner/CredentialScanner';
import CredentialTextInput from '../CredentialTextInput/CredentialTextInput';
import IdentityInput from '../IdentityInput/IdentityInput';
import IdentityMenu from '../IdentityMenu/IdentityMenu';
import IdentityQrCode from '../IdentityQrCode/IdentityQrCode';
import IdentityScanner from '../IdentityScanner/IdentityScanner';
import ImagePicker from '../ImagePicker/ImagePicker';
import LocationPicker from '../LocationPicker/LocationPicker';
import Map from '../Map/Map';
import MyIdentityInput from '../MyIdentityInput/MyIdentityInput';
import CredentialIssueButton from '../CredentialIssueButton/CredentialIssueButton';

// {
//   name: '',
//   note: '',
//   startDate: '',
//   endDate: '',
//   image: '',
//   location: {
//     lat: 37.9838,
//     lng: 23.7275
//   }
// }
export default class CredentialCreateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dateModalVisible: false,
      credential: {},
      mapCircles: [],
      preview: [],
      expanded: {},
      icons: {
        text: 'text',
        list: 'menu',
        qr: 'card',
        camera: 'camera',
        button: 'card',
        map: 'pin',
        credential_templates: 'disc'
      },
      fieldTypes: {
        text: [
          CredentialLabel,
          CredentialTextInput,
          IdentityInput,
          MyIdentityInput
        ],
        list: [
          CredentialMenu,
          IdentityMenu,
        ],
        qr: [
          CredentialQrCode,
          IdentityQrCode,
        ],
        camera: [
          CredentialScanner,
          IdentityScanner,
        ],
        button: [
          CredentialIssueButton,
          ImagePicker,
        ],
        map: [
          LocationPicker,
          Map
        ]
      },
      formItems: [],
      selectedComponent: null,
      selectedComponentProps: {},
      selectedComponentKey: null,
      formName: null,
      formLink: null,
      busy: false
    }
    this.getCredentials();
  }

  handlePress = () => {
    this.setState({expanded: !expanded});
  }

  changeName = (value) => {
    
    this.setState({
      credential: {...this.state.credential,
        name: value
      }
    })
  }

  changeNote = (value) => {
    this.setState({
      credential: {...this.state.credential,
        note: value
      }
    })
  }

  changeStartDate = (startDate) => {
    this.setState({
      credential: {...this.state.credential,
        startDate: startDate
      }
    })
  }

  changeEndDate = (endDate) => {
    this.setState({
      credential: {...this.state.credential,
        endDate: endDate
      }
    })
  }

  changeImage = (image) => {
    this.setState({
      credential: {...this.state.credential,
        image: image
      }
    })
  }

  menuVisible = (value) => {
    this.setState({
      visible: value
    })
  }

  dateModalVisible = (value) => {
    this.setState({
      dateModalVisible: value
    })
  }

  setImageUploading = (value) => {
    this.setState({
      imageUploading: value
    })
  }

  mapPress = (e) => {
    console.log(e.latLng.lat());
    console.log(e.latLng.lng());
    this.setState({
      credential: {...this.state.credential,
        location: {lat: e.latLng.lat(), lng: e.latLng.lng()}
      }
    })
  }

  saveCredential = async () => {
    const { credential } = this.state;
    var credcopy = JSON.parse(JSON.stringify(credential));
    credcopy.identity = credcopy.identity && this.props.ci.toObject(await this.props.ci.createUser(credcopy.identity.username));
    credcopy.issuer = this.props.ci.toObject(this.props.me);

    var fieldsSorted = fields.sort((a, b) => {
      if(a.name.toLowerCase() > b.name.toLowerCase()) return -1;
      if(a.name.toLowerCase() < b.name.toLowerCase()) return 1;
      return 0;
    });

    var messageToSign = fields.map((field) => {
      return field.toString()
    }).join();

    credcopy.signature = await this.props.ci.sign(messageToSign, this.props.me);
    credcopy.link = await this.props.ci.getCredentialLink(credcopy);
    this.setState({
      credential: credcopy,
      credentialLink: credential.link
    })
    console.log(JSON.stringify(this.state.credential, null, 2))
    await this.props.ci.addCredential(this.props.me, credcopy);
    this.state.credentials.push({credential: credcopy})
    await this.setState({
      credentials: this.state.credentials
    });
  }

  getCredentials = async () => {
    var credentials = await this.props.ci.getDataByCollection(this.props.me, 'credential_templates');
    console.log(credentials);
    var used_username_signatures = [];
    var newCreds = credentials.map((credential) => {
      return credential.credential;
    })
    this.setState({
      credentials: newCreds
    })
  }

  addField = () => {
    let {
      formItems,
      selectedComponent,
      selectedComponentProps,
      selectedComponentKey
    } = this.state;
    let item = {
      component: selectedComponent,
      props: selectedComponentProps,
      key: selectedComponentKey
    }
    formItems.push(item);
    this.setState({
      formItems: formItems,
      selectedComponent: null,
      selectedComponentProps: {},
      confirmation: true,
    })
  }

  saveForm = async () => {
    const formIdentity = await this.props.ci.createUser(this.state.formName)
    const formTemplate = {};
    this.state.formItems.map((item) => {
      formTemplate[item.key] = {key: item.key, ...item.props}
    })
    formTemplate.identity = formIdentity;
    this.props.ci.addCredential(
      this.props.me,
      formTemplate,
      null,
      'credential_templates'
    )
    this.setState({
      formItems: [],
      selectedComponent: null,
      selectedComponentProps: {},
      selectedComponentKey: null,
      formName: null,
      formLink: null,
      busy: false,
      confirmation: false
    })
  }

  render() {
    const { 
      credential,
      visible,
      dateModalVisible,
      fieldTypes,
      expanded,
      icons,
      formItems,
      selectedComponent,
      selectedComponentProps,
      selectedComponentKey,
      confirmation,
      formName,
      formLink,
      busy
    } = this.state;

    const Tag = selectedComponent;
    return (<View style={styles.container}>
      <View style={styles.row}>
        <Subheading>Tools</Subheading>
        <List.AccordionGroup>
        {this.state.credentials && this.state.credentials.length > 0 && <List.Accordion
            title='saved form templates'
            id='saved forms'
            left={props => <List.Icon {...props} icon={icons['credential_templates']} />}>
            <CredentialMenu
              ci={this.props.ci}
              credentials={this.state.credentials}
              onPress={()=>{this.setState({busy: true})}}
              setLink={(credential, link) => {
                this.setState({busy: false})
                let formItems = Object.keys(credential)
                .filter(key => {
                  return ['identity', 'link'].indexOf(key) > -1 ? false : true
                })
                .map(key => {
                  return {
                    component: CredentialTextInput,
                    props: credential[key],
                    key: key
                  };
                })
                
                this.setState({
                  formName: credential.identity.username,
                  formItems: formItems,
                  clickedOpen: true,
                  formLink: link
                })
              }}
            />
          </List.Accordion>}
          {this.state.credentials && this.state.credentials.length > 0 && <View
            style={{
              marginTop: 15,
              borderBottomColor: 'black',
              borderBottomWidth: 1,
            }}
          />}
          {
            Object.keys(fieldTypes).map((key) => {
              return (<List.Accordion
                title={key}
                id={key}
                left={props => <List.Icon {...props} icon={icons[key]} />}>
                  {fieldTypes[key].map((item) => {
                    return <List.Item
                      style={styles.listItem}
                      key={item.label}
                      title={item.label}
                      left={() => <List.Icon icon={item.icon} />}
                      onPress={() => {
                        this.setState({
                          selectedComponent: item
                        });
                      }}
                    />
                  })}
              </List.Accordion>)
            })
          }
        </List.AccordionGroup>
      </View>
      <View style={styles.row}>
        {busy && <ActivityIndicator size={100} />}
        {selectedComponent && <View>
          <Subheading>Selected tool: {selectedComponent.label}</Subheading>
          <TextInput style={styles.propField} label='key' onChange={(e) => {
            this.setState({selectedComponentKey: e.currentTarget.value})
          }}></TextInput>
          {Object.keys(selectedComponent.propTypes).map(prop => {
            return <TextInput style={styles.propField} label={prop} onChange={(e) => {
              selectedComponentProps[prop] = e.currentTarget.value
              this.setState({selectedComponentProps})
            }}></TextInput>
          })}
          <Button style={styles.propField} onPress={() => {this.addField()}}>Add</Button>
        </View>}
        {confirmation && !selectedComponent && <Subheading style={{color: 'rgb(98, 0, 238)'}}>Field added!</Subheading>}
      </View>
      {selectedComponent && selectedComponentProps && <View style={styles.row}>
          <Subheading>Field preview</Subheading>
          <Tag {...selectedComponentProps} />
      </View>}
      {formItems.length > 0 && <View style={styles.row}>
        <Subheading>Form preview:</Subheading>
        {formItems.map((item) => {
          const Component = item.component;
          return <Component style={styles.propField} {...item.props} />
        })}
        <View
          style={{
            marginTop: 15,
            borderBottomColor: 'black',
            borderBottomWidth: 1,
          }}
        />
        <TextInput style={styles.propField} onChange={(e) => {this.setState({formName: e.currentTarget.value})}} value={this.state.formName} label='Form name (required)' />
        <TextInput style={styles.propField} value={this.state.formLink} label='Form link' />
        <Button style={styles.propField} onPress={() => {this.saveForm()}} disabled={!formName && (formName && formName.length === 0)}>Save as template</Button>
        <Button style={styles.propField} onPress={() => {this.saveCredential()}} disabled={!formName && (formName && formName.length === 0)}>Save credential</Button>
      </View>}
      {/* <TextInput
        label="Name"
        value={credential.name}
        onChange={(e) => {this.changeName(e.currentTarget.value)}}
      ></TextInput>
      <Subheading>Start date</Subheading>
      <DatePicker
        selected={credential.startDate}
        onChange={date => this.changeStartDate(date)}
        showTimeSelect
        dateFormat="MMMM d, yyyy h:mm aa"
      />
      {credential.image && <Subheading>Image</Subheading>}
      {credential.image && <Image
        style={{
          width: 50,
          height: 50,
        }}
        source={{uri: 'https://siasky.net/' + credential.image}}
      ></Image>}
      <ImagePicker
        disabled={this.state.imageUploading}
        setImageUploading={this.setImageUploading}
        setImageLink={this.changeImage}
      ></ImagePicker>
      <Subheading>Location</Subheading>
      <LocationPicker
        mapPress={(e) => {this.mapPress(e)}}
        markers={[this.state.credential.location]}
        circles={this.state.mapCircles}
        width={400}
        height={400}
      />
      <Button
        onPress={() => {this.props.saveCredential(this.state.credential)}}
        disabled={
          this.state.credential.name.length <= 0 || 
          this.state.credential.startDate.length <= 0 ||
          this.state.credential.endDate.length <= 0 ||
          this.state.imageUploading
        }
      >Save credential</Button> */}
    </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: '100%'
  },
  row: {
    width: 300,
    marginLeft: 25
  },
  listItem: {
    marginLeft: 25
  },
  propField: {
    marginTop: 15
  }
})
