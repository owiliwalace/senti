import { SafeAreaView, StyleSheet, Text, useColorScheme, View, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import { db } from '../app/config/firebaseConfig'; // Ensure the correct path to your Firebase config
import { collection, query, where, getDocs } from 'firebase/firestore';

const NearMe = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [district, setDistrict] = useState('');
  const [region, setRegion] = useState('');
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setRegion(reverseGeocode[0].region || 'Unknown County');

    
        fetchTenders(reverseGeocode[0].region);
      }
    })();
  }, []);

  const fetchTenders = async (userRegion) => {
    try {
      const q = query(collection(db, 'tender'), where('location', '==', userRegion));
      const querySnapshot = await getDocs(q);
      const tenderData = [];
      querySnapshot.forEach((doc) => {
        tenderData.push({ id: doc.id, ...doc.data() });
      });
      setTenders(tenderData);
    } catch (error) {
      console.error('Error fetching tenders:', error);
      setErrorMsg('Failed to load tenders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: { seconds: number; }) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000); 
      return date.toLocaleDateString(); 
    }
    return 'Unknown Date';
  };

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          title: `${region} Tenders`
        }}
      />

      <View>
        {errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : (
          <>
                       {loading ? (
              <ActivityIndicator size="large" color={textColor} />
            ) : (
              <FlatList
                data={tenders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.tenderItem}>
                    <Text style={[styles.text, { color: textColor }]}>
                      <Text style={styles.label}>Tender Title: </Text>{item.tender_title}
                    </Text>
                    <Text style={[styles.text, { color: textColor }]}>
                      <Text style={styles.label}>Due Date: </Text>{formatDate(item.due_date)}
                    </Text>
                    <Text style={[styles.text, { color: textColor }]}>
                      <Text style={styles.label}>Email: </Text>{item.email}
                    </Text>
                  
                    <Text style={[styles.text, { color: textColor }]}>
                      <Text style={styles.label}>Phone: </Text>{item.phone}
                    </Text>
                  </View>
                )}
              />
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default NearMe;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  tenderItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  label: {
    fontWeight: 'bold',
  },
});
