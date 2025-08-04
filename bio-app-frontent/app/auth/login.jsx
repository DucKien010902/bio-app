import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import axiosClient from '../../api/apiConfig';

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [canUseBiometric, setCanUseBiometric] = useState(false);

  useEffect(() => {
    const checkStoredCredentials = async () => {
      const storedPhone = await AsyncStorage.getItem('phoneNumber');
      const storedToken = await AsyncStorage.getItem('token');

      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (storedPhone && storedToken && compatible && enrolled) {
        setCanUseBiometric(true);
      }
    };

    checkStoredCredentials();
  }, []);

  const handleBiometricLogin = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Xác thực vân tay để đăng nhập',
      fallbackLabel: 'Nhập mật khẩu',
      cancelLabel: 'Hủy',
    });

    if (result.success) {
      router.replace('/(tabs)/home');
    } else {
      Alert.alert('Thất bại', 'Xác thực không thành công!');
    }
  };

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    try {
      setLoading(true);
      const res = await axiosClient.post('/users/checkaccount', {
        phoneNumber,
        password,
      });

      const user = res.data.user;
      const token = res.data.token;

      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('phoneNumber', user.phoneNumber);
      await AsyncStorage.setItem('token', token);

      router.replace('/(tabs)/home');
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Đăng nhập thất bại';
      Alert.alert('Lỗi', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>GennovaX</Text>
        <Text style={styles.subText}>Vui lòng đăng nhập để tiếp tục</Text>

        <TextInput
          style={styles.input}
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={handleLogin}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Đăng nhập</Text>
          )}
        </TouchableOpacity>

        {canUseBiometric && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#52c41a', marginTop: 12 }]}
            onPress={handleBiometricLogin}
          >
            <Text style={styles.buttonText}>Đăng nhập bằng vân tay</Text>
          </TouchableOpacity>
        )}

        <View style={styles.links}>
          <Text
            style={styles.link}
            onPress={() => router.push('/auth/register')}
          >
            Đăng kí tài khoản 👈
          </Text>
          <Text
            style={styles.link}
            onPress={() =>
              Alert.alert('Thông báo', 'Tính năng đang phát triển')
            }
          >
            Quên mật khẩu ?
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1890ff',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'cursive',
  },
  subText: {
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'cursive',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#1890ff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  links: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  link: {
    color: '#1890ff',
  },
});

export default LoginScreen;
