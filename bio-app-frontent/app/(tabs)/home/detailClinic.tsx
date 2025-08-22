// app/(tabs)/home/detailClinic/[ID].js
import FooterComponent from '@/app/component/footer';
import HeaderComponent from '@/app/component/header';
import { Rating } from '@kolking/react-native-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Divider } from 'react-native-paper';

const DetailClinicMobile = () => {
  const { ID } = useLocalSearchParams();
  const [data, setData] = useState(null);
  const [dataService, setDataService] = useState([]);

  useEffect(() => {
    const loadClinics = async () => {
      try {
        const dataClinic = await AsyncStorage.getItem('allclinics');
        const dataService = await AsyncStorage.getItem('alltests');
        if (dataClinic && dataService) {
          const parsedClinic = JSON.parse(dataClinic);
          const parsedService = JSON.parse(dataService);
          const formattedClinic = parsedClinic.find(
            (clinic) => clinic.ID === ID
          );

          if (formattedClinic) {
            const dataNameService = formattedClinic.listService
              .map((code) => {
                for (const service of parsedService) {
                  const found = service.packages.find(
                    (pkg) => pkg.code === code
                  );
                  if (found) return found.name;
                }
                return null;
              })
              .filter(Boolean);

            setDataService(dataNameService);
            setData(formattedClinic);
          }
        }
      } catch (error) {
        console.error('Lỗi khi đọc dữ liệu clinic:', error);
      }
    };
    loadClinics();
  }, [ID]);

  if (!data)
    return <Text style={{ padding: 20 }}>Đang tải dữ liệu phòng khám...</Text>;

  return (
    <ScrollView style={styles.container}>
      <>
        <HeaderComponent />
        <View style={styles.mainView}>
          {/* Card thông tin chính */}
          <View style={styles.card}>
            <Image source={{ uri: data.mainImage }} style={styles.mainImage} />
            <Text style={styles.title}>{data.name}</Text>
            <Rating
              size={24}
              rating={data.rating}
              disabled
              fillColor="#f7c860"
            />
            <Divider style={styles.divider} />
            <Text>{data.address}</Text>
            <Text>{data.workingHours}</Text>
            <Text>Tổng đài: {data.phone}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/home/booking',
                  params: { ID }, // truyền sang booking
                })
              }
            >
              <Text style={styles.buttonText}>Đặt khám ngay</Text>
            </TouchableOpacity>
          </View>

          {/* Card cover */}
          <View style={styles.card}>
            <Image source={{ uri: data.mainImage }} style={styles.coverImage} />
          </View>

          {/* Dịch vụ xét nghiệm */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Dịch vụ xét nghiệm</Text>
            <FlatList
              data={dataService}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text style={styles.serviceItem}>✔ {item}</Text>
              )}
            />
          </View>

          {/* Mô tả */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Mô tả</Text>
            <Text style={styles.paragraph}>{data.descriptions}</Text>
          </View>

          {/* Map */}
          {/* <View style={styles.card}>
          <View style={{ height: 300, borderRadius: 12, overflow: 'hidden' }}>
            <WebView
              source={{ uri: data.mapEmbedUrl }}
              style={{ flex: 1 }}
              javaScriptEnabled
              domStorageEnabled
            />
          </View>
        </View> */}

          {/* Giới thiệu & chi nhánh */}
          <View style={styles.card}>
            <Text style={styles.title}>{data.introTitle}</Text>
            {Array.isArray(data.introBulletPoints) &&
            data.introBulletPoints.length > 0 ? (
              <View style={{ paddingLeft: 10 }}>
                {data.introBulletPoints.map((point, index) => (
                  <Text key={index}>• {point}</Text>
                ))}
              </View>
            ) : (
              <Text>Không có thông tin giới thiệu.</Text>
            )}

            <Divider style={styles.divider} />
            {Array.isArray(data.branches) && data.branches.length > 0 ? (
              data.branches.map((branch, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <Text style={{ fontWeight: 'bold' }}>
                    Cơ sở tại {branch.city}:
                  </Text>
                  <Text>{branch.address}</Text>
                </View>
              ))
            ) : (
              <Text>Không có thông tin chi nhánh.</Text>
            )}

            <Image
              source={{ uri: data.mainImage }}
              style={styles.bottomImage}
            />
          </View>
        </View>
        <FooterComponent />
      </>
    </ScrollView>
  );
};

export default DetailClinicMobile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f7fc',
  },
  mainView: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  mainImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  coverImage: {
    width: '100%',
    height: 250,
    borderRadius: 20,
  },
  bottomImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00b5f1',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00b5f1',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: '#333',
    marginTop: 6,
  },
  serviceItem: {
    fontSize: 14,
    fontWeight: '600',
    color: '#783185',
    marginVertical: 3,
  },
  divider: {
    marginVertical: 12,
  },
  button: {
    marginTop: 16,
    borderRadius: 20,
    backgroundColor: '#00e0ff',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
