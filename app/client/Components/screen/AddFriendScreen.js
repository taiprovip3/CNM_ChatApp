import React, { Component } from 'react'
import { Text, StyleSheet, View, Button, Image, TextInput, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';


export default class HomeScreen extends Component {
    render() {
        // neu la class component thi can phai su dung this.props
        const { navigation } = this.props

        return (
            <View style={styles.homeSc}>
                <View style={styles.topsc1}>

                    <Text style={styles.txtThemBan}>
                        Thêm bạn bằng số điện thoại
                    </Text>
                    <Image source={{uri:'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg'}}
                        style={styles.imgXanh}
                    />

                    <Button title="VietNam(84) >" onPress={() => { navigation.navigate('New Group') }}
                        style={styles.btnSDT}
                    />

                    <View style={styles.addTask}>
                        <TextInput
                            /* truyen gia tri cua task vao cho nut + */

                            placeholder='Nhập số điện thoại'
                            style={styles.input} />

                        <TouchableOpacity
                        >
                            <View style={styles.tim}>
                                <Text style={styles.timText}>Tìm</Text>
                            </View>

                        </TouchableOpacity>
                    </View>

                    <View style={styles.QR}>
                        <Ionicons name='qr-code' size={60} color='black'>

                        </Ionicons>

                        <TouchableOpacity
                        >
                            <View style={styles.btnQR}>
                                <Text style={styles.txtQR2}>Quét mã QA (thêm bạn bằng mã QA)</Text>
                            </View>

                        </TouchableOpacity>
                    </View>

                    <View style={styles.MayBe}>
                        <AntDesign name="user" size={50} color="black" />

                        <TouchableOpacity
                        >
                            <View style={styles.btnMayBe}>
                                <Text style={styles.txtMayBe2}>Có thể bạn quen (thêm bạn từ danh sách gợi ý)</Text>
                            </View>

                        </TouchableOpacity>
                    </View>

                    <View style={styles.DaGui}>
                        <AntDesign name="adduser" size={50} color="black" />

                        <TouchableOpacity
                        >
                            <View style={styles.btndaGui}>
                                <Text style={styles.txtDaGui}>Lời mời kết bạn đã gửi</Text>
                            </View>

                        </TouchableOpacity>
                    </View>

                    <View style={styles.GioiThieu}>
                        <AntDesign name="addusergroup" size={50} color="black" />

                        <TouchableOpacity
                        >
                            <View style={styles.btngioiThieu}>
                                <Text style={styles.txtgioiThieu}>Gioi thiệu Zalo cho bạn bè</Text>
                            </View>

                        </TouchableOpacity>
                    </View>



                </View>

                

            </View>
        )
    }
}

const styles = StyleSheet.create({
    homeSc: {
        flex: 1,
        backgroundColor: '#ffff',
    },

    topsc1: {
        flex: 1,
    },

    txtThemBan: {
        fontSize: 18,
        fontWeight: '100',
        marginLeft: 20,
    },

    imgXanh: {
        width: 100,
        height: 120,
        marginLeft: 180,
    },

    btnSDT: {

    },

    addTask: {
        paddingHorizontal: 30,
        width: '100%',
        flexDirection: 'row',
        marginBottom: 13,
        justifyContent: 'space-between',
        alignItems: 'center',


    },

    input: {
        height: 44,
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#d8bfd8',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 15,

    },

    tim: {
        width: 50,
        height: 45,
        backgroundColor: '#7fffd4',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        marginTop: 15,

    },

    QR: {
        paddingHorizontal: 30,
        width: '100%',
        flexDirection: 'row',
        marginBottom: 13,
        justifyContent: 'space-between',
        alignItems: 'center',


    },



    btnQR: {

        width: '110%',
        height: 45,
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 15,
        marginRight: 120,

    },

    MayBe: {
        paddingHorizontal: 30,
        width: '100%',
        flexDirection: 'row',
        marginBottom: 13,
        justifyContent: 'space-between',
        alignItems: 'center',


    },

    iconMaybe: {

        height: 44,
        width: '190%',
        backgroundColor: '#ffe4e1',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        marginTop: 15,

    },

    btnMayBe: {

        width: '110%',
        height: 45,
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 15,
        marginRight: 60,

    },

    DaGui: {
        paddingHorizontal: 30,
        width: '100%',
        flexDirection: 'row',
        marginBottom: 13,
        justifyContent: 'space-between',
        alignItems: 'center',


    },



    btndaGui: {

        width: '110%',
        height: 45,
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 15,
        marginRight: 200,

    },
    GioiThieu: {
        paddingHorizontal: 30,
        width: '100%',
        flexDirection: 'row',
        marginBottom: 13,
        justifyContent: 'space-between',
        alignItems: 'center',


    },



    btngioiThieu: {

        width: '110%',
        height: 45,
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 15,
        marginRight: 180,

    },



    // bottomBuy: {
    //     flex: 1,
    // },

    // btnBuy: {
    //     marginTop: 100,
    //     marginHorizontal: 30,
    //     borderRadius: 20,
    // },
});
