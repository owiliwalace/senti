import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Button, SafeAreaView, Alert, TouchableOpacity, useColorScheme, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { db } from '../../app/config/firebaseConfig';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import MapView, { Marker } from 'react-native-maps';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const PQ2: React.FC = () => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? 'white' : '#000000';
  const backgroundColor = colorScheme === 'dark' ? 'black' : 'white';
  
  const [street, setStreet] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [managementPersonnel, setManagementPersonnel] = useState('');
  const [gps, setGps] = useState<string | null>(null);
  const [generalManager, setGeneralManager] = useState('');
  const [partnership, setPartnership] = useState('');
  const [netWorth, setNetWorth] = useState('');
  const [locationDetails, setLocationDetails] = useState<string>(''); // To hold city and country

  // Bottom Sheet States
  const [bottomSheetModalVisible, setBottomSheetModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({ latitude: -1.286389, longitude: 36.817223 }); // Default location
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      setEmail(user.email!);
      fetchUserPhone();
      fetchPQ2Data(); // Fetch PQ2 data on mount
    }
  }, [user]);

  const fetchUserPhone = async () => {
    const userCollection = collection(db, 'users');
    const userQuery = query(userCollection, where('email', '==', user?.email));
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data();
      setTelephone(userData.phone); // Assuming 'phone' is the field name in your Firestore
    }
  };

  const fetchPQ2Data = async () => {
    const pq2Collection = collection(db, 'PQ2');
    const pq2Query = query(pq2Collection, where('email', '==', user?.email)); // Adjust based on your logic
    const pq2Snapshot = await getDocs(pq2Query);

    if (!pq2Snapshot.empty) {
      const pq2Data = pq2Snapshot.docs[0].data();
      setStreet(pq2Data.street);
      setBuildingName(pq2Data.buildingName);
      setCompanyName(pq2Data.companyName);
      setApplicantName(pq2Data.applicantName);
      setManagementPersonnel(pq2Data.managementPersonnel);
      setGps(pq2Data.gps);
      setGeneralManager(pq2Data.generalManager);
      setPartnership(pq2Data.partnership);
      setNetWorth(pq2Data.netWorth);
      // Optionally fetch location details here as well if gps is available
      fetchLocationDetails(pq2Data.gps); 
    }
  };

  const fetchLocationDetails = async (gps: string) => {
    if (gps) {
      const [lat, lon] = gps.split(',').map(Number);
      const reverseGeocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
      if (reverseGeocode.length > 0) {
        const { district,region, country } = reverseGeocode[0];
        setLocationDetails(`${district}, ${region}, ${country}`);
        console.log(district,region, country)
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const docRef = await addDoc(collection(db, 'PQ2'), {
        street,
        buildingName,
        companyName,
        email,
        telephone,
        applicantName,
        managementPersonnel,
        gps,
        generalManager,
        partnership,
        netWorth,
        createdAt: serverTimestamp(),
      });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Data saved successfully!',
      });
      // resetForm(); // Reset the form after submission
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save data!',
      });
      console.error('Error adding document: ', error);
    }
  };

  /* const resetForm = () => {
    setStreet('');
    setBuildingName('');
    setCompanyName('');
    setApplicantName('');
    setManagementPersonnel('');
    setGps(null);
    setGeneralManager('');
    setPartnership('');
    setNetWorth('');
  }; */

  const handleMapLocation = () => {
    const gpsCoordinates = `${selectedLocation.latitude}, ${selectedLocation.longitude}`;
    setGps(gpsCoordinates);
    fetchLocationDetails(gpsCoordinates); // Fetch location details on GPS selection
    setBottomSheetModalVisible(false);
  };

  // Handle Bottom Sheet Modal
  const openBottomSheet = useCallback(() => {
    setBottomSheetModalVisible(true);
    bottomSheetModalRef.current?.present();
  }, []);

  const closeBottomSheet = useCallback(() => {
    setBottomSheetModalVisible(false);
    bottomSheetModalRef.current?.dismiss();
  }, []);

  return (
    <SafeAreaView style={{ width: '100%', backgroundColor }}>
      <BottomSheetModalProvider>
        <ScrollView>
          <Text style={{ color: textColor }}>Street: </Text>
          <TextInput
            value={street}
            onChangeText={setStreet}
            placeholder="Enter street"
            style={{ borderWidth: 1, marginBottom: 10, padding: 10, color: textColor }}
            placeholderTextColor={textColor}
          />

          <Text style={{ color: textColor }}>Name of Building: </Text>
          <TextInput
            value={buildingName}
            onChangeText={setBuildingName}
            placeholder="Enter name of building"
            style={{ borderWidth: 1, marginBottom: 10, padding: 10, color: textColor }}
            placeholderTextColor={textColor}
          />

          <Text style={{ color: textColor }}>Name of Company/Firm: </Text>
          <TextInput
            value={companyName}
            onChangeText={setCompanyName}
            placeholder="Enter company/firm name"
            style={{ borderWidth: 1, marginBottom: 10, padding: 10, color: textColor }}
            placeholderTextColor={textColor}
          />

          <Text style={{ color: textColor }}>Email: </Text>
          <TextInput
            value={email}
            editable={false}
            placeholder="Email"
            style={{ borderWidth: 1, marginBottom: 10, padding: 10, color: textColor }}
            placeholderTextColor={textColor}
          />

          <Text style={{ color: textColor }}>Telephone: </Text>
          <TextInput
            value={telephone}
            editable={false}
            placeholder="Telephone"
            style={{ borderWidth: 1, marginBottom: 10, padding: 10, color: textColor }}
            placeholderTextColor={textColor}
          />

          <Text style={{ color: textColor }}>Name of Applicant: </Text>
          <TextInput
            value={applicantName}
            onChangeText={setApplicantName}
            placeholder="Enter name of applicant"
            style={{ borderWidth: 1, marginBottom: 10, padding: 10, color: textColor }}
            placeholderTextColor={textColor}
          />

          <Text style={{ color: textColor }}>Number of Management Personnel: </Text>
          <TextInput
            value={managementPersonnel}
            onChangeText={setManagementPersonnel}
            placeholder="Enter number of personnel"
            style={{ borderWidth: 1, marginBottom: 10, padding: 10, color: textColor }}
            placeholderTextColor={textColor}
            keyboardType='numeric'
          />

          <Text style={{ color: textColor }}>GPS Location: </Text>
          <TouchableOpacity onPress={openBottomSheet} style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}>
            <Text style={{ color: textColor }}>{gps ? gps : 'Select GPS Location'}</Text>
          </TouchableOpacity>

          <Text style={{ color: textColor }}>General Manager: </Text>
          <TextInput
            value={generalManager}
            onChangeText={setGeneralManager}
            placeholder="Enter name of general manager"
            style={{ borderWidth: 1, marginBottom: 10, padding: 10, color: textColor }}
            placeholderTextColor={textColor}
          />

          <Text style={{ color: textColor }}>Partnership: </Text>
          <TextInput
            value={partnership}
            onChangeText={setPartnership}
            placeholder="Enter partnership details"
            style={{ borderWidth: 1, marginBottom: 10, padding: 10, color: textColor }}
            placeholderTextColor={textColor}
          />

          <Text style={{ color: textColor }}>Net Worth: </Text>
          <TextInput
            value={netWorth}
            onChangeText={setNetWorth}
            placeholder="Enter net worth"
            style={{ borderWidth: 1, marginBottom: 10, padding: 10, color: textColor }}
            placeholderTextColor={textColor}
            keyboardType='numeric'
          />

          <Text style={{ color: textColor }}>Location (City, Country): </Text>
          <TextInput
            value={locationDetails}
            editable={false}
            placeholder="Location will be displayed here"
            style={{ borderWidth: 1, marginBottom: 10, padding: 10, color: textColor }}
            placeholderTextColor={textColor}
          />

          <Button title="Submit" onPress={handleSubmit} color="#841584" />
        </ScrollView>

        <BottomSheetModal ref={bottomSheetModalRef} index={0} snapPoints={['50%']}>
          <View style={{ flex: 1 }}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={(e) => {
                const coords = e.nativeEvent.coordinate;
                setSelectedLocation(coords);
              }}
            >
              <Marker coordinate={selectedLocation} />
            </MapView>
            <Button title="Select this Location" onPress={handleMapLocation} />
            <Button title="Close" onPress={closeBottomSheet} />
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
};

export default PQ2;
