import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';

const Index = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [district, setDistrict] = useState('');
  const [region, setRegion] = useState('');

  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? 'white' : '#000000';

  useEffect(() => {
    (async () => {
      // Request location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      console.log("Location permission granted");

      // Get the user's current location
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      console.log("Location fetched: ", location);

      // Reverse geocode to get city and country
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      console.log("Reverse geocoded location: ", reverseGeocode);

      if (reverseGeocode.length > 0) {
        setCity(reverseGeocode[0].city || 'Unknown City');
        setCountry(reverseGeocode[0].country || 'Unknown Country');
        setDistrict(reverseGeocode[0].district || 'Unknown District');
        setRegion(reverseGeocode[0].region|| 'Unknown County');
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : (
        <>
       
          <Text style={[styles.text, { color: textColor }]}>
{country ? country : 'Loading...'}
          </Text>
          <Text style={[styles.text, { color: textColor }]}>
 {district ? district : 'Loading...'},{region ? region : 'Loading...'}
          </Text>

        </>
      )}
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
   
  },
  text: {
    fontSize: 17,
    marginVertical: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
