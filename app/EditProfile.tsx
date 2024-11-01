import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, SafeAreaView, useColorScheme } from 'react-native';
import { auth, db } from '../app/config/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker } from 'react-native-maps';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';

// Define a TypeScript interface for user data
interface UserData {
  username: string;
  phoneNumber: string;
  website: string;
  websiteUrl: string;
  gender: string;
  gps?: string; // optional as it may not be set initially
  region?: string; // optional as it may not be set initially
  country?: string; // optional as it may not be set initially
}

const EditProfile: React.FC = () => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? 'white' : '#000000';
  const backgroundColor = colorScheme === 'dark' ? 'black' : 'white';

  const [userData, setUserData] = useState<UserData | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [gps, setGps] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<Location.LocationGeocodedAddress | null>(null);
  const [region, setRegion] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        console.log("No user is currently logged in.");
        return;
      }

      const userId = auth.currentUser.uid;
      console.log("Fetching user data for UID:", userId);

      try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
          console.log("User data fetched successfully:", userDoc.data());
        } else {
          console.log("No user data found.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      } else {
        Alert.alert("Location permission not granted");
      }
    };

    fetchUserData();
    fetchLocation();
  }, []);

  useEffect(() => {
    const fetchRegionAndCountry = async () => {
      if (selectedLocation) {
        const [placemark] = await Location.reverseGeocodeAsync(selectedLocation);
        if (placemark) {
          setRegion(placemark.region || placemark.name || '');
          setCountry(placemark.country || '');
          setDistrict(placemark.district || placemark.name || '');
        }
      }
    };
    fetchRegionAndCountry();
  }, [selectedLocation]);

  const handleMapLocation = () => {
    if (selectedLocation) {
      const gpsCoordinates = `${selectedLocation.latitude}, ${selectedLocation.longitude}`;
      setGps(gpsCoordinates);
      closeBottomSheet();
    }
  };

  const openBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const closeBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData((prevState) => prevState ? { ...prevState, [field]: value } : null);
  };

  const handleSave = async () => {
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const updatedData: UserData = {
        ...userData!,
        gps,
        region,
        country,
      };

      await updateDoc(userDocRef, updatedData);
      Alert.alert("Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error updating profile", error.message);
    }
  };

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        {userData && (
          <>
            <View style={styles.label}>
              <Text style={{ color: textColor }}>Username:</Text>
              <TextInput
                style={[styles.input,{color:textColor}]}
                placeholder="Username"
                value={userData.username}
                onChangeText={(text) => handleInputChange('username', text)}
              />
            </View>
            <TextInput
              style={[styles.input,{color:textColor}]}
              placeholder="Phone Number"
              value={userData.phoneNumber}
              onChangeText={(text) => handleInputChange('phoneNumber', text)}
            />
            <TextInput
              style={[styles.input,{color:textColor}]}
              placeholder="Website"
              value={userData.website}
              onChangeText={(text) => handleInputChange('website', text)}
            />
            <TextInput
             style={[styles.input,{color:textColor}]}
              placeholder="Website URL (with https://)"
              value={userData.websiteUrl}
              onChangeText={(text) => handleInputChange('websiteUrl', text)}
            />
            <Picker
              selectedValue={userData.gender}
              onValueChange={(itemValue) => handleInputChange('gender', itemValue)}
              style={[styles.picker,{color:textColor}]}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
            <Button title="Set Location" onPress={openBottomSheet} />
            <Text style={{ color: textColor }}>GPS: {gps}</Text>
            <TextInput
              value={userData.gps || ''}
              style={[styles.input,{color:textColor}]}
              editable={false}
              
            />
            <Text style={{ color: textColor }}>Region: {region}</Text>
            <TextInput
              value={userData.region || ''}
              editable={false}
              style={[styles.input,{color:textColor}]}
            />
            <Text style={{ color: textColor }}>Country: {country}</Text>
            <TextInput
              value={userData.country || ''}
              editable={false}
              style={[styles.input,{color:textColor}]}
            />
            <Button title="Save Profile" onPress={handleSave} />
          </>
        )}

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={['70%']}
        >
          <View style={{ flex: 1 }}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: selectedLocation?.latitude || location?.coords.latitude || 37.78825,
                longitude: selectedLocation?.longitude || location?.coords.longitude || -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={(e) => {
                const coords = e.nativeEvent.coordinate;
                setSelectedLocation(coords);
                console.log(region, district, country)
              }}
            >
              {selectedLocation && <Marker coordinate={selectedLocation} />}
            </MapView>
            <Button title="Select this Location" onPress={handleMapLocation} />
          </View>
        </BottomSheetModal>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    display: 'flex',
    flexDirection: 'row',
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 8,
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: 8,
  },
});
