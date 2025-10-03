import React from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import ContainerNew from '../../common/components/Container';
import CustomHeader from '../../common/components/CustomHeader';
import CustomTextNew from '../../common/components/CustomText';
import useAsyncEffect from '../../common/packages/useAsyncEffect/useAsyncEffect';
import {useRootStore} from '../../stores/rootStore';
import {COLORS} from '../../common/constant/Themes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Add this line
import CustomButtonNew from '../../common/components/CustomButton';

const edges: Edge[] = ['right', 'bottom', 'left'];

const InfoRow = ({label, value}) => (
  <View style={styles.row}>
    <CustomTextNew text={label} txtStyle={styles.label} />
    <CustomTextNew text={value || 'N/A'} txtStyle={styles.value} />
  </View>
);

const ProfileScreen = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo, logout} = useRootStore();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) return;
      console.log(userInfo);
    },
    [isFocused],
  );

  const handleSignOut = () => {
    logout(); // Ensure logout clears user state
    navigation.navigate('Login');
  };

  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader title="Profile" onBackPress={() => navigation.goBack()} />
      }
      style={styles.container}>
      <View style={styles.content}>
        <InfoRow label="Name:" value={userInfo?.user_name} />
        <InfoRow label="Email:" value={userInfo?.email} />
        <InfoRow label="User ID:" value={userInfo?.user_id?.toString()} />

        <CustomButtonNew btnText="Sign Out" onBtnPress={handleSignOut} />
        {/* <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Icon
            name="logout"
            size={20}
            color={COLORS.white}
            style={styles.icon}
          />
          <CustomTextNew text="Sign Out" txtStyle={styles.signOutText} />
        </TouchableOpacity> */}
      </View>
    </ContainerNew>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    padding: 16,
    backgroundColor: COLORS.white,
    // borderRadius: 10,
    // paddingVertical: 20,
    // margin: 16,
    // elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.graySubText,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  value: {
    fontSize: 16,
    color: COLORS.deepGray,
  },
  signOutButton: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  icon: {
    marginRight: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});
