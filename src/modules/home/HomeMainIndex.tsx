import {useIsFocused, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import dayjs from 'dayjs';
import {observer} from 'mobx-react-lite';
import React, {useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  ImageBackground,
  Linking,
  Modal,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import FIcon from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Column from '../../common/components/Column';
import ContainerNew from '../../common/components/Container';
import CustomButtonNew from '../../common/components/CustomButton';
import CustomHeader from '../../common/components/CustomHeader';
import CustomImageNew from '../../common/components/CustomImage';
import CustomInputNew from '../../common/components/CustomInput';
import CustomTextNew from '../../common/components/CustomText';
import {useToast} from '../../common/components/CustomToast';
import Row from '../../common/components/Row';
import {COLORS, IMAGES, SIZES} from '../../common/constant/Index';
import {httpRequest} from '../../common/constant/httpRequest';
import RBSheet from '../../common/packages/RBSheet/RBSheet';
import useAsyncEffect from '../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater} from '../../common/services/dateFormater';
import {getImageURL} from '../../common/services/getImage';
import {timeFormaterToPmAm} from '../../common/services/timeFormater';
import {useRootStore} from '../../stores/rootStore';

const {SecurityModule} = NativeModules;
const edges: Edge[] = ['right', 'left'];
const wait = (timeout: any) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const HomeMainIndex = () => {
  const [modalShow, setModalShow] = useState(false);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const {userInfo} = useRootStore();
  const [deviceName, setDeviceName] = useState('');
  const [isScanShow, setIsScanShow] = useState(false);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const [notificationCounter, setNorificationCounter] = useState<number>(0);
  const toaster = useToast();
  const [switchBoardData, setSwitchBoardData] = useState<any>();
  const refRBSheet = useRef();
  const refRBSheet1 = useRef();
  const [empId, setEmpId] = useState();
  const [isDisable, setIsDisable] = useState(false);
  const currentTime = dayjs().format('h:mm A');
  const [profileInfo, setProfileInfo] = useState<any>('');
  const [resURL, setResURL] = useState();
  const [locationConfig, setLocationConfig] = useState<any>();
  const [vCardData, setVCardData] = useState<any>();
  const [resURL2, setResURL2] = useState<any>('');

  const ref = useRef<any>();
  const {control, handleSubmit, setValue, reset} = useForm({
    defaultValues: {
      agendaOfMeetMe: 'Come to meet me now',
      schedule: currentTime?.toString(),
    },
  });

  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader
          elevation={false}
          alterIcon={'notifications'}
          alterIconPress={() => {
            console.log('Notification');
          }}
          title="PRO-CG"
        />
      }
      style={styles.container}>
      <Column colWidth={'100%'}>
        <>
          {!isScanShow ? (
            <Row direction="row" rowStyle={styles.mainRow}>
              <Row
                align="center"
                rowStyle={styles.paddingHorizontalAndVertical}>
                <Column colWidth="15%">
                  <FastImage
                    source={IMAGES.NoImage}
                    style={styles.profileImage}
                  />
                </Column>
                <Column colWidth="85%" colStyle={styles.topBottomTextContainer}>
                  <Column colWidth="95%">
                    <CustomTextNew
                      text={`${userInfo?.user_name}`}
                      txtStyle={styles.mainTxt}
                    />
                    <Row justify="space-between" align="center">
                      <Row rowWidth="75%">
                        <CustomTextNew
                          text={`${userInfo?.user_type}`}
                          subTxt
                          txtColor={COLORS.primary}
                        />
                      </Row>
                      <Column
                        isPressOn={false}
                        onCardPress={() => {
                          //@ts-ignore
                          navigation.navigate('ProfileScreen');
                        }}
                        colStyle={styles.columnFlex}>
                        <CustomTextNew
                          text="Details"
                          txtColor={COLORS.primary}
                        />
                        <MIcon
                          name="arrow-forward-ios"
                          color={COLORS.primary}
                          size={17}
                          style={{marginLeft: 8}}
                        />
                      </Column>
                    </Row>
                    <Row>
                      <CustomTextNew
                        text={`${userInfo?.user_id}`}
                        subTxt
                        txtColor={COLORS.primary}
                      />
                    </Row>
                  </Column>
                </Column>
              </Row>
            </Row>
          ) : null}
        </>
      </Column>
    </ContainerNew>
  );
};

export default observer(HomeMainIndex);

const styles = StyleSheet.create({
  imgCon: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  modalImg: {
    borderRadius: 8,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.white,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121E4499',
  },
  modalView: {
    width: 300,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 16,
  },

  mainRow: {
    flexWrap: 'wrap',
    backgroundColor: COLORS.white,
    paddingBottom: 8,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 50,
    backgroundColor: COLORS.iconGrayBackground,
    borderWidth: 1,
    borderColor: COLORS.white,
  },

  topBottomTextContainer: {
    paddingLeft: 16,
  },
  paddingHorizontalAndVertical: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  columnFlex: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingVertical: 4,
    alignItems: 'center',
  },
  mainTxt: {
    color: COLORS.primary,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
  },

  footerSection: {
    alignSelf: 'center',
    paddingVertical: 18,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500',
    color: COLORS.textGray,
    paddingRight: 12,
  },
  officeTimeCon: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  mTop18: {
    marginTop: 18,
  },
  hoursBox: {
    paddingVertical: 8,
    marginVertical: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  pRight8: {
    paddingRight: 8,
  },
  barStyle: {
    backgroundColor: COLORS.bar,
    marginHorizontal: 8,
  },
  smallBar: {
    backgroundColor: COLORS.bar,
    paddingVertical: 1,
  },
  dividerStyle: {
    backgroundColor: COLORS.bar,
    paddingVertical: 4,
  },
  cultureSection: {
    backgroundColor: '#12B76A',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  w75: {
    width: '75%',
  },
  cultureTitle: {
    color: COLORS.white,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
  },
  cultureSubTitle: {
    color: COLORS.white,
    fontSize: 14,
    paddingTop: 6,
  },
  getStartedButton: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 100,
    width: '55%',
  },
  getStartedText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'center',
    paddingRight: 10,
  },
  pT16: {
    paddingTop: 16,
  },
  rewardImage: {
    width: 70,
    height: 70,
  },
  leaveText: {
    fontSize: 14,
    lineHeight: 18,

    color: COLORS.textNewColor,
  },
  leaveText1: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    color: COLORS.textNewColor,
  },
  myLeaveTitle: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    color: COLORS.textNewColor,
    paddingBottom: 16,
  },
  myLeavesSection: {
    borderWidth: 1,
    borderColor: COLORS.borderBottom,
    borderRadius: 4,
    paddingVertical: 16,
  },
  myLeavesBox: {
    flexDirection: 'row',
    borderBottomColor: COLORS.borderBottom,
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  containerMargin: {
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 4,
  },
  leaveType: {
    width: '40%',
    paddingLeft: 16,
  },

  managerImage: {
    width: 45,
    height: 45,
    borderRadius: 100,
  },

  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  noImageBox: {
    height: 45,
    width: 45,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#DCDCDC',
  },

  imageSection: {
    width: '18%',
  },
  paddingTop: {paddingVertical: 3},
  chatAndInfo: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 50,
    alignItems: 'center',
    alignSelf: 'center',
  },

  empName: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16,
    color: 'rgba(0, 0, 0, 0.75)',
  },

  cmnSubTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commonTextTitle1: {
    fontSize: 14,
    lineHeight: 16,
    color: COLORS.graySubText,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sheetFooter: {
    paddingTop: 30,
    paddingHorizontal: 10,
  },
  pHorizontal: {
    paddingHorizontal: 16,
  },
  btn1: {
    alignSelf: 'center',
    borderRadius: Platform.OS === 'ios' ? 10 : 100,
    paddingVertical: 10,
    marginTop: 20,
    width: '100%',
  },
  btnText1: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  bar: {
    height: 5,
    backgroundColor: COLORS.bar,
    marginVertical: 16,
  },
  rowW90: {
    flexDirection: 'row',
    width: '90%',
  },
  width82: {
    width: '82%',
  },
  empNameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -4,
    width: '100%',
    flexWrap: 'wrap',
  },
  callIcon: {
    padding: 8,
  },
  scrollStyle: {
    flexDirection: 'row',
    paddingLeft: '4%',
    paddingBottom: 10,
    paddingTop: 4,
  },
  notificationStyle: {
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mLeft12: {
    marginLeft: 12,
  },
  width100: {
    width: 100,
  },
  switchBoardText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textNewColor,
    paddingLeft: 8,
    alignSelf: 'center',
  },
  pRight16: {
    paddingRight: 16,
  },
  fDRow: {
    flexDirection: 'row',
  },
  pVartical2: {
    paddingVertical: 2,
  },
  switchBoardLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 4,
  },
  switchBoardLinkText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.blue,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    paddingLeft: 8,
  },
  commonTextData: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: COLORS.textNewColor,
  },
  commonTextTitle: {
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.graySubText,
  },

  borderBottomWidth: {
    borderWidth: 0.8,
    borderColor: COLORS.borderBottom,
    marginTop: 24,
  },
  borderLeftWidth: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.borderBottom,
    marginHorizontal: 25,
  },
  w10: {
    width: '10%',
  },
  mVertical10: {
    marginVertical: 10,
  },
  managerTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
    fontWeight: '500',
  },
  managerText: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.graySubText,
  },
  w85: {
    width: '85%',
  },
  w88: {
    width: '88%',
  },
  w15: {
    width: '15%',
  },
  noticeImageStyle: {
    width: 30,
    height: 30,
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  noticeSubText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    color: COLORS.graySubText,
    maxWidth: '88%',
  },
  fastImageStyle: {
    width: 130,
    height: 90,
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: 'hidden',
    textAlign: 'center',
    borderRadius: 100,
  },
  pendingApplicationContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: COLORS.lightGray7,
    elevation: 3,
    borderWidth: 1,
    backgroundColor: COLORS.white,
    marginVertical: 8,
  },
  pendingApplicationSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  width45: {
    width: 45,
  },
  applicationCon: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '75%',
  },
  applicationTitle: {
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  applicationDate: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: COLORS.graySubText,
    maxWidth: '88%',
  },
  policyTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  policyFileTxt: {
    fontSize: 14,
    lineHeight: 20,
    color: '#468EF2',
    textDecorationLine: 'underline',
  },
  policyView: {
    flexDirection: 'row',
    width: '82%',
  },
  width100p: {
    width: '100%',
  },
  locationTime: {
    backgroundColor: COLORS.iconGrayBackground,
    width: 60,
    height: 60,
    justifyContent: 'center',
    borderRadius: 99,
    marginRight: 16,
  },
  remotePunch: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: COLORS.primary,
    textAlign: 'center',
    paddingRight: 8,
  },
  attendance: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    color: COLORS.textNewColor,
  },
  viewPayslip: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    marginTop: 10,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payslipImg: {
    width: 40,
    height: 40,
    alignSelf: 'center',
  },
  payslipCon: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  cardContainer: {
    marginVertical: 10,
    // backgroundColor: '#2E3192',
    // borderWidth: 1,

    height: 400,
    width: 300,
    alignSelf: 'center',
  },
  topContainer: {
    backgroundColor: '#2E3192',
    flex: 1,
    // padding: 5,
  },

  titleTxt: {
    color: 'blue',
    fontSize: 15,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 1,
  },
  profileImage2: {
    height: '80%',
    width: '100%',
    alignSelf: 'center',

    marginBottom: 30,
  },
  imgContainer: {
    flex: 1,
    width: 230,
    // backgroundColor: 'blue',
    alignSelf: 'center',
    marginTop: 30,
    justifyContent: 'flex-end',
  },
  content: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    // backgroundColor: 'blue',
    width: '100%',
    paddingVertical: 10,
    zIndex: 9999,
  },
  content2: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',

    width: '100%',
    height: 110,
    // opacity: 0.2,
    paddingVertical: 10,
  },
  nameTxt: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 20,
  },
  idParentContainer: {
    padding: 20,
    paddingTop: 35,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dynamicContent: {
    position: 'absolute',
    left: 40,
    bottom: 20,
  },
  qr: {
    position: 'absolute',
    right: 60,
    top: 40,
  },
  titleTxt2: {
    flex: 0.43,
    color: COLORS.black,
    fontSize: 14.5,
    lineHeight: 20,
    fontWeight: '500',
  },
  designationTxt: {
    fontSize: 11.3,
    fontWeight: '500',
    color: COLORS.graySubText,
    lineHeight: 20,
    fontFamily: 'DIN_Medium',
  },
  numTxt: {
    fontSize: 11.3,
    fontWeight: '500',
    color: COLORS.black,
    fontFamily: 'DIN_Medium',
    lineHeight: 20,
  },
});
