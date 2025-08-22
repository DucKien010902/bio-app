import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
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
  const [secure, setSecure] = useState(true);

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
    <ImageBackground
      source={{
        uri: 'https://p16-hera-sg.larksuitecdn.com/tos-alisg-i-hn4qzgxq2n-sg/b2432d9ed2dc49b68258bf9f7bfae6fa.avif~tplv-hn4qzgxq2n-image-v1:0:0.image',
      }}
      style={styles.background}
      resizeMode="cover" // tương đương background-size: cover
    >
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.container}
      >
        <View style={styles.inner}>
          <Text style={styles.logo}>GennovaX</Text>
          <Text style={styles.subText}>Vui lòng đăng nhập để tiếp tục</Text>

          {/* Số điện thoại */}
          {/* Số điện thoại */}
          <View style={{ width: '100%', marginBottom: 0 }}>
            <Text style={styles.label}>Số điện thoại:</Text>
            <View style={styles.inputContainer}>
              <Feather
                name="phone"
                size={20}
                color="#888"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Nhập số điện thoại"
                placeholderTextColor="#888"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
          </View>

          {/* Mật khẩu */}
          <View style={{ width: '100%', marginBottom: 16 }}>
            <Text style={styles.label}>Mật khẩu:</Text>
            <View style={styles.inputContainer}>
              <Feather
                name="lock"
                size={20}
                color="#888"
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu"
                placeholderTextColor="#888"
                secureTextEntry={secure}
                value={password}
                onChangeText={setPassword}
                onSubmitEditing={handleLogin}
              />

              <TouchableOpacity onPress={() => setSecure(!secure)}>
                <Feather
                  name={secure ? 'eye-off' : 'eye'}
                  size={20}
                  color="#888"
                  style={{ paddingHorizontal: 8 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Đăng nhập</Text>
            )}
          </TouchableOpacity>

          {canUseBiometric && (
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: '#52c41a', marginTop: 12 },
              ]}
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(240,242,245,0.5)', // overlay mờ để chữ dễ đọc
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
    // fontFamily: 'cursive',
  },
  subText: {
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'cursive',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
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
