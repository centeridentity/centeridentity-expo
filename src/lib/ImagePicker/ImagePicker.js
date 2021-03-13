import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import * as ExpoImagePicker from 'expo-image-picker';

export default class ImagePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      video: ''
    }
    this.props.setImageUploading(false);
  }

  createAvatar = () => {
    const canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var imageData = ctx.createImageData(100,100);
    ctx.putImageData(imageData, 20, 20);
    document.getElementsByTagName('body').append(canvas)
  }

  pickVideo = async () => {
    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      this.handleImagePicked(result.uri, 'video');
    }
  };

  pickImage = async () => {
    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      this.handleImagePicked(result.uri, 'image');
    }
  };
  
  handleImagePicked = async (pickerResult, type) => {
    let uploadResponse, uploadResult;

    try {
      this.props.setImageUploading(true);
      if (!pickerResult.cancelled) {
        uploadResponse = await this.uploadImageAsync(pickerResult);
        uploadResult = await uploadResponse.json();

        this.props.setImageLink(uploadResult.skylink);
      }
    } catch (e) {
      console.log({ uploadResponse });
      console.log({ uploadResult });
      console.log({ e });
      alert('Upload failed, sorry :(');
    } finally {
      this.props.setImageUploading(false);
    }
  }

  uploadImageAsync = async (pickerResult) => {
    console.log(pickerResult);
  
    // Note:
    // Uncomment this if you want to experiment with local server
    //
    // if (Constants.isDevice) {
    //   apiUrl = `https://your-ngrok-subdomain.ngrok.io/upload`;
    // } else {
    //   apiUrl = `http://localhost:3000/upload`
    // }
    let uriParts = pickerResult.split(',');
    let fileType = uriParts[0].split('/')[1].split(';')[0];
    let fileData = uriParts[uriParts.length - 1];
  
    let apiUrl = 'https://centeridentity.com/sia-upload?filename=file.' + fileType;
    let options = {
      method: 'POST',
      body: JSON.stringify({
        file: fileData
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
  
    return fetch(apiUrl, options);
  }

  render() {
    return <View>
      <Button
        onPress={() => {
          this.pickImage();
        }}
      >
        Pick image
      </Button>
    </View>
  }
}