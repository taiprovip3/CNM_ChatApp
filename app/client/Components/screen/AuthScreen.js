import { StyleSheet, Text, View, TextInput, Button, Pressable, SafeAreaView, LogBox } from 'react-native';
import { NativeBaseProvider, Input, Icon, Box, HStack, Select, CheckIcon } from 'native-base';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIconsV from 'react-native-vector-icons/MaterialCommunityIcons';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../provider/AuthProvider';
import { auth } from '../../firebase';
import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons, Zocial } from '@expo/vector-icons';
import { collection, addDoc, Timestamp, doc, setDoc } from "firebase/firestore";
import { database } from '../../firebase';

export default function AuthScreen({ navigation }){
    LogBox.ignoreLogs(['Warning:...']); // ignore specific logs
    LogBox.ignoreAllLogs(); // ignore all logs
//0. Khởi tạo biến
    const { currentUser } = useContext(AuthContext);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [logEmail, setLogEmail] = useState('');
    const [logPassword, setLogPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [componentToShow, setComponentToShow] = useState("LOGIN_BY_EMAIL");
    const [regPhoneNumber, setRegPhoneNumber] = useState("");
    const [countryCode, setCountryCode] = React.useState("+84");

//1. Sử lý ngoại lệ
    useEffect(() => {
        if(currentUser){
            Toast.show({
                type: 'info',
                text1: 'Phiên đăng nhập vẫn còn',
                text2: 'Chuyển hướng đến trang chủ ....'
            });
            setTimeout(() => {
                navigation.navigate('HomepageScreen');
            }, 200);
        }
    }, [currentUser]);
    
    //2. Tạo hàm cần thiết sử dụng
    const handleRegisterAccountByUsernameAndPassword = () => {
        if(regEmail == ''){
            Toast.show({
                type: 'error',
                text1: 'Vui lòng kiểm tra lại trường email',
            });
            return;
        }
        if(regPassword.length <= 0){
            Toast.show({
                type: 'error',
                text1: 'Vui lòng kiểm tra lại trường mật khẩu',
            });
            return;
        }
        if(rePassword !== regPassword){
            Toast.show({
                type: 'error',
                text1: 'Nhập lại mật khẩu chưa trùng khớp',
            });
            return;
        }
        if(fullName.length <= 0){
            Toast.show({
                type: 'error',
                text1: 'Vui lòng nhập họ và tên',
            });
            return;
        }
        createUserWithEmailAndPassword(auth, regEmail, regPassword)
            .then( (userCredential) => {
                const user = userCredential.user;
                console.log('Just registerd an user: ', user);
                Toast.show({
                    type: 'success',
                    text1: 'Đăng ký tài khoản thành công',
                    text2: 'Dịch chuyển bạn đến trang chủ... 👋'
                });
                setTimeout(() => {
                    navigation.navigate('HomepageScreen');
                }, 2000);
                const { email, uid } = user;
                setDoc(doc(database, 'Users', uid), {
                    id: uid,
                    email: email,
                    fullName: fullName,
                    age: 0,
                    joinDate: Timestamp.now().toDate().toLocaleTimeString('en-US'),
                    address: 'undifined',
                    roles: ['MEMBER'],
                    sex: false,
                    photoURL: 'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg',
                    slogan: 'Xin chào bạn, mình là người tham gia mới. Bạn bè hãy cùng nhau giúp đỡ nhé!'
                });
            })
            .catch( (error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if(errorCode === 'auth/email-already-in-use'){
                    console.log('error1: ', errorCode + errorMessage);
                    Toast.show({
                        type: 'error',
                        text1: 'Error' + errorCode,
                        text2: errorMessage
                    });
                } else{
                    console.log('error2: ', errorCode + errorMessage);
                    Toast.show({
                        type: 'error',
                        text1: 'Error' + errorCode,
                        text2: errorMessage
                    });
                }
            });
    } //end hàm register
    const handleRegisterAccountByPhoneNumber = () => {
        if(regPhoneNumber == "" || regPhoneNumber === undefined) {
            Toast.show({
                type: 'error',
                text1: 'Vui lòng kiểm tra lại trường SĐT',
            });
            return;
        }
    }
    const handleLoginAccountByUsernameAndPassword = () => {
        signInWithEmailAndPassword(auth, logEmail, logPassword)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('User signed in: ', user);
                Toast.show({
                    type: 'success',
                    text1: 'Login Successully',
                    text2: 'We"ll redirect you to panel soon...'
                });
                setTimeout(() => {
                    navigation.navigate('HomepageScreen');
                }, 1500);
            })
            .catch( (error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if(errorCode === 'auth/email-already-in-use'){
                    console.log('error1: ', errorCode + errorMessage);
                    Toast.show({
                        type: 'error',
                        text1: 'Error' + errorCode,
                        text2: errorMessage
                    });
                } else{
                    console.log('error2: ', errorCode + errorMessage);
                    Toast.show({
                        type: 'error',
                        text1: 'Error' + errorCode,
                        text2: errorMessage
                    });
                }
            });
    }



    //3. Render html
    return(
    <NativeBaseProvider>
        <Toast position='bottom' bottomOffset={20} />
        <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
            {/* View Header */}
            <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 40, color: 'blue', fontWeight: 'bold'}}>Ultimate Chat</Text>
                <Text>Vui lòng đăng nhập tài khoản UChat</Text>
                <Text>để kết nối ứng dụng UChat</Text>
                <Text>&emsp;</Text>
            </View>
            

            {
                (componentToShow === "LOGIN_BY_EMAIL") ?
                <View style={{backgroundColor:'white'}}>
                    <View style={{flexDirection:'row',padding:10}}>
                        <Text style={{borderColor:'black',borderBottomWidth:1,borderRightWidth:1, width:'50%',textAlign:'center',fontWeight:'bold'}}
                        >ĐĂNG NHẬP</Text>
                        <Pressable style={{width: '50%'}} onPress={() => setComponentToShow("REGISTER_BY_EMAIL")}>
                            <Text style={{borderColor:'grey',borderBottomWidth:1,textAlign:'center'}}>ĐĂNG KÝ</Text>
                        </Pressable>
                    </View>
                    <View style={{padding: 30}}>
                        <Input
                            w={{ base: "100%", md: "25%", lg: "100%" }} mb='1'
                            InputLeftElement={
                                <Icon as={<MaterialIcons name="person" />} size={5} ml="2" color="muted.400" />
                            }
                            placeholder="Địa chỉ Email hoặc Số điện thoại"
                            onChangeText={(e) => setLogEmail(e)}
                            value={logEmail}
                        />
                        <Input
                            w={{ base: "100%", md: "25%", lg: "100%" }} mt='1'
                            type={isShowPassword ? "text" : "password"}
                            InputRightElement={
                                <Pressable onPress={() => setIsShowPassword(!isShowPassword)}>
                                    <Icon as={<MaterialIcons name={isShowPassword ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                                </Pressable>
                            }
                            placeholder="Mật khẩu"
                            onChangeText={(e) => setLogPassword(e)}
                            value={logPassword}
                        />
                        <Text>&emsp;</Text>
                        <Button style={{marginTop: 20}} title="Đăng nhập với mật khẩu" onPress={handleLoginAccountByUsernameAndPassword}/>
                        <Text>&emsp;</Text>
                        <Text style={{textAlign: 'center', color: 'blue', textDecorationLine: 'underline'}}>Quên mật khẩu?</Text>
                    </View>
                </View>
                : (componentToShow === "REGISTER_BY_EMAIL") ?
                <View style={{backgroundColor: 'white'}}>
                    <View style={{flexDirection: 'row',padding: 7}}>
                        <Pressable style={{width: '50%'}} onPress={() => setComponentToShow("LOGIN_BY_EMAIL")}>
                            <Text style={{borderColor:'grey',borderBottomWidth:1, textAlign: 'center'}}>ĐĂNG NHẬP</Text>
                        </Pressable>
                        <Text style={{borderColor:'black',borderBottomWidth:1,borderLeftWidth:1,width:'50%',textAlign:'center',fontWeight:'bold'}}>ĐĂNG KÝ</Text>
                    </View>
                    <Box mx='5'>
                        <Input
                            w={{ base: '100%', md: '25%', lg: "100%" }}
                            InputLeftElement={
                                <Icon as={<FontAwesome5 name="user-alt" size={24} />} color="blue.900" />
                            }
                            size='md'
                            variant='underlined'
                            placeholder=' Họ và tên'
                            onChangeText={(e) => setFullName(e)} value={fullName}
                        />
                        <Input
                            w={{ base: '100%', md: '25%', lg: "100%" }}
                            InputLeftElement={
                                <Icon as={<Zocial name="email" size={24} />} color="blue.900" />
                            }
                            size='md'
                            variant='underlined'
                            placeholder=' Địa chỉa email'
                            onChangeText={(e) => setRegEmail(e)} value={regEmail}
                        />
                        <Input
                            w={{ base: '100%', md: '25%', lg: "100%" }}
                            InputLeftElement={
                                <Icon as={<Ionicons name="keypad-sharp" size={24} />} color="blue.900" />
                            }
                            type='password'
                            size='md'
                            variant='underlined'
                            placeholder=' Mật khẩu'
                            onChangeText={(e) => setRegPassword(e)} value={regPassword}
                        />
                        <Input
                            w={{ base: '100%', md: '25%', lg: "100%" }}
                            InputLeftElement={
                                <Icon as={<MaterialCommunityIcons name="folder-key" size={24} />} color="blue.900" />
                            }
                            type='password'
                            size='md'
                            variant='underlined'
                            placeholder=' Xác nhận Mật khẩu'
                            onChangeText={(e) => setRePassword(e)} value={rePassword}
                        />
                        <Text>&emsp;</Text>
                        <Button style={{marginTop: 20}} title="Đăng ký tài khoản" onPress={handleRegisterAccountByUsernameAndPassword}/>
                        <Text style={{margin: 5, textAlign: 'center'}}>Hoặc</Text>
                        <IconFontAwesome.Button
                            name="facebook"
                            backgroundColor="#3b5998"
                        >
                            Đăng ký với tài khoản Facebook
                        </IconFontAwesome.Button>
                        <MaterialCommunityIconsV.Button
                            name='cellphone-message'
                            onPress={() => setComponentToShow("REGISTER_BY_PHONENUMBER")}
                        >
                            Đăng ký tài khoản bằng SĐT
                        </MaterialCommunityIconsV.Button>
                    </Box>
                </View>
                : (componentToShow === "REGISTER_BY_PHONENUMBER") ?
                <View style={{backgroundColor: 'white'}}>
                    <View style={{flexDirection: 'row',padding: 7}}>
                        <Pressable style={{width: '50%'}} onPress={() => setComponentToShow("LOGIN_BY_EMAIL")}>
                            <Text style={{borderColor:'grey',borderBottomWidth:1, textAlign: 'center'}}>ĐĂNG NHẬP</Text>
                        </Pressable>
                        <Text style={{borderColor:'black',borderBottomWidth:1,borderLeftWidth:1,width:'50%',textAlign:'center',fontWeight:'bold'}}>ĐĂNG KÝ</Text>
                    </View>
                    <Box mx='5'>
                        <HStack>
                            <Select selectedValue={countryCode} minWidth="100" accessibilityLabel="Choose Service" placeholder="Vietnam (+84)" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />
                            }} mt={1} onValueChange={itemValue => setCountryCode(itemValue)}>
                                <Select.Item label="Taiwan (+886)" value="+886" />
                                <Select.Item label="South Korea (+82)" value="+82" />
                                <Select.Item label="China (+86)" value="+86" />
                                <Select.Item label="United States (+1)" value="+1" />
                                <Select.Item label="United Kingdom (+44)" value="+44" />
                                <Select.Item label="Singapore (+65)" value="+65" />
                                <Select.Item label="France (+33)" value="+33" />
                            </Select>
                            <Input
                                w={{ base: '100%', md: '25%', lg: "100%" }}
                                InputLeftElement={
                                    <Icon as={<MaterialCommunityIcons name="cellphone-message" size={24} />} color="blue.900" />
                                }
                                size='md'
                                variant='underlined'
                                placeholder=' Nhập số điện thoại...'
                                onChangeText={(e) => setRegPhoneNumber(e)} value={regPhoneNumber}
                            />
                        </HStack>
                        <Text>&emsp;</Text>
                        <Button style={{marginTop: 20}} title="Đăng ký tài khoản" onPress={handleRegisterAccountByPhoneNumber}/>
                        <Text style={{margin: 5, textAlign: 'center'}}>Hoặc</Text>
                        <IconFontAwesome.Button
                            name="facebook"
                            backgroundColor="#3b5998"
                        >
                            Đăng ký với tài khoản Facebook
                        </IconFontAwesome.Button>
                        <MaterialCommunityIconsV.Button
                            name='email-multiple'
                            onPress={() => setComponentToShow("REGISTER_BY_EMAIL")}
                        >
                            Đăng ký tài khoản bằng Email
                        </MaterialCommunityIconsV.Button>
                    </Box>
                </View>
                : null
            }








            <View style={{alignItems: 'center'}}>
                <Text>&emsp;</Text>
                <Text>Tiếng Việt</Text>
                <Text>Copyright <IconFontAwesome5 name='copyright' color="black" solid/> 2022 Nhóm 9 UltimtateChat Application</Text>
                <Text>Terms of Use | Privacy Policy</Text>
            </View>
        </View>
    </NativeBaseProvider>
    )
};