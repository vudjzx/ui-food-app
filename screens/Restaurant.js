import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {get} from 'react-native/Libraries/Utilities/PixelRatio';

import {icons, images, SIZES, COLORS, FONTS} from '../constants';

const Restaurant = ({navigation, route}) => {
  const scrollX = new Animated.Value(0);
  const [restaurant, setRestaurant] = useState(null);
  const [currentLocation, setcurrentLocation] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  React.useEffect(() => {
    let {item, currentLocation} = route.params;
    setRestaurant(item);
    setcurrentLocation(currentLocation);
  });

  const editOrder = (action, menuId, price) => {
    let orderList = orderItems.slice();
    let item = orderList.filter(a => a.menuId == menuId);
    if (action == '+') {
      if (item.length > 0) {
        let newCount = item[0].count + 1;
        item[0].count = newCount;
        item[0].total = item[0].count * price;
      } else {
        const newItem = {
          menuId: menuId,
          count: 1,
          price: price,
          total: price,
        };
        orderList.push(newItem);
      }
      setOrderItems(orderList);
    } else {
      if (item.length > 0) {
        if (item[0]?.count > 0) {
          let newCount = item[0].count - 1;
          item[0].count = newCount;
          item[0].total = newCount * price;
        }
      }
      setOrderItems(orderList);
    }
  };

  const getOrderCount = menuId => {
    let orderItem = orderItems.filter(a => a.menuId == menuId);
    if (orderItem.length > 0) {
      return orderItem[0].count;
    } else {
      return 0;
    }
  };

  const getCartCount = () => {
    let itemCount = orderItems.reduce((a, b) => a + (b.count || 0), 0);
    return itemCount;
  };

  const orderTotal = () => {
    let total = orderItems.reduce((a, b) => a + (b.total || 0), 0);
    return total.toFixed(2);
  };
  const renderHeader = () => (
    <View style={{flexDirection: 'row', paddingTop: 10, paddingBottom: 5}}>
      <TouchableOpacity
        style={{
          width: 50,
          paddingLeft: SIZES.padding * 2,
          justifyContent: 'center',
        }}
        onPress={() => navigation.goBack()}>
        <Image
          source={icons.back}
          resizeMode="contain"
          style={{
            width: 30,
            height: 30,
          }}
        />
      </TouchableOpacity>
      {/* Restaurant name section  */}
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: SIZES.padding * 3,
            borderRadius: SIZES.radius,
            backgroundColor: 'transparent',
          }}>
          <Text style={{...FONTS.h3}}>{restaurant?.name}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={{
          width: 50,
          paddingRight: SIZES.padding * 2,
          justifyContent: 'center',
        }}>
        <Image
          source={icons.list}
          resizeMode="contain"
          style={{
            width: 30,
            height: 30,
          }}
        />
      </TouchableOpacity>
    </View>
  );

  const renderFoodInfo = () => (
    <Animated.ScrollView
      horizontal
      pagingEnabled
      scrollEventThrottle={16}
      showsHorizontalScrollIndicator={false}
      onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
        useNativeDriver: false,
      })}>
      {restaurant?.menu.map((item, index) => (
        <View key={`menu-${index}`} style={{alignItems: 'center'}}>
          <View style={{height: SIZES.height * 0.35}}>
            {/* food image */}
            <Image
              source={item.photo}
              resizeMode="cover"
              style={{
                width: SIZES.width,
                height: '100%',
              }}
            />

            {/* counter */}

            <View
              style={{
                position: 'absolute',
                bottom: -20,
                width: SIZES.width,
                height: 50,
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  width: 50,
                  backgroundColor: COLORS.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTopLeftRadius: 25,
                  borderBottomLeftRadius: 25,
                }}
                onPress={() => editOrder('-', item.menuId, item.price)}>
                <Text style={{...FONTS.body1}}>-</Text>
              </TouchableOpacity>

              <View
                style={{
                  width: 50,
                  backgroundColor: COLORS.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{...FONTS.h2}}>{getOrderCount(item.menuId)}</Text>
              </View>

              <TouchableOpacity
                style={{
                  width: 50,
                  backgroundColor: COLORS.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTopRightRadius: 25,
                  borderBottomRightRadius: 25,
                }}
                onPress={() => editOrder('+', item.menuId, item.price)}>
                <Text style={{...FONTS.body1}}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Name&description */}
          <View
            style={{
              width: SIZES.width,
              alignItems: 'center',
              marginTop: 15,
              paddingHorizontal: SIZES.padding * 2,
            }}>
            <Text
              style={{marginVertical: 10, textAlign: 'center', ...FONTS.h2}}>
              {item.name} - {item.price.toFixed(2)}
            </Text>
            <Text style={{...FONTS.body3}}>{item.description}</Text>

            {/* Calories */}
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
              }}>
              <Image
                source={icons.fire}
                style={{
                  width: 20,
                  height: 20,
                  marginRight: 10,
                }}
              />
              <Text
                style={{
                  ...FONTS.body3,
                  color: COLORS.darkgray,
                }}>
                {item.calories.toFixed(2)} cal
              </Text>
            </View>
          </View>
        </View>
      ))}
    </Animated.ScrollView>
  );

  const renderDots = () => {
    const dotPosition = Animated.divide(scrollX, SIZES.width);
    return (
      <View style={{height: 30}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: SIZES.padding,
          }}>
          {restaurant?.menu.map((item, index) => {
            const opacity = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            const dotSize = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [SIZES.base * 0.8, 10, SIZES.base * 0.8],
              extrapolate: 'clamp',
            });

            const dotColor = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [COLORS.darkgray, COLORS.primary, COLORS.darkgray],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={`dot-${index}`}
                opacity={opacity}
                style={{
                  borderRadius: SIZES.radius,
                  marginHorizontal: 6,
                  width: dotSize,
                  height: dotSize,
                  backgroundColor: dotColor,
                }}
              />
            );
          })}
        </View>
      </View>
    );
  };
  const renderOrder = () => {
    return (
      <View>
        {renderDots()}
        <View
          style={{
            backgroundColor: COLORS.white,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: SIZES.padding * 2,
              paddingHorizontal: SIZES.padding * 3,
              borderBottomColor: COLORS.lightGray2,
              borderBottomWidth: 1,
            }}>
            <Text style={{...FONTS.h3}}>
              {getCartCount()} Items in the cart
            </Text>
            <Text style={{...FONTS.h3}}>${orderTotal()}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: SIZES.padding * 2,
              paddingHorizontal: SIZES.padding * 3,
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Image
                source={icons.pin}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                  tintColor: COLORS.darkgray,
                }}
              />
              <Text style={{marginLeft: SIZES.padding, ...FONTS.h4}}>
                Location
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={icons.master_card}
                resizeMode="contain"
                style={{
                  height: 20,
                  width: 20,
                  tintColor: COLORS.darkgray,
                }}
              />
              <Text style={{marginLeft: SIZES.padding, ...FONTS.h4}}>9999</Text>
            </View>
          </View>

          {/* Order button */}
          <View
            style={{
              padding: SIZES.padding * 2,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={{
                width: SIZES.width * 0.9,
                padding: SIZES.padding,
                backgroundColor: COLORS.primary,
                alignItems: 'center',
                borderRadius: SIZES.radius,
              }}
              onPress={() =>
                navigation.navigate('OrderDelievery', {
                  restaurant: restaurant,
                  currentLocation: currentLocation,
                })
              }>
              <Text style={{color: COLORS.white, ...FONTS.h2}}>Order now</Text>
            </TouchableOpacity>
          </View>
        </View>
        {isIphoneX() && (
          <View
            style={{
              position: 'absolute',
              bottom: -34,
              left: 0,
              right: 0,
              height: 34,
              backgroundColor: COLORS.white,
            }}></View>
        )}
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderFoodInfo()}
      {renderOrder()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray2,
  },
});
export default Restaurant;
