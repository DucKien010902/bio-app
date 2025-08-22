import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FooterComponent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>GennovaX</Text>
        <Text style={styles.subtitle}>Đặt khám nhanh</Text>
      </View>

      <View style={styles.infoSection}>
        <Text>
          <Text style={styles.bold}>Địa chỉ:</Text> 28 Thành Thái - Phường Dịch
          Vọng - Quận Cầu Giấy - TP.Hà Nội
        </Text>
        <Text>
          <Text style={styles.bold}>Website:</Text> https://genapp.vn
        </Text>
        <Text>
          <Text style={styles.bold}>Email:</Text> cskh@genapp.vn
        </Text>
        <Text>
          <Text style={styles.bold}>Điện thoại:</Text> (028) 710 78098
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dịch vụ xét nghiệm</Text>
        <TouchableOpacity>
          <Text style={styles.link}>Đặt khám tại cơ sở</Text>
        </TouchableOpacity>
        <Text style={styles.link}>Lấy mẫu tại nhà</Text>
        <Text style={styles.link}>Tư vấn xét nghiệm</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cơ sở xét nghiệm</Text>
        <Text style={styles.link}>Phòng xét nghiệm GoLAB Ba Đình</Text>
        <Text style={styles.link}>Cơ sở xét nghiệm GoLAB Hải Phòng</Text>
        <Text style={styles.link}>Phòng xét nghiệm GoLAB Hòa Bình</Text>
        <Text style={styles.link}>Phòng xét nghiệm GoLAB Việt Trì</Text>
        <Text style={styles.link}>Phòng xét nghiệm GoLAB Hà Tĩnh</Text>
        <Text style={styles.link}>Lab xét nghiệm GenLAB Hồ Chí Minh</Text>
        <Text style={styles.link}>
          Lab xét nghiệm GenovaX Hà Nội 183 Trường Chinh
        </Text>
      </View>

      <View style={styles.copyright}>
        <Text style={styles.copyrightText}>
          © 2025 - Bản quyền thuộc Công Ty Cổ Phần Truyền Thông Và Công Nghệ
          GenTech
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#cfedf6ff',
    padding: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#178ee8',
    fontSize: 28,
    fontFamily: 'cursive',
  },
  subtitle: {
    color: '#4da2e3',
    fontSize: 16,
    fontFamily: 'cursive',
  },
  infoSection: {
    marginBottom: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  link: {
    color: '#6ab0e6',
    marginBottom: 4,
  },
  copyright: {
    backgroundColor: '#00b5f1',
    padding: 12,
    marginTop: 16,
  },
  copyrightText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default FooterComponent;
