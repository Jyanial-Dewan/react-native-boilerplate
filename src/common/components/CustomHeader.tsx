/* eslint-disable react-native/no-inline-styles */
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Modal,
  Platform,
  StatusBar,
  StatusBarStyle,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ActivityIndicator, Appbar} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AIcon from 'react-native-vector-icons/AntDesign';
import {
  default as Icon,
  default as MCIcon,
} from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import {IMAGES} from '../constant/Index';
import {COLORS} from '../constant/Themes';
import {getStatusBgColor, getStatusColor} from '../services/getColor';
import {getImageURL} from '../services/getImage';
import CustomTextNew from './CustomText';
import {useIsFocused} from '@react-navigation/native';
import {arlURL, commonURL} from '../../../App';
import {httpRequest} from '../constant/httpRequest';
import {PeopleDeskAllDDL} from '../api/api';
import useAsyncEffect from '../packages/useAsyncEffect/useAsyncEffect';
import {observer} from 'mobx-react-lite';
import Row from './Row';
import {useRootStore} from '../../stores/rootStore';

interface CustomHeaderProps {
  foodBankIcon?: boolean;
  foodBankIconName?: string;
  setRerender?: any;
  title: string;
  subtitle?: string | undefined | null;
  subTitleData?: any;
  isSubtitleClickable?: boolean;
  statusBarBackground?: string;
  statusBarStyle?: StatusBarStyle;
  headerBackground?: string;
  onBackPress?: () => void;
  onLeftMenuPress?: () => void;
  onRightMenuPress?: () => void;
  infoIconPress?: () => void;
  alterIcon?: string | undefined;
  alterIconPress?: () => void;
  onLeftCrossPress?: () => void;
  moreIconPress?: () => void;
  foodBankPress?: () => void;
  onChatImagePress?: boolean;
  imageURL?: string;
  savePress?: () => void;
  components?: React.ReactNode;
  deleteIcon?: string | undefined;
  deleteIconPress?: () => void;
  statusText?: boolean;
  isMoreIcon?: boolean;
  dateTime?: boolean;
  headerColor?: boolean;
  withoutBar?: boolean;
  elevation?: boolean;
  thropy?: boolean;
  personIconPress?: () => void;
  coreModulesIcon?: boolean;
  coreModulesIconPress?: () => void;
  erpModulesIconPress?: () => void;
  isRefreshIcon?: boolean;
  refreshIconPress?: () => void;
  isLoading?: boolean;
  isSupport?: boolean;
  supportIconPress?: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  setRerender,
  title,
  subtitle = '',
  subTitleData = [],
  isSubtitleClickable = false,
  statusBarStyle = 'light-content',
  // statusBarStyle = 'dark-content',
  onBackPress,
  onLeftMenuPress,
  onRightMenuPress,
  infoIconPress,
  alterIcon = Platform.OS === 'ios' ? 'info-outline' : 'info',
  alterIconPress,
  onLeftCrossPress,
  moreIconPress,
  foodBankPress,
  foodBankIcon,
  // onChatImagePress,
  // imageURL,
  savePress,
  deleteIcon = '',
  deleteIconPress,
  components,
  statusText = false,
  isMoreIcon,
  dateTime,
  headerColor,
  withoutBar,
  elevation = true,
  thropy = false,
  personIconPress,
  coreModulesIconPress,
  coreModulesIcon = false,
  isRefreshIcon = false,
  refreshIconPress,
  isLoading,
  isSupport,
  supportIconPress,
  foodBankIconName,
}) => {
  const {top} = useSafeAreaInsets();
  const {sbuSave, userInfo, userInfoSave} = useRootStore();

  const day = dayjs().format('DD');
  const month = dayjs().format('MMMM');
  const weekDay = dayjs().format('dddd');
  const time = dayjs().format('h:mm A');
  const modifiedTitle =
    title?.length > 20 ? `${title?.substring(0, 18)?.trim()}...` : title;

  const modifiedSubTitle =
    //@ts-ignore
    subtitle?.length > 20
      ? `${subtitle?.substring(0, 19)?.trim()}...`
      : subtitle;
  const isFocused = useIsFocused();
  const [isModalShow, setIsModalShow] = useState(false);
  const [selectedBuUnit, setSelectedBuUnit] = useState<any>();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      if (arlURL === userInfo?.strUrl) {
        setSelectedBuUnit(subTitleData);
      }
      if (commonURL === userInfo?.strUrl) {
        const params = {
          url: PeopleDeskAllDDL,
          data: {
            DDLType: 'WorkplaceGroup',
            BusinessUnitId: userInfo?.intBusinessUnitId || 4,
            WorkplaceGroupId:
              userInfo?.intWorkplaceGroupId ||
              userInfo?.originalWorkplaceGroupId ||
              8,
            intId: userInfo?.intEmployeeId,
          },
        };
        const resssForWorkPlace = await httpRequest(params, () => {});
        if (subTitleData?.length) {
          setSelectedBuUnit(subTitleData);
        } else if (resssForWorkPlace?.Length) {
          const modifiedDataForWorkPlace = resssForWorkPlace?.map(
            (item: any) => {
              return {
                value: item?.intWorkplaceGroupId,
                label: item?.strWorkplaceGroup,
              };
            },
          );
          setSelectedBuUnit(modifiedDataForWorkPlace);
        } else {
          setSelectedBuUnit([]);
        }
      }
    },
    [isSubtitleClickable, isModalShow],
  );

  const handleSelect = (item: any) => {
    setIsModalShow(false);
    sbuSave({
      businessUnitId: item?.value,
      businessUnitName: item?.label,
      sbuId: item?.sbuId,
    });

    const updtedLoginInfo = {
      ...userInfo,
      intWorkplaceGroupId: item?.value,
      strWorkplaceGroup: item?.label,
    };
    //@ts-ignore
    userInfoSave(updtedLoginInfo);
    setRerender(true);
  };

  return (
    <Appbar.Header
      statusBarHeight={top}
      style={{
        backgroundColor: headerColor ? '#1F843C' : COLORS.primary,
        marginBottom:
          headerColor || withoutBar ? (Platform?.OS === 'ios' ? 0 : -10) : 0,
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: elevation ? 10 : 0,
        height: elevation ? 60 : 65,
        paddingLeft: onBackPress ? 0 : 16,
      }}>
      <StatusBar
        translucent
        barStyle={statusBarStyle}
        backgroundColor={COLORS.statusBar}
      />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {coreModulesIcon ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={coreModulesIconPress}
            style={[styles.info]}>
            <Icon name="widgets" size={24} color={COLORS.white} />
          </TouchableOpacity>
        ) : null}
        {onLeftCrossPress ? (
          <Appbar.Action
            icon="close"
            onPress={onLeftCrossPress}
            color={COLORS.white}
            size={25}
          />
        ) : null}
        {onLeftMenuPress ? (
          <Appbar.Action
            icon="menu"
            onPress={onLeftMenuPress}
            color={COLORS.white}
          />
        ) : null}
        {onBackPress ? (
          <Appbar.BackAction
            onPress={onBackPress}
            size={Platform.OS === 'ios' ? 19 : 26}
            color={COLORS.white}
          />
        ) : null}
        {thropy && (
          <FastImage
            source={IMAGES.RewardImage}
            style={{
              width: 30,
              height: 30,
              marginTop: 12,
            }}
          />
        )}
        {dateTime ? (
          <View style={styles.timePart}>
            <Text style={styles.time}>{time}</Text>
            <View style={styles.verticleBar} />
            <Text style={styles.date}>{`${day}, ${weekDay}, ${month}`}</Text>
          </View>
        ) : null}
        {/* {onChatImagePress ? (
        <>
          {imageURL ? (
            <Image
              style={[styles.image, { marginRight: 0 }]}
              source={{ uri: getImageURL(imageURL) }}
            />
          ) : (
            <Image style={[styles.noImage, { marginRight: 0 }]} source={IMAGES.NoImage} />
          )}
        </>
      ) : null} */}

        {Platform.OS === 'android' ? (
          <TouchableOpacity
            disabled={isSubtitleClickable ? false : true}
            onPress={() => setIsModalShow(true)}
            style={{marginTop: 14}}>
            <Appbar.Content color={COLORS.white} title={modifiedTitle} />

            {modifiedSubTitle && (
              <Row align="center">
                <CustomTextNew
                  text={modifiedSubTitle}
                  txtColor={COLORS.white}
                />
                <Icon name="chevron-down" size={20} color={COLORS.white} />
              </Row>
            )}
          </TouchableOpacity>
        ) : null}
      </View>

      {Platform.OS === 'ios' ? (
        <TouchableOpacity
          disabled={isSubtitleClickable ? false : true}
          onPress={() => setIsModalShow(true)}
          style={{marginTop: 18}}>
          <Appbar.Content
            color={COLORS.white}
            title={modifiedTitle}
            style={{
              alignItems: 'center',
            }}
          />
          <View
            style={{
              alignItems: 'center',
            }}>
            {modifiedSubTitle && (
              <Row align="center" justify="center">
                <Icon name="chevron-down" size={20} color={COLORS.white} />
                <CustomTextNew
                  text={modifiedSubTitle}
                  txtColor={COLORS.white}
                />
              </Row>
            )}
          </View>
        </TouchableOpacity>
      ) : null}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          right: Platform.OS === 'ios' ? 16 : 0,
        }}>
        <View />
        {onRightMenuPress ? (
          <TouchableOpacity activeOpacity={0.7} onPress={onRightMenuPress}>
            <Image
              style={styles.image}
              source={{uri: getImageURL(userInfo?.intProfileImageUrl)}}
            />
          </TouchableOpacity>
        ) : null}

        {foodBankIcon ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={foodBankPress}
            style={styles.info}>
            <Icon
              name={foodBankIconName ? foodBankIconName : 'food'}
              size={24}
              color={COLORS.white}
            />
          </TouchableOpacity>
        ) : null}

        {isSupport ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={supportIconPress}
            style={styles.info}>
            <AIcon name={'questioncircleo'} size={24} color={COLORS.white} />
          </TouchableOpacity>
        ) : null}
        {infoIconPress ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={infoIconPress}
            style={styles.info}>
            <Icon
              name={
                Platform.OS === 'ios' ? 'information-outline' : 'information'
              }
              size={26}
              color={COLORS.white}
            />
          </TouchableOpacity>
        ) : null}

        {deleteIcon === '' ? null : (
          <>
            {deleteIconPress ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={deleteIconPress}
                style={styles.info}>
                <MIcon name={deleteIcon} size={24} color={COLORS.white} />
              </TouchableOpacity>
            ) : null}
          </>
        )}

        {statusText ? (
          <View style={styles.status}>
            <Text
              style={[
                styles.statusText,
                {
                  color: getStatusColor('pending'),
                  backgroundColor: getStatusBgColor('pending'),
                },
              ]}>
              Pending
            </Text>
          </View>
        ) : null}

        <>{components}</>
        {personIconPress ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={personIconPress}
            style={styles.info}>
            <MIcon name={'logout'} size={25} color={COLORS.white} />
          </TouchableOpacity>
        ) : null}

        {alterIcon === '' ? null : (
          <>
            {alterIconPress ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={alterIconPress}
                style={styles.info}>
                {alterIcon === 'contacts-outline' ? (
                  <MCIcon name={alterIcon} size={24} color={COLORS.white} />
                ) : (
                  <>
                    {alterIcon === 'questioncircleo' ? (
                      <AIcon name={alterIcon} size={24} color={COLORS.white} />
                    ) : (
                      <>
                        {alterIcon === 'widgets' ? (
                          <Icon
                            name={alterIcon}
                            size={24}
                            color={COLORS.white}
                          />
                        ) : (
                          <MIcon
                            name={alterIcon}
                            size={24}
                            color={COLORS.white}
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </TouchableOpacity>
            ) : null}
          </>
        )}
        {isRefreshIcon ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={refreshIconPress}
            style={styles.info}>
            <MIcon name="refresh" size={24} color={COLORS.white} />
          </TouchableOpacity>
        ) : null}
        {isLoading ? (
          <ActivityIndicator
            color={COLORS.white}
            size={20}
            style={styles.load}
          />
        ) : null}
        {isMoreIcon ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={moreIconPress}
            style={styles.info}>
            <MIcon name="more-vert" size={24} color={COLORS.white} />
          </TouchableOpacity>
        ) : null}

        {savePress ? (
          <TouchableOpacity activeOpacity={0.7} style={styles.save}>
            <Text style={styles.saveTxt}>SAVE</Text>
          </TouchableOpacity>
        ) : null}
        {/* <Appbar.Action icon="information" onPress={() => {}} /> */}
      </View>

      {/* for android devices */}
      <Modal visible={isModalShow} transparent={true} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setIsModalShow(!isModalShow)}>
          <View style={styles.modalWrapper}>
            <TouchableWithoutFeedback>
              <View style={styles.modal}>
                {selectedBuUnit?.length === 0 && (
                  <View style={styles.noData}>
                    <Text style={[styles.noItem]}>No Data Found</Text>
                  </View>
                )}
                <FlatList
                  data={selectedBuUnit}
                  renderItem={({item}) => (
                    <TouchableOpacity onPress={() => handleSelect(item)}>
                      <View
                        style={{
                          backgroundColor:
                            item?.label?.trim() === subtitle?.trim()
                              ? COLORS.lightPrimary2
                              : COLORS.white,
                          paddingLeft: 4,
                          borderRadius: 6,
                        }}>
                        <Text style={[styles.item]}>{item?.label}</Text>
                        <View style={styles.itemListWrapper} />
                      </View>
                    </TouchableOpacity>
                  )}
                  //@ts-ignore
                  keyExtractor={(item, index) => index}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Appbar.Header>
  );
};

export default observer(CustomHeader);

const styles = StyleSheet.create({
  image: {
    width: 30,
    height: 30,
    marginRight: 20,
    borderRadius: 50,
    overflow: 'hidden',
  },
  // noImage: {
  //   width: 30,
  //   height: 30,
  //   marginRight: 20,
  //   borderRadius: 50,
  //   overflow: 'hidden',
  // },
  info: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 4,
    marginRight: 10,
    // backgroundColor: COLORS.white,
  },
  save: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    marginRight: 5,
    paddingVertical: 8,
    borderRadius: 5,
  },
  saveTxt: {
    fontWeight: '600',
    color: COLORS.white,
    fontSize: 13,
    letterSpacing: 0.4,
  },
  status: {
    paddingRight: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 3,
    overflow: 'hidden',
    borderRadius: Platform?.OS === 'ios' ? 10 : 30,
    paddingHorizontal: 8,
  },
  timePart: {flexDirection: 'row', alignItems: 'center', paddingVertical: 5},
  time: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
    color: COLORS.white,
  },
  verticleBar: {
    borderRightWidth: 1,
    borderRightColor: COLORS.iconGrayBackground,
    marginHorizontal: 16,
    height: 24,
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 17,
    color: COLORS.white,
  },
  load: {
    paddingRight: 16,
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    width: '90%',
    height: Platform.OS === 'ios' ? '90%' : '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  noData: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noItem: {
    paddingVertical: 15,
    fontSize: 17,
  },
  item: {
    fontSize: 17,
    color: COLORS.blackish,
    paddingTop: 15,
  },
  itemListWrapper: {
    borderTopWidth: 1,
    borderColor: '#E4E9F2',
    marginTop: 10,
  },
});
