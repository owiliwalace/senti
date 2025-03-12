import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const Settings = () => {
  const navigation = useNavigation();

  const navigateTo = (screen: string) => {
    navigation.navigate(screen as never); // Fixes TypeScript warning
  };

  return (
    <View style={styles.container}>
      {/** Language */}
      <TouchableOpacity style={styles.option} onPress={() => navigateTo('Language')}>
        <Text style={styles.text}>Language</Text>
      </TouchableOpacity>

      {/** Share */}
      <TouchableOpacity style={styles.option} onPress={() => navigateTo('Share')}>
        <Text style={styles.text}>Share</Text>
      </TouchableOpacity>

      {/** Security */}
      <TouchableOpacity style={styles.option} onPress={() => navigateTo('Security')}>
        <Text style={styles.text}>Security</Text>
      </TouchableOpacity>

      {/** Help */}
      <TouchableOpacity style={styles.option} onPress={() => navigateTo('Help')}>
        <Text style={styles.text}>Help</Text>
      </TouchableOpacity>

      {/** Storage */}
      <TouchableOpacity style={styles.option} onPress={() => navigateTo('Storage')}>
        <Text style={styles.text}>Storage</Text>
      </TouchableOpacity>

      {/** About (Fixed Missing Style) */}
      <TouchableOpacity style={styles.option}>
        <Text style={styles.text}>About</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});
