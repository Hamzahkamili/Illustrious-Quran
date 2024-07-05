import React from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../store/authSlice";

const Profile = () => {
  const isAthenticated = useSelector(state => state.auth.isAthenticated)
  const user = useSelector(state => state.auth.user)
  const navigation = useNavigation();
  const dispatch = useDispatch()

  if (isAthenticated) {
    return (
      <View style={styles.center}>
        <Text>{user.username}</Text>
        <Text>{user.email}</Text>
        <Button title="Logout" onPress={() => dispatch(logout())} />
      </View>
    )
  }
  return (
    <View style={styles.center}>
      <Text>User not logged in</Text>
      <Button title="Login" onPress={() => navigation.navigate('Login')} />
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  }
})

export default Profile;