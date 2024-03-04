import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Pressable, Text, Image, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import base64 from 'react-native-base64';

const Stack = createNativeStackNavigator();
const host = 'https://nscc-0304263-wordpress-photos.azurewebsites.net';
const username = 'W0304263';
const password = 'OrEQ 4Bw8 YfWL NlCt RDqi k2rH';

function HomeScreen ( { navigation }) {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to pick the image on phone using expo-image-picker
  const pickImage = async() => {
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1
    });

    if(!result.canceled) {
      const img = result.assets[0];

      setImage(img);
    }
  }

  // Api Step 1. Upload featured image to Wordpress
  const uploadPhoto = async () => {
    const endPoint = host + '/wp-json/wp/v2/media';
    const fileName = image.uri.split('/').pop();
    const formData = new FormData();
    const fileType = image.type || 'image/jpeg';

    formData.append('file', { 
      uri: image.uri,
      type: fileType,
      name: fileName
    });

    const result = await fetch(endPoint, {
      method: 'POST',
      headers: {        
        'Content-disposition': 'formdata; filename=' + fileName,
        'Authorization': 'Basic ' + base64.encode(username + ':' + password)
      },
      body: formData
    });

    const response = await result.json();
    const mediaId = response.id;

    return mediaId;
  }

  // Api Step 2. Upload new post to Wordpress
  const submitPost = async () => {

    // Validate inputs
    if(!title || !imageUri){
      alert('Please enter a value for all inputs.');
    }
    {
      console.log('Begin Post Submit');

      setIsLoading(true);      

      // Upload photo and get media id
      //const mediaId = await uploadPhoto();
      //console.log();
      //alert('Uploaded Media Id: ' + mediaId);
      // Create Post Api
      const endPoint = host + '/wp-json/wp/v2/posts';
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('status', 'publish');
      //formData.append('featured_media', mediaId);

      // Create the post
      const result = await fetch(endPoint, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + base64.encode(username + ':' + password)
        },
        body: formData
      });

      const response = await result.json();

      if(response.id) {
        alert('Successfully created Post. ID: ' + response.id);        
      }
      else {
        alert('Oops, something went wrong.');
      }
      
      setIsLoading(false);
    }

  }

  return (
    <ScrollView>
      <View style={styles.container}>

      <TextInput 
          style={ styles.input } 
          placeholder="Title"
          onChangeText={ text => setTitle(text) } 
          defaultValue= { title } />

        <Pressable onPress={ pickImage } style={styles.button}>
          <Text style={styles.buttonText}>Choose Image</Text>
        </Pressable>

        { image && <Image source={{ uri: image.uri }} style={ styles.image } /> }

        <Pressable onPress={ submitPost } style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>

        { isLoading && <ActivityIndicator /> }

      </View>
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Resplash - Add New Photo' component={ HomeScreen } option={{ title: 'Add New Photo' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,    
    alignItems: 'center',
    marginTop: 50,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'slateblue',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'white',
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'cover'
  },
  input: {
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    width: 300,
  }
});
