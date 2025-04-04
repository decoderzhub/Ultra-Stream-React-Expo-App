import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import { auth } from '../config/firebase';
import { sendEmailVerification } from 'firebase/auth';

const EmailVerificationScreen = ({ navigation, route }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { email } = route.params || {};

  const handleVerify = async () => {
    setLoading(true);
    
    // In a real implementation, we would verify the code
    // For now, we'll just navigate to the Home screen
    // Firebase email verification doesn't actually use a code, it uses a link
    // This is just for UI demonstration purposes
    
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Verification Successful',
        'Your email has been verified. You can now login to your account.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    }, 1500);
  };

  const handleResendCode = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        Alert.alert('Email Sent', 'Verification email has been resent.');
      } else {
        Alert.alert('Error', 'Unable to resend verification email. Please try signing up again.');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </View>
        
        <Text style={styles.title}>Email Verification</Text>
        
        <Text style={styles.description}>
          We've sent a verification link to {email || 'your email address'}. Please check your email and click the link to verify your account.
        </Text>
        
        <Text style={styles.description}>
          For demonstration purposes, you can also enter any code below to simulate verification.
        </Text>
        
        <View style={styles.codeInputContainer}>
          <Input
            value={verificationCode}
            onChangeText={setVerificationCode}
            placeholder="Enter verification code"
            keyboardType="number-pad"
          />
        </View>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <Button
          title="Verify Email"
          onPress={handleVerify}
          loading={loading}
          style={styles.button}
        />
        
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the email? </Text>
          <Button
            title="Resend"
            onPress={handleResendCode}
            primary={false}
            style={styles.resendButton}
            textStyle={styles.resendButtonText}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#9C27B0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 40,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  codeInputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  errorText: {
    color: '#F44336',
    marginBottom: 16,
  },
  button: {
    width: '100%',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  resendText: {
    fontSize: 14,
    color: '#757575',
  },
  resendButton: {
    marginVertical: 0,
    paddingHorizontal: 0,
    height: 'auto',
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  resendButtonText: {
    fontSize: 14,
    color: '#9C27B0',
    fontWeight: '600',
  },
});

export default EmailVerificationScreen;
