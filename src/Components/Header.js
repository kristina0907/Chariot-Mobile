import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { CachedImage } from 'react-native-cached-image';
import { Images } from '../images/images';



export default Header = (props) => (
    <View style={
        (() => {
            switch (props.parameter) {
                case 'top':
                    return [styles.headerBack, { marginTop: 0 }]
                    break;
                case 'right':
                    return styles.headerBackRight
                    break;
                default:
                    return styles.headerBack
                    break;
            }
        })()
    }>
        {
            (() => {
                switch (props.parameter) {
                    case 'right':
                        return (
                            <TouchableOpacity style={{width:'100%', height:'100%',alignItems:'center'}} onPress={() => props.navigation.goBack(null)}>
                                <CachedImage style={{ width: 10, height: 20 }} source={Images['back']} fallbackSource={Images['back']} />
                            </TouchableOpacity>)
                        break;
                    default:
                        return (
                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => props.navigation.goBack(null)}>
                                <CachedImage style={{ marginLeft: 5, width: 10, height: 20 }} source={Images['back']} fallbackSource={Images['back']} />
                                <Text style={{ marginLeft: 50, fontSize: 15, fontWeight: 'bold', color: '#0099ff' }}>{props.title}</Text>
                            </TouchableOpacity>)
                        break;
                }
            })()
        }
    </View>
)

const styles = StyleSheet.create({
    headerBack: {
        backgroundColor: '#ffffff',
        paddingTop: 15,
        // justifyContent: 'center',
        // alignItems:'flex-start',
        width: '100%',
        height: 60,
        marginTop: 70,
    },
    headerBackRight: {
        position: "absolute",
        top: 10,
        right: 10,
        borderRadius: 50,
        width: 50,
        height: 50,
        backgroundColor: '#ffffff',
        padding: 15,
        zIndex: 0,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOpacity: 0.75,
        shadowRadius: 1,
        shadowColor: 'gray',
        shadowOffset: { height: 3, width: 0 },
        elevation: 7
    }
})