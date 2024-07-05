import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-paper';

import { createNewUser } from '../apis/authApi'
import SubmitButton from '../ui/SubmitButton'

function Signup() {
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation()

    // console.log(formData);

    async function signupSubmitHandler() {
        setLoading(true)
        try {
          const user = await createNewUser(formData)
        //   console.log(user); 

          if (user) {
            Alert.alert(user.message)
            navigation.navigate('Login')
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
                label="Username"
                value={formData.username}
                onChangeText={value => setFormData({ ...formData, username: value })}
            />
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
            <SubmitButton loading={loading} onPress={signupSubmitHandler}>Submit</SubmitButton>
            <View style={{ flexDirection: 'row' }}>
                <Text>Already have an account ? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    </>
}

export default Signup