import { SafeAreaView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import PQ1 from '@/components/PQ/PQ1';
import PQ2 from '@/components/PQ/PQ2';
import PQ3 from '@/components/PQ/PQ3';
import PQ4 from '@/components/PQ/PQ4';
import PQ5 from '@/components/PQ/PQ5';
import PQ6 from '@/components/PQ/PQ6';
import PQ7 from '@/components/PQ/PQ7';
import PQ8 from '@/components/PQ/PQ8';


interface Item {
  id: string;
  name: string;
  title: string;
}

const data: Item[] = [
  { id: '1', name: 'PQ1', title: 'Registration Documentation' },
  { id: '2', name: 'PQ2', title: 'Pre-qualification Data' },
  { id: '3', name: 'PQ3', title: 'Supervisory Personnel' },
  { id: '4', name: 'PQ4', title: 'Financial Position' },
  { id: '5', name: 'PQ5', title: 'Past Experience' },
  { id: '6', name: 'PQ6', title: 'Sworn Statement' },
  { id: '7', name: 'PQ7', title: 'Confidential Questionnaires' },
  { id: '8', name: 'PQ8', title: 'Litigation History' },
];

const DocumentationDetails: React.FC = () => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  const borderBottomColor = colorScheme === 'dark' ? 'white' : 'black';

  const { id } = useLocalSearchParams();

  const selectedItem = data.find((item) => item.id === id);

  if (!id || !selectedItem) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: textColor }]}>Loading...</Text>
        {!id && <Text style={[styles.title, { color: textColor }]}>No ID provided in the route.</Text>}
        {id && !selectedItem && <Text style={[styles.title, { color: textColor }]}>No item found for ID: {id}</Text>}
      </View>
    );
  }

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          title: `${selectedItem.name} ${selectedItem.title}`,
        }}
      />

      <View style={styles.container}>
        

        
        {/* Conditional Rendering Based on selectedItem.name */}
        {selectedItem.name === 'PQ1' && <PQ1 name={selectedItem.name} title={selectedItem.title}/>}
        {selectedItem.name === 'PQ2' && <PQ2 name={selectedItem.name} title={selectedItem.title} />}
        {/* Add additional conditions for other items */}
        {selectedItem.name === 'PQ3' && <PQ3  name={selectedItem.name} title={selectedItem.title}/>}
        {selectedItem.name === 'PQ4' && <PQ4  name={selectedItem.name} title={selectedItem.title}/>}
        {selectedItem.name === 'PQ5' && <PQ5  name={selectedItem.name} title={selectedItem.title}/>}
        {selectedItem.name === 'PQ6' && <PQ6  name={selectedItem.name} title={selectedItem.title}/>}
        {selectedItem.name === 'PQ7' && <PQ7 name={selectedItem.name} title={selectedItem.title} />}
        {selectedItem.name === 'PQ8' && <PQ8  name={selectedItem.name} title={selectedItem.title}/>}
      </View>
    </SafeAreaView>
  );
};

export default DocumentationDetails;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    //padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
