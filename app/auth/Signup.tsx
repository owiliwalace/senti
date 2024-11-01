import { Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import React, { useState } from 'react';
import { router, Stack } from 'expo-router';
import { db } from '@/app/config/firebaseConfig'; 
import { collection, addDoc } from 'firebase/firestore';

const Signup = () => {
  const colorScheme = useColorScheme();

  const textColor = colorScheme === 'dark' ? 'white' : '#000000';
const iconColor = colorScheme === 'dark' ? 'white' : 'black';
const backgroundColor = colorScheme === 'dark' ? 'black' : 'white';

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      // Add user to Firestore
      await addDoc(collection(db, 'users'), {
        email: email,
        username: username,
      });
      console.log('User added to Firestore');
      
      // You can also add Firebase Authentication logic here if needed
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
  const handleLogin = () => {
    router.push('/auth/Login');
};

  return (
    <SafeAreaView style={{ backgroundColor: backgroundColor, height: '100%' }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={{ alignContent: 'center', alignSelf: 'center',marginTop:50 }}>
        <Image
          source={require('../../assets/images/auth.png')}
          style={{ width: 110, height: 110, alignSelf: 'center', marginTop: 50 }}
          resizeMode='cover'
        />
        <Image
          source={require('../../assets/images/senti.png')}
          style={{ width: 100, height: 50, alignSelf: 'center', marginTop: 0 }}
          resizeMode='cover'
        />

        <TextInput
          style={[styles.input,{color:textColor,borderColor:iconColor}]}
          placeholderTextColor={textColor}
          placeholder='email'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize="none"
          textContentType="emailAddress"
        />
        <TextInput
           style={[styles.input,{color:textColor,borderColor:iconColor}]}
           placeholderTextColor={textColor}
          placeholder='username'
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={[styles.input,{color:textColor,borderColor:iconColor}]}
          placeholderTextColor={textColor}
          placeholder='password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.signupButton}
          onPress={handleSignup} 
        >
          <Text style={styles.signupText}>
            Sign Up
          </Text>
        </TouchableOpacity>

        <View style={styles.orContainer}>
          <View style={[styles.orLine,{backgroundColor:iconColor}]}></View>
          <Text style={[styles.orText,{color:textColor}]}>Have an Account</Text>
          <View style={[styles.orLine,{backgroundColor:iconColor}]}></View>
        </View>
        <TouchableOpacity
          style={[styles.googleButton,{borderColor:iconColor}]}
          onPress={handleLogin}
        >
          <Text style={{ textAlign: 'center',color:textColor }}>
            Login </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  input: {
    borderWidth: 0.2,
    height: 49,
    width: 310,
    borderRadius: 3,
    justifyContent: 'center',
    paddingLeft: 9,
    marginTop: 5,
  },
  googleButton: {
    alignItems: 'center',
    borderWidth: 0.41,
    justifyContent: 'center',
    height: 49,
    borderRadius: 5,
    marginTop: 10,
  },
  signupButton: {
    backgroundColor: 'tomato',
    width: 310,
    borderRadius: 9,
    height: 49,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  signupText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 20,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 10,
  },
  orLine: {
    backgroundColor: 'black',
    height: 0.91,
    width: 90,
  },
  orText: {
    fontSize: 12,
    fontWeight: 'semibold',
    marginHorizontal: 10,
  },
});
