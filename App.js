import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Pressable, Text, Image, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import base64 from 'react-native-base64';

const Stack = createNativeStackNavigator();

function HomeScreen ( { navigation }) {
  const [imageUri, setImage] = useState(null)

  // Function to pick the image on phone using expo-image-picker
  const pickImage = async() => {
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1
    });

    if(!result.canceled) {
      const uri = result.assets[0].uri;

      setImage(uri);
    }
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Pressable onPress={ pickImage } style={styles.button}>
          <Text style={styles.buttonText}>Choose Image</Text>
        </Pressable>

        { imageUri && <Image source={{ uri: imageUri }} style={ styles.image } /> }
      </View>
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={ HomeScreen } option={{ title: 'Add New Photo' }} />
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
  }
});
