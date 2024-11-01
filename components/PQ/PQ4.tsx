import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { db, storage } from '../../app/config/firebaseConfig'; // Adjust the import as necessary
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth'; // Import Firebase Authentication

const MAX_FILE_SIZE_MB = 3; // Maximum file size in MB

const PQ4: React.FC = () => {
    const [copyOfPIN, setCopyOfPIN] = useState<any>(null);
    const [copyOfCertificateRegistration, setCopyOfCertificateRegistration] = useState<any>(null);
    const [copyOfTaxCompliance, setCopyOfTaxCompliance] = useState<any>(null);
    const [cr12, setCR12] = useState<any>(null);
    const [copyOfBusinessPermit, setCopyOfBusinessPermit] = useState<any>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setUserEmail(user.email); // Set user email if authenticated
        }
    }, []);

    const selectFile = async (setFile: React.Dispatch<React.SetStateAction<any>>) => {
        try {
            console.log('Opening document picker...');
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
            });

            console.log('Document picker result:', result);

            // Check if the document selection was canceled
            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedFile = result.assets[0];
                const fileSizeMB = selectedFile.size ? selectedFile.size / (1024 * 1024) : 0;

                if (fileSizeMB > MAX_FILE_SIZE_MB) {
                    Alert.alert(`File size exceeds ${MAX_FILE_SIZE_MB}MB.`);
                    return;
                }

                setFile(selectedFile);
                console.log(`Selected document name: ${selectedFile.name}, size: ${fileSizeMB.toFixed(2)} MB`);
            } else {
                console.log('No document selected');
            }
        } catch (error) {
            console.error('Error selecting file:', error);
            Alert.alert('Error', 'Unable to select a document.');
        }
    };

    const uploadFiles = async () => {
        // Check if user is authenticated
        if (!userEmail) {
            Alert.alert('User not authenticated.');
            return;
        }

        try {
            const uploadData: any = {
                email: userEmail,
                
                createdAt: serverTimestamp(),
            };

            // Helper function to handle file upload and storing data
            const handleFileUpload = async (file: any, fieldName: string) => {
                if (file) {
                    const response = await fetch(file.uri);
                    const blob = await response.blob();
                    const storageRef = ref(storage, `pq4/${file.name}`);
                    await uploadBytes(storageRef, blob);
                    const downloadURL = await getDownloadURL(storageRef);

                    // Store the file name and URL in the uploadData object
                    uploadData[`${fieldName}_name`] = file.name;
                    uploadData[`${fieldName}_uri`] = downloadURL;

                    console.log('File uploaded successfully:', file.name);
                }
            };

            // Upload files
            await Promise.all([
                handleFileUpload(copyOfPIN, 'CopyOfPIN'),
                handleFileUpload(copyOfCertificateRegistration, 'CopyOfCertificateRegistration'),
                handleFileUpload(copyOfTaxCompliance, 'CopyOfTaxCompliance'),
                handleFileUpload(cr12, 'CR12'),
                handleFileUpload(copyOfBusinessPermit, 'CopyOfBusinessPermit'),
            ]);

            // Add document to Firestore with all fields
            await addDoc(collection(db, 'PQ4'), uploadData);
            Alert.alert('Files uploaded successfully!');

            // Clear the state after upload
            setCopyOfPIN(null);
            setCopyOfCertificateRegistration(null);
            setCopyOfTaxCompliance(null);
            setCR12(null);
            setCopyOfBusinessPermit(null);
        } catch (error) {
            console.error('Error uploading files:', error);
            Alert.alert('Error uploading files:', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>PQ4 Document Upload</Text>
            <Button title="Select Copy Of PIN" onPress={() => selectFile(setCopyOfPIN)} />
            {copyOfPIN && <Text style={styles.fileName}>Selected Copy Of PIN: {copyOfPIN.name}</Text>}
            
            <Button title="Select Copy Of Certificate Registration" onPress={() => selectFile(setCopyOfCertificateRegistration)} />
            {copyOfCertificateRegistration && <Text style={styles.fileName}>Selected Copy Of Certificate Registration: {copyOfCertificateRegistration.name}</Text>}
            
            <Button title="Select Copy Of Tax Compliance" onPress={() => selectFile(setCopyOfTaxCompliance)} />
            {copyOfTaxCompliance && <Text style={styles.fileName}>Selected Copy Of Tax Compliance: {copyOfTaxCompliance.name}</Text>}
            
            <Button title="Select CR12" onPress={() => selectFile(setCR12)} />
            {cr12 && <Text style={styles.fileName}>Selected CR12: {cr12.name}</Text>}
            
            <Button title="Select Copy Of Business Permit" onPress={() => selectFile(setCopyOfBusinessPermit)} />
            {copyOfBusinessPermit && <Text style={styles.fileName}>Selected Copy Of Business Permit: {copyOfBusinessPermit.name}</Text>}
            
            <Button title="Upload Documents" onPress={uploadFiles} disabled={!userEmail} />
        </View>
    );
};

export default PQ4;

const styles = StyleSheet.create({
    container: {
        
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    fileName: {
        marginVertical: 10,
        fontSize: 16,
        color: 'blue',
    },
});
