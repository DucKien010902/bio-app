import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!phone || !name || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp!');
      return;
    }

    try {
      await axios.post('https://your-api-url.com/users/createaccount', {
        phoneNumber: phone,
        name,
        password,
      });

      Alert.alert('Thành công', 'Tạo tài khoản thành công', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tạo tài khoản');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f2f5' }}>
      {/* Nút back */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formWrapper}>
          <Text style={styles.logo}>GennovaX</Text>
          <Text style={styles.subtitle}>Tạo tài khoản mới</Text>

          <Text style={styles.label}>Họ và tên</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nhập họ tên"
          />

          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="Nhập số điện thoại"
          />

          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Nhập mật khẩu"
          />

          <Text style={styles.label}>Nhập lại mật khẩu</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="Xác nhận mật khẩu"
          />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  backButton: {
    padding: 16,
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 10,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center', // căn giữa theo chiều dọc
    alignItems: 'center', // căn giữa theo chiều ngang
    padding: 24,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 400,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1890ff',
    textAlign: 'center',
    fontFamily: 'cursive',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
    fontFamily: 'cursive',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 32,
    backgroundColor: '#1890ff',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
