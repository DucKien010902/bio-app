import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Divider } from 'react-native-paper';
import FooterComponent from '../../component/footer';
import HeaderComponent from '../../component/header';

const MobileMenu = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const getUser = async () => {
      const data = await AsyncStorage.getItem('user');
      if (data) setUser(JSON.parse(data));
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    // navigation.navigate('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeaderComponent/>
      <View style={styles.content}>
      {user ? (
        <View style={styles.userCard}>
          <AntDesign name="user" size={20} color="#fff" />
          <Text style={styles.userName}>{user.fullName}</Text>
        </View>
      ) : (
        <View style={styles.authButtons}>
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate('Register')}
          >
            Đăng ký
          </Button>
          <Button
            mode="outlined"
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            Đăng nhập
          </Button>
        </View>
      )}

      {/* Menu list */}
      <View style={styles.menuSection}>
        <MenuItem icon={<AntDesign name="home" size={20} color="#1890ff" />} label="Cơ sở y tế" onPress={() => router.push('/(tabs)/home/clinics')} />
        <MenuItem icon={<AntDesign name="appstore-o" size={20} color="#1890ff" />} label="Dịch vụ y tế" onPress={() => router.push('/(tabs)/home/service')} />
        <MenuItem icon={<AntDesign name="filetext1" size={20} color="#1890ff" />} label="Phiếu xét nghiệm" onPress={() => navigation.navigate('Tickets')} />
        <MenuItem icon={<AntDesign name="bells" size={20} color="#1890ff" />} label="Thông báo" />
        <MenuItem icon={<AntDesign name="questioncircleo" size={20} color="#1890ff" />} label="Hướng dẫn" />
      </View>

      <Divider />

      {/* Support */}
      <View style={styles.menuSection}>
        <MenuItem icon={<FontAwesome name="facebook" size={20} color="#1877f2" />} label="Hỗ trợ Facebook" />
        <MenuItem icon={<MaterialIcons name="phone" size={20} color="#ff4d4f" />} label="1900-2115" />
        <MenuItem icon={<MaterialIcons name="email" size={20} color="#d93025" />} label="Email: cskh@gentech.vn" />
      </View>

      {/* App promo */}
      <View style={styles.promo}>
        <Image
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh-5fWVITFdnwFqqjLfK0KZ0l2vUsqDV1HQQ&s' }}
          style={{ width: 50, height: 50, marginBottom: 8 }}
        />
        <Text style={{ fontWeight: '600', color: '#1890ff' }}>
          Tải ứng dụng Genapp tại đây ⬇
        </Text>
        <Text style={{ fontSize: 13, marginTop: 4, textAlign: 'center' }}>
          Ứng dụng đặt khám nhanh tại hơn 300 bệnh viện hàng đầu Việt Nam
        </Text>
      </View>

      {/* Logout */}
      {user && (
        <Button
          mode="contained"
          buttonColor="#ff4d4f"
          style={{ borderRadius: 8, marginVertical: 30 }}
          icon="logout"
          onPress={handleLogout}
        >
          Đăng xuất
        </Button>
      )}
      </View>
      <FooterComponent/>
    </ScrollView>
  );
};

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIcon}>
      {icon}
    </View>
    <Text style={styles.menuLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {  backgroundColor: '#f5f5f5', flexGrow:1},
  content:{
    padding:16
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#00c0ff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  userName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  authButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  button: { flex: 1, height: 40, justifyContent: 'center' },
  menuSection: { marginTop: 12 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  menuIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#e6f7ff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: { fontSize: 15, fontWeight: '500' },
  promo: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
});

export default MobileMenu;
