import React, { Component } from 'react';
import Router from 'react-native-easy-router'
import { AppRegistry, View, StyleSheet, Text, TextInput } from 'react-native'
import { BottomNavigation, Checkbox, Button, Subheader, Icon } from 'react-native-material-ui'

const styles = StyleSheet.create({
  fabMenuStyle: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default class BottomNavigationControl extends Component {
    state = {
      navIndex: 0,
    };
    constructor(props) {
      super(props);
      this.state = { text: '' };
    }
    render() {
      return (
        <View>
          <BottomNavigation active={this.state.active} hidden={false} style={styles.fabMenuStyle}>
          <BottomNavigation.Action
            key="today"
            icon="today"
            label="Today"
            onPress={() => this.setState({ active: 'today' })}
          />
          <BottomNavigation.Action
            key="people"
            icon="people"
            label="People"
            onPress={() => this.setState({ active: 'people' })}
          />
          <BottomNavigation.Action
            key="bookmark-border"
            icon="bookmark-border"
            label="Bookmark"
            onPress={() => this.setState({ active: 'bookmark-border' })}
          />
          <BottomNavigation.Action
            key="settings"
            icon="settings"
            label="Settings"
            onPress={() => this.setState({ active: 'settings' })}
          />
        </BottomNavigation>
        </View>
      );
    }
  }