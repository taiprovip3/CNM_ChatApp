import React, { Component } from 'react'
import { Text, StyleSheet, View, Button, Image, TouchableOpacity, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons';

export default class ProductScreen extends Component {
    render() {
        const { navigation } = this.props
        return (
            <View style={styles.sc2}>
                <View style={styles.taoNhom}>
                    <AntDesign name="camerao" size={50} color="black" />

                    <TextInput
                        /* truyen gia tri cua task vao cho nut + */

                        placeholder='Đặt tên nhóm'
                        style={styles.inputAddGroup} />
                </View>


                <View style={styles.timTen}>
                    <AntDesign name="search1" size={50} color="black" />

                    <TextInput
                        /* truyen gia tri cua task vao cho nut + */

                        placeholder='Tìm tên hoặc số điện thoại'
                        style={styles.inputTimTen} />
                </View>

                <View style={styles.doubleDanhBa}>
                    <TouchableOpacity
                    >
                        <View style={styles.GanDay}>
                            <Text style={styles.txtGanDay}>Gần Đây</Text>
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity
                    >
                        <View style={styles.DanhBa}>
                            <Text style={styles.txtDanhBa}>Danh Bạ</Text>
                        </View>

                    </TouchableOpacity>
                </View>



                <View style={styles.sc2Bottom}>

                    <Text style={styles.txtChonMau}>
                        Chưa có danh sách bạn bè!
                    </Text>


                    <Button
                        title='Go back'
                        onPress={() => { navigation.goBack() }}
                        style={styles.btngoback}

                    >

                    </Button>

                    
                </View>

            </View>

        )
    }
}

const styles = StyleSheet.create({
    sc2: {
        flex: 1,
    },

    taoNhom: {
        paddingHorizontal: 30,
        width: '100%',
        flexDirection: 'row',
        marginBottom: 13,
        justifyContent: 'space-between',
        alignItems: 'center',


    },



    inputAddGroup: {
        height: 44,
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#d8bfd8',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 15,
        marginRight: 20,

    },

    timTen: {
        paddingHorizontal: 30,
        width: '100%',
        flexDirection: 'row',
        marginBottom: 13,
        justifyContent: 'space-between',
        alignItems: 'center',


    },



    inputTimTen: {
        height: 44,
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#d8bfd8',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 15,
        marginRight: 20,

    },

    doubleDanhBa: {
        paddingHorizontal: 30,
        width: '100%',
        flexDirection: 'row',
        marginBottom: 13,
        justifyContent: 'space-between',
        alignItems: 'center',


    },

    GanDay: {
        width: '250%',
        height: 45,
        backgroundColor: '#7fffd4',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        marginTop: 15,
        marginLeft: 5,

    },

    DanhBa: {
        width: '100%',
        height: 45,
        backgroundColor: '#7fffd4',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        marginTop: 15,
        marginRight: 180,

    },



    sc2Bottom: {
        flex: 1,
    },

    txtChonMau: {
        fontSize: 20,
        fontWeight: '500',
        marginTop: 70,
    },
    btngoback:{
        marginTop: 70,
    }
})
