import { useNavigation } from '@react-navigation/native';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
// import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import gennovaXLogo from '../../assets/images/GennovaX-logo-tách-nền.png';

const HeaderComponent = () => {
  const navigation = useNavigation();
//   const dispatch = useDispatch();
//   const isOpenMenu = useSelector((state) => state.openMenu.IsOpenMenu);
  const { width } = useWindowDimensions();
  const isOpenMenu= false
  const isMobile = width < 768;

  const handleLogoPress = () => {
    router.replace('/(tabs)/home')
  };

//   const handleMenuToggle = () => {
//     if (isOpenMenu) {
//       dispatch(closeMenuBio());
//       navigation.navigate('YTe');
//     } else {
//       dispatch(openMenuBio());
//       navigation.navigate('MenuYTe');
//     }
//   };

  if (!isMobile) return null;

  return (
    <View>
      <View style={styles.paddingHeader}></View>
    <View style={styles.header}>
      <TouchableOpacity onPress={handleLogoPress} style={styles.logoContainer} onPressOut={()=>{router.push('/(tabs)/home/home')}}>
        <Image source={gennovaXLogo} style={styles.logo} resizeMode="contain"  />
      </TouchableOpacity>

      <View style={styles.iconContainer}>
        <TouchableOpacity>
          <Feather name="bell" size={24} color="#1890ff" />
          {/* TODO: Badge logic tùy biến nếu muốn thêm */}
        </TouchableOpacity>

        <TouchableOpacity >
          <Icon name={isOpenMenu ? 'close' : 'bars'} size={28} onPress={()=>{router.push('/(tabs)/home/menu')}} />
        </TouchableOpacity>
      </View>
    </View>
    </View>
  );
};

export default HeaderComponent;

const styles = StyleSheet.create({
  paddingHeader:{
    height:40,
    backgroundColor:'black'
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    height: 80,
    width: 120,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});
