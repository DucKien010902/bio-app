import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView, StyleSheet, Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import FooterComponent from '../component/footer';
import HeaderComponent from '../component/header';

// Simple Avatar component (initial letter)
const Avatar = ({ name, url, size = 80 }) => {
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      {url ? (
        <Image
          source={{ uri: url }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2
          }}
          resizeMode="cover"
        />
      ) : (
        <Text
          style={{
            color: '#fff',
            fontSize: size / 3,
            fontWeight: 'bold'
          }}
        >
          {initial}
        </Text>
      )}
    </View>
  );
};

const RadioOption = ({ label, value, selected, onPress }) => (
  <TouchableOpacity
    onPress={() => onPress(value)}
    style={[styles.radioOption, selected && styles.radioOptionSelected]}
    activeOpacity={0.8}
  >
    <View style={[styles.radioCircle, selected && styles.radioCircleSelected]} />
    <Text style={[styles.radioLabel, selected && styles.radioLabelSelected]}>{label}</Text>
  </TouchableOpacity>
);

const ProfileScreen =() => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  // form fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('male'); // male | female | other
  const [birthday, setBirthday] = useState(null); // JS Date or null
  const [avatarImage,setAvatarImage]= useState(null)
  // date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const json = await AsyncStorage.getItem('user');
        const user = json ? JSON.parse(json) : null;
        if (user) {
          setPhoneNumber(user.phoneNumber || '');
          setFullName(user.fullName || '');
          setEmail(user.email || '');
          setAddress(user.address || '');
          setGender(user.gender || 'male');
          setAvatarImage(user.avatarImage||null)
          if (user.birthday) {
            // try parsing dd/MM/YYYY or ISO
            const parts = user.birthday.split('/');
            if (parts.length === 3) {
              const d = new Date(+parts[2], +parts[1] - 1, +parts[0]);
              setBirthday(d);
            } else {
              const d = new Date(user.birthday);
              if (!Number.isNaN(d.getTime())) setBirthday(d);
            }
          }
        }
      } catch (err) {
        console.warn('Load user error', err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const onSave = async () => {
    // basic validation
    if (!fullName || !phoneNumber) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập họ tên và số điện thoại.');
      return;
    }
    const payloadUser = {
      phoneNumber,
      fullName,
      email,
      address,
      gender,
      birthday: birthday ? formatDateDDMMYYYY(birthday) : null,
    };

    try {
      await AsyncStorage.setItem('user', JSON.stringify(payloadUser));
      Alert.alert('Lưu thành công', 'Thông tin hồ sơ đã được lưu.');
      // nếu bạn muốn gọi API update profile thì gọi ở đây bằng axios
      // await axiosClient.post('/user/update', payloadUser);
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể lưu thông tin. Thử lại.');
    }
  };

  const onLogout = async () => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          try {
            // await AsyncStorage.removeItem('user');
            router.push('/auth/login')
          } catch (err) {
            console.warn('Logout err', err);
          }
        },
      },
    ]);
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios'); // on Android, hide after chosen
    if (event.type === 'dismissed') return;
    if (selectedDate) setBirthday(selectedDate);
  };

  function formatDateDDMMYYYY(d) {
    if (!d) return null;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1890ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView  keyboardShouldPersistTaps="handled">
        <HeaderComponent />
        <View style={styles.content}>
        <Text style={styles.title}>Hồ Sơ Của Tôi</Text>
        <Text style={styles.subtitle}>Quản lý thông tin hồ sơ để bảo mật tài khoản</Text>

        <View style={styles.rowCenter}>
          <Avatar name={fullName} url={avatarImage} size={84}  />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.nameText}>{fullName || 'Chưa có tên'}</Text>
            <Text style={styles.smallText}>{phoneNumber || 'Chưa có số điện thoại'}</Text>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />

          <Text style={styles.label}>Tên</Text>
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

          <Text style={styles.label}>Địa chỉ</Text>
          <TextInput style={styles.input} value={address} onChangeText={setAddress} />

          <Text style={styles.label}>Giới tính</Text>
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            <RadioOption label="Nam" value="male" selected={gender === 'male'} onPress={setGender} />
            <RadioOption label="Nữ" value="female" selected={gender === 'female'} onPress={setGender} />
            <RadioOption label="Khác" value="other" selected={gender === 'other'} onPress={setGender} />
          </View>

          <Text style={styles.label}>Ngày sinh</Text>
          <TouchableOpacity style={styles.select} onPress={() => setShowDatePicker(true)}>
            <Text style={[styles.selectText, !birthday && styles.placeholder]}>
              {birthday ? formatDateDDMMYYYY(birthday) : 'Chọn ngày sinh'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={birthday || new Date(1990, 0, 1)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
              maximumDate={new Date()}
              onChange={onChangeDate}
            />
          )}

          <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Text style={styles.saveButtonText}>Lưu</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
        </View>
        <FooterComponent/>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { paddingHorizontal:24, paddingVertical:16 },
  title: { fontSize: 20, fontWeight: '700', color: '#00b5f1', marginBottom: 4 },
  subtitle: { color: '#666', marginBottom: 12 },
  rowCenter: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { backgroundColor: '#00b5f1', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '800' },
  nameText: { fontSize: 16, fontWeight: '800' },
  smallText: { color: '#666', marginTop: 4 },
  formGroup: { marginTop: 12 },
  label: { fontWeight: '700', marginBottom: 6, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#e6f4fb',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  select: {
    borderWidth: 1,
    borderColor: '#e6f4fb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  selectText: { fontSize: 16 },
  placeholder: { color: '#999' },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  radioOptionSelected: {
    borderColor: '#1890ff',
    backgroundColor: '#e6f7ff',
  },
  radioCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#999',
    marginRight: 8,
  },
  radioCircleSelected: {
    backgroundColor: '#1890ff',
    borderColor: '#1890ff',
  },
  radioLabel: { fontWeight: '700' },
  radioLabelSelected: { color: '#1890ff' },
  saveButton: {
    backgroundColor: '#00b5f1',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  saveButtonText: { color: '#fff', fontWeight: '800' },
  logoutButton: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff4d4f',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ff4d4f',
    fontWeight: '700',
  },
});