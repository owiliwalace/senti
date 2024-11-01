import { Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, useColorScheme } from 'react-native';
import React, { useState } from 'react';
import { Stack, Link, router } from 'expo-router';
import { auth } from '../../app/config/firebaseConfig'; // Import Firebase auth
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import the sign-in method

const Login = () => {
    const colorScheme = useColorScheme();

    const textColor = colorScheme === 'dark' ? 'white' : '#000000';
  const iconColor = colorScheme === 'dark' ? 'white' : 'black';
  const backgroundColor = colorScheme === 'dark' ? 'black' : 'white';
  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/'); 
        } catch (error) {
            Alert.alert("Login Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = () => {
        router.push('/auth/Signup');
    };

    return (
        <SafeAreaView style={{ backgroundColor: backgroundColor, height: '100%' }}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={{ alignContent: 'center', marginTop: 40, alignSelf: 'center' }}>
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
                    keyboardType='email-address'
                    autoCapitalize="none"
                    textContentType="emailAddress"
                    style={[styles.input,{borderColor:iconColor,color:textColor}]}
                    placeholder='email'
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor={textColor}
                />

                <TextInput
                    style={[styles.input,{borderColor:iconColor, color:textColor}]}
                    placeholder='password'
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor={textColor}
                />

                <Link href='/auth/ForgotPassword' style={styles.forgotPassword}>Forgot Password </Link>

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.loginText}>
                        {loading ? "Logging in..." : "Log in"}
                    </Text>
                </TouchableOpacity>

                <View style={styles.orContainer}>
                    <View style={[styles.orLine,{backgroundColor:iconColor}]}></View>
                    <Text style={[styles.orText,{color:textColor}]}>OR </Text>
                    <View style={[styles.orLine,{backgroundColor:iconColor}]}></View>
                </View>

                <TouchableOpacity
                    style={[styles.googleButton,{borderColor:iconColor}]}
                    onPress={handleSignup}
                >
                    <Text style={{ textAlign: 'center',color:textColor }}>
                        Create Account </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Login;

const styles = StyleSheet.create({
    input: {
        borderWidth: 0.2,
        height: 49,
        width: 310,
        borderRadius: 1,
        justifyContent: 'center',
        paddingLeft: 9,
        marginTop: 5,
    },
    loginButton: {
        backgroundColor: 'tomato',
        width: 310,
        borderRadius: 9,
        height: 49,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 3,
    },
    loginText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 20,
    },
    forgotPassword: {
        textAlign: 'right',
        marginBottom: 10,
        color: 'blue',
        marginTop: 10,
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    orLine: {
       
        height: 0.91,
        width: 140,
    },
    orText: {
        fontSize: 17,
        fontWeight: 'bold',
        marginHorizontal: 10,
    },
    googleButton: {
        alignItems: 'center',
        borderWidth: 0.41,
        justifyContent: 'center',
        height: 49,
        borderRadius: 5,
        marginTop: 10,
    },
});
