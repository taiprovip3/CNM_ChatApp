import { StyleSheet, Text, View, TextInput, Button, Pressable, SafeAreaView, LogBox } from 'react-native';
import { NativeBaseProvider, Input, Icon, Box, HStack, Select, CheckIcon } from 'native-base';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIconsV from 'react-native-vector-icons/MaterialCommunityIcons';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, RecaptchaVerifier, updatePassword } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../provider/AuthProvider';
import { auth } from '../../firebase';
import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons, Zocial } from '@expo/vector-icons';
import { collection, addDoc, Timestamp, doc, setDoc, query, where, getDocs, getDoc } from "firebase/firestore";
import { database } from '../../firebase';
import moment from 'moment/moment';

export default function AuthScreen({ navigation }){
    LogBox.ignoreLogs(['Warning:...']); // ignore specific logs
    LogBox.ignoreAllLogs(); // ignore all logs


//0. Khởi tạo biến
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [logEmail, setLogEmail] = useState('taito1doraemon@gmail.com');
    const [logPassword, setLogPassword] = useState('123123az');
    const [fullName, setFullName] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [componentToShow, setComponentToShow] = useState("LOGIN_BY_EMAIL");
    const [regPhoneNumber, setRegPhoneNumber] = useState("");
    const [countryCode, setCountryCode] = React.useState("+84");
    const [confirmationToken, setConfirmationToken] = useState(null);
    const [temporaryPhoneNumberHolder, setTemporaryPhoneNumberHolder] = useState("");
    const [regOTP, setRegOTP] = useState('');


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
    
    //REGISTER_BY_EMAIL
    const registerAccount = (userObject) => {
        const { email, uid } = userObject;
        const displayName = fullName === '' ? 'DESKTOP-USER' + Math.floor(Math.random() * 9007199254740991) : fullName;
        const currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
        const user = {
          id: uid,
          email: email,
          fullName: displayName,
          age: -1,
          joinDate: currentTime,
          address: 'Không',
          roles: ['MEMBER'],
          sex: false,
          photoURL: 'https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg',
          slogan: 'Xin chào bạn, mình là người tham gia mới. Nếu là bạn bè thì hãy cùng nhau giúp đỡ nhé!',
          phoneNumber: '',
          bod: 1,
          bom: 1,
          boy: parseInt(new Date().getFullYear()-119),
          keywords: ["A", "B"],
          theme: "light",
          status: false,
          lastOnline: currentTime,
          isPrivate: false
        }
        setDoc(doc(database, 'Users', uid), user);
        Toast.show({ type: 'error', text1: 'Đăng ký tài khoản thành công', text2: 'Vui lòng kiểm tra hộp thư email... 👋' });
    };
    const sendVerifyEmail = (userCredential) => {
        sendEmailVerification(auth.currentUser)
            .then(() => {
                registerAccount(userCredential.user);
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
                Toast.show({ type: 'error', text1: errorMessage });
            });
    };
    const handleRegisterAccountByUsernameAndPassword = () => {
        if(regEmail === ''){
            Toast.show({ type: 'error', text1: 'Vui lòng kiểm tra trường `Email`' });
            return;
        }
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!regEmail.match(mailformat)){
            Toast.show({ type: 'error', text1: 'Email không hợp lệ.' });
            return;
        }
        if(regPassword.length <= 0){
            Toast.show({ type: 'error', text1: 'Vui lòng kiểm tra trường `Mật khẩu`' });
            return;
        }
        if(rePassword !== regPassword){
            Toast.show({ type: 'error', text1: '`Nhập lại mật khẩu` chưa trùng khớp' });
            return;
        }
        if(fullName.length <= 0){
            Toast.show({ type: 'error', text1: 'Vui lòng nhập `Họ và tên`' });
            return;
        }
        createUserWithEmailAndPassword(auth, regEmail, regPassword)
            .then((userCredential) => {
                sendVerifyEmail(userCredential);
            })
            .catch( (error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if(errorCode === 'auth/email-already-in-use'){
                    console.log('error1: ', errorCode + errorMessage);
                    Toast.show({ type: 'error', text1: 'Email này đã bị ai đó đăng ký!' });
                    console.log('Nếu không phải là bạn, hãy chọn Reset Password.');
                } else{
                    console.log('error2: ', errorCode + errorMessage);
                    Toast.show({ type: 'error', text1: errorMessage });
                }
            });
    }

    //LOGIN_BY_EMAIL
    const handleLoginAccountByUsernameAndPassword = async (e) => {
        const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(regexEmail.test(logEmail)) { //TH dang nhap = email
            signInWithEmailAndPassword(auth, logEmail, logPassword)
                .then(async (userCredential) => {
                    const { emailVerified } = userCredential.user;
                    if(emailVerified){
                        const { user: { uid } } = userCredential;
                        const UsersDocRef = doc(database, "Users", uid);
                        const UsersDocSnap = await getDoc(UsersDocRef);
                        setCurrentUser({...UsersDocSnap.data(), status: true});
                        // socket.emit("signIn", {...UsersDocSnap.data(), status: true});
                        navigation.navigate("HomepageScreen");
                    } else{
                        Toast.show({ type: 'error', text1: 'Tài khoản này chưa được xác thực', text2: 'Vui lòng chọn mục `Quên mật khẩu` để tái xác thực'});
                        return;
                    }
                })
                .catch( (error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorMessage);
                    if(errorCode === "auth/wrong-password"){
                        Toast.show({ type: 'error', text1: 'Sai mật khẩu' });
                    }
                    if(errorCode === "auth/user-not-found"){
                        Toast.show({ type: 'error', text1: 'Tài khoản chưa được đăng ký' });
                    }
                });
        } else {
            try {
                const q = query(collection(database, "Users"), where("phoneNumber", "==", logEmail));
                const querySnapShot = await getDocs(q);
                const emailUser = querySnapShot.docs[0].data().email;
                console.log(emailUser);
                signInWithEmailAndPassword(auth, emailUser, logPassword)
                .then(async (userCredential) => {
                    const { uid, emailVerified } = userCredential.user;
                    if(!emailVerified){
                        //Phát hiện tài khoản sdt chưa xác thực email...
                        console.log('Phát hiện, tài khoản bạn chưa xác thực email. Vui lòng cập nhật.');
                    }
                    const UsersDocRef = doc(database, "Users", uid);
                    const UsersDocSnap = await getDoc(UsersDocRef);
                    setCurrentUser({...UsersDocSnap.data(), status: true});
                    // socket.emit("signIn", {...UsersDocSnap.data(), status: true});
                    setTimeout(() => {
                        navigation.navigate("HomepageScreen");
                    }, 5000);
                })
                .catch( (error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorMessage);
                    if(errorCode === "auth/wrong-password"){
                        Toast.show({ type: 'error', text1: 'Sai mật khẩu' });
                    }
                    if(errorCode === "auth/user-not-found"){
                        Toast.show({ type: 'error', text1: 'Tài khoản chưa được đăng ký' });
                    }
                });
            } catch (error) {
                console.log(error.code);
                console.log(error.message);
                if(error.code === undefined) {
                    Toast.show({ type: 'error', text1: 'Tài khoản / sđt không tồn tại' });
                }
            }
        }
    };


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
                        <Button style={{marginTop: 20}} title="Đăng ký tài khoản" />
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
                : (componentToShow === "REGISTER_OTP_CONFIRM") ?
                <View style={{backgroundColor: 'white'}}>
                    <View style={{flexDirection: 'row',padding: 7}}>
                        <Pressable style={{width: '50%'}} onPress={() => setComponentToShow("LOGIN_BY_EMAIL")}>
                            <Text style={{borderColor:'grey',borderBottomWidth:1, textAlign: 'center'}}>ĐĂNG NHẬP</Text>
                        </Pressable>
                        <Text style={{borderColor:'black',borderBottomWidth:1,borderLeftWidth:1,width:'50%',textAlign:'center',fontWeight:'bold'}}>ĐĂNG KÝ</Text>
                    </View>
                    <Box mx='5'>
                        <HStack>
                            <MaterialCommunityIcons name="cellphone-message" size={24} />
                            <Input
                                w={{ base: '100%', md: '25%', lg: "100%" }}
                                InputLeftElement={
                                    <Icon as={<MaterialCommunityIcons name="cellphone-message" size={24} />} color="blue.900" />
                                }
                                size='md'
                                variant='underlined'
                                placeholder=' Nhập mã OTP gồm 6 chữ số...'
                                onChangeText={(e) => setRegOTP(e)} value={regOTP}
                            />
                        </HStack>
                        <Text>&emsp;</Text>
                        <Button style={{marginTop: 20}} title="Xác nhận" />
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