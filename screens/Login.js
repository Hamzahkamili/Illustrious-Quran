import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from "react-redux"

import { loginUser } from '../apis/authApi'
import SubmitButton from '../ui/SubmitButton'
import { addUserToken } from '../store/authSlice'

function Login() {
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation()
    const dispatch = useDispatch()

    // console.log(formData);

    async function loginSubmitHandler() {
        setLoading(true)
        try {
            const user = await loginUser(formData)
            //   console.log(user);  

            if (user) {
                dispatch(addUserToken({ token: user.token, user: user.data}))
                Alert.alert(user.message)
                navigation.navigate('Profile')
            }

        } catch (error) {
            // console.log(error);
            Alert.alert(error.message)
        }
        setLoading(false)
    }

    return <>
        <View style={{ padding: 10, rowGap: 15 }}>
            <TextInput
                mode="outlined"
                label="Email"
                value={formData.email}
                onChangeText={value => setFormData({ ...formData, email: value })}
            />
            <TextInput
                mode="outlined"
                label="Password"
                value={formData.password}
                onChangeText={value => setFormData({ ...formData, password: value })}
            />
            <SubmitButton loading={loading} onPress={loginSubmitHandler}>Submit</SubmitButton>
            <View style={{ flexDirection: 'row' }}>
                <Text>Dont have an account ? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text>Signup</Text>
                </TouchableOpacity>
            </View>
        </View>
    </>
}

export default Login