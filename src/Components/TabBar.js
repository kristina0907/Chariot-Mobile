import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const S = StyleSheet.create({
  container: { position: "absolute", bottom: 10, left: 10, justifyContent: 'space-between', right: 10, flexDirection: "row", alignItems: "baseline", zIndex:0, height: 52 },
  tabButton: { justifyContent: "center", alignItems: "center", padding:15, backgroundColor: "#ff6600", color: "#ffffff", borderRadius: 10, height: 52 }
});

const TabBar = props => {
  const {
    renderIcon,
    getLabelText,
    activeTintColor,
    inactiveTintColor,
    onTabPress,
    onTabLongPress,
    getAccessibilityLabel,
    navigation
  } = props;

  const { routes, index: activeRouteIndex } = navigation.state;

  return (
    <View style={S.container}>
      {routes.map((route, routeIndex) => {
        const isRouteActive = routeIndex === activeRouteIndex;
        const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;

        return (
          <TouchableOpacity
            key={routeIndex}
            style={S.tabButton}
            onPress={() => {
              onTabPress({ route });
            }}
            onLongPress={() => {
              onTabLongPress({ route });
            }}
            accessibilityLabel={getAccessibilityLabel({ route })}
          >
            <View style={{flexDirection: "row"}}>
              {renderIcon({ route, focused: isRouteActive, tintColor })}
              <Text style={{ color: "#ffffff", marginLeft:5 }}>{getLabelText({ route })}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;