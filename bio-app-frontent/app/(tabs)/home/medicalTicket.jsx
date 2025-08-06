import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Linking,
    SafeAreaView, ScrollView, StyleSheet, Text,
    TouchableOpacity,
    View
} from 'react-native';
import axiosClient from '../../../api/apiConfig'; // đường dẫn đúng theo project bạn
import FooterComponent from '../../component/footer';
import HeaderComponent from '../../component/header';

const statusSteps = [
  'Đã đặt đơn',
  'Đã xác nhận',
  'Đã thu mẫu',
  'Đang xét nghiệm',
  'Đã có kết quả',
];

const statusColors = {
  'Đã đặt đơn': '#FA8C16', // orange
  'Đã xác nhận': '#1890ff', // blue
  'Đã thu mẫu': '#722ed1', // purple
  'Đang xét nghiệm': '#c804cf',
  'Đã có kết quả': '#52c41a', // green
};

const getCurrentStep = (status) => {
  const idx = statusSteps.indexOf(status);
  return idx >= 0 ? idx : 0;
};

const Stepper = ({ status }) => {
  const current = getCurrentStep(status);

  return (
    <View style={styles.stepperContainer}>
      {statusSteps.map((s, i) => {
        const isActive = i <= current;
        return (
          <View style={styles.stepWrapper} key={s}>
            <View
              style={[
                styles.stepCircle,
                { backgroundColor: isActive ? statusColors[s] || '#1890ff' : '#f0f0f0' },
              ]}
            >
              <Text style={[styles.stepCircleText, isActive && { color: '#fff' }]}>{i + 1}</Text>
            </View>
            {i < statusSteps.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  { backgroundColor: i < current ? statusColors[statusSteps[i]] || '#1890ff' : '#eee' },
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

const TicketCard = ({ ticket }) => {
  const created = ticket.createdAt ? dayjs(ticket.createdAt).format('DD/MM/YYYY HH:mm') : '-';
  const currentColor = statusColors[ticket.status] || '#1890ff';

  const openResult = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Lỗi', 'Không thể mở liên kết.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể mở liên kết.');
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Mã phiếu: {ticket.bookID}</Text>
        <View style={[styles.tag, { backgroundColor: currentColor }]}>
          <Text style={styles.tagText}>{ticket.status}</Text>
        </View>
      </View>

      <View style={{ marginVertical: 8 }}>
        <Stepper status={ticket.status} />
        <Text style={styles.statusLabel}>{ticket.status}</Text>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.rowText}><Text style={styles.rowLabel}>Thời gian đặt:</Text> {created}</Text>
        <Text style={styles.rowText}><Text style={styles.rowLabel}>Họ tên:</Text> {ticket.name}</Text>
        <Text style={styles.rowText}><Text style={styles.rowLabel}>Dịch vụ:</Text> {ticket.serviceName}</Text>
        <Text style={styles.rowText}><Text style={styles.rowLabel}>Ngày giờ:</Text> {ticket.date} lúc {ticket.time}</Text>
        <Text style={styles.rowText}><Text style={styles.rowLabel}>Phòng khám:</Text> {ticket.facility}</Text>
        <Text style={styles.rowText}><Text style={styles.rowLabel}>Lấy mẫu:</Text> {ticket.samplingMethod || '-'}</Text>
        {ticket.sampleCollectorName ? (
          <Text style={styles.rowText}><Text style={styles.rowLabel}>NV thu mẫu:</Text> {ticket.sampleCollectorName}</Text>
        ) : null}
        {ticket.resultLink ? (
          <TouchableOpacity onPress={() => openResult(ticket.resultLink)}>
            <Text style={[styles.rowText, styles.resultLink]}>KQXN: Xem kết quả</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const EmptyBox = () => (
  <View style={styles.empty}>
    <Text style={{ color: '#999', fontWeight: '700' }}>Chưa có lịch sử đặt xét nghiệm</Text>
  </View>
);

const MedicalTicketsScreen = () => {
  const [mockBookings, setMockBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMedicalTicket = async () => {
    try {
      setLoading(true);
      const userJson = await AsyncStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;
      const phone = user?.phoneNumber;
      if (!phone) {
        setMockBookings([]);
        setLoading(false);
        return;
      }

      const res = await axiosClient.get(`/booking/fetchbyphone?phone=${encodeURIComponent(phone)}`);
      const sortedData = (res.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMockBookings(sortedData);
    } catch (error) {
      console.error('Không thể lấy lịch sử phiếu', error);
      setMockBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalTicket();
    // You may want to re-fetch on focus if using navigation: add a listener
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#1890ff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView>
    <SafeAreaView style={styles.container}>
        <HeaderComponent/>
      <View style={{ padding: 12 }}>
        <Text style={styles.pageTitle}>Lịch sử xét nghiệm</Text>
        {mockBookings.length === 0 ? (
          <EmptyBox />
        ) : (
          <FlatList
            data={mockBookings}
            keyExtractor={(item) => item.bookID || item._id || Math.random().toString()}
            renderItem={({ item }) => <TicketCard ticket={item} />}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        )}
      </View>
      <FooterComponent/>
    </SafeAreaView>
    </ScrollView>
  );
};

export default MedicalTicketsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleText: {
    fontSize: 10,
    color: '#333',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#eee',
  },
  statusLabel: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  cardBody: {
    marginTop: 8,
  },
  rowText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 4,
  },
  rowLabel: {
    fontWeight: '600',
  },
  resultLink: {
    color: 'red',
    fontWeight: 'bold',
  },
  empty: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
});
