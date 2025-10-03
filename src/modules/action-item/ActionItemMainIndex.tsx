import {useIsFocused, useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import ContainerNew from '../../common/components/Container';
import CustomHeader from '../../common/components/CustomHeader';
import CustomTextNew from '../../common/components/CustomText';
import useAsyncEffect from '../../common/packages/useAsyncEffect/useAsyncEffect';
import {useRootStore} from '../../stores/rootStore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../../common/constant/Themes';
import Column from '../../common/components/Column';
import CustomFlatList from '../../common/components/CustomFlatList';
import Row from '../../common/components/Row';
import {_todayDate, dateFormater} from '../../common/services/todayDate';

const edges: Edge[] = ['right', 'bottom', 'left'];

const ActionItemMainIndex = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      //api call here
      console.log(userInfo);
    },
    [isFocused],
  );
  const handleProfilePress = () => {
    navigation.navigate('ProfileScreen');
  };
  const renderItem = ({item}: any) => (
    <View
      style={{
        marginHorizontal: 16,
      }}>
      <Row
        rowWidth="100%"
        isCard
        direction="column"
        isPressOn={false}
        justify="space-between"
        onCardPress={() => console.log('Details Screen')}>
        <Row justify="space-between">
          <Column colWidth="80%">
            <CustomTextNew
              txtStyle={styles.headText}
              text={`Created ${dateFormater(_todayDate())}`}
            />
          </Column>
        </Row>

        <Row justify="flex-start">
          <Column colWidth="50%">
            <CustomTextNew text={'Task Id - 1002'} />
          </Column>
          <Column colWidth="50%">
            <CustomTextNew text={`Title - Order Create`} txtAlign={'right'} />
          </Column>
        </Row>

        <Row justify="flex-start">
          <Column colWidth="50%">
            <CustomTextNew text={'Duration-2 days'} />
          </Column>
          <Column colWidth="50%">
            <CustomTextNew text={'Head Office'} txtAlign={'right'} />
          </Column>
        </Row>
      </Row>
    </View>
  );
  return (
    <ContainerNew
      edges={edges}
      isFloatBottomButton
      singleFloatBtmBtnPress={() => console.log('Create New Action Item')}
      header={
        <CustomHeader
          title="Action Items"
          components={
            <TouchableOpacity
              onPress={handleProfilePress}
              style={styles.iconContainer}>
              <Icon name="person" size={25} color="#fff" />
            </TouchableOpacity>
          }
        />
      }
      style={styles.container}>
      <Column>
        <CustomFlatList
          contentContainerStyle={{
            paddingBottom: 150,
          }}
          data={[1, 2, 3]}
          RenderItems={renderItem}
        />
      </Column>
    </ContainerNew>
  );
};

export default ActionItemMainIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  iconContainer: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  headText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: COLORS.textNewColor,
  },
  cardTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: COLORS.textNewColor,
    paddingVertical: 2,
  },
  stsTxt: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
    color: COLORS.green,
  },
  cardSubTitle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: COLORS.textNewColor,
    paddingVertical: 2,
  },
});
