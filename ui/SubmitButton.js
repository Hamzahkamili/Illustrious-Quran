import React from 'react'
// import { Text, TouchableOpacity } from 'react-native'
import { Button } from 'react-native-paper';

function SubmitButton({children, onPress, loading}) {
  return <>
    {/* <TouchableOpacity onPress={onPress}>
        <Text>{children}</Text>
    </TouchableOpacity> */}
    <Button style={{borderRadius: 0}} mode="contained" buttonColor="#795547" loading={loading} disabled={loading} onPress={onPress}>
       {children}
    </Button>
  </>
}

export default SubmitButton
