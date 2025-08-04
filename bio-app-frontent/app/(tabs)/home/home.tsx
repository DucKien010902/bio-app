import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import axiosClient from '../../../api/apiConfig';
import FooterComponent from '../../component/footer';
import HeaderComponent from '../../component/header';
const TestScreen = () => {
  const fetchAllClinic = async () => {
    try {
      const res = await axiosClient.get('/clinic/fetchall');
      await AsyncStorage.setItem('allclinics', JSON.stringify(res.data));
    } catch (error) {
      console.log('Không thể lấy danh sách phòng khám');
    }
  };
  const fetchServices = async () => {
    try {
      const res = await axiosClient.get('/testservice/fetchall');
      await AsyncStorage.setItem('alltests', JSON.stringify(res.data));
    } catch (error) {
      console.error(error);
      console.log('Không thể tải dữ liệu dịch vụ');
    }
  };
  useEffect(()=>{
    fetchAllClinic();
    fetchServices()
  },[])
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <HeaderComponent />
      <View style={styles.content}>
        <Text style={styles.text}>Nội dung của trang chủ sẽ hiển thị tại đây</Text>
        
      </View>
      <FooterComponent />
    </ScrollView>
  );
};

export default TestScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    // paddingBottom: 20,
  
  },
  content: {
  flex: 1,
  justifyContent: 'center', // căn giữa theo chiều dọc
  alignItems: 'center',     // căn giữa theo chiều ngang
  minHeight:700,
  padding: 20,
}
,
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
});
