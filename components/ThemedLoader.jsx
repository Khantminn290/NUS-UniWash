import { ActivityIndicator, useColorScheme, View } from 'react-native'

const ThemedLoader = () => {
    return  (
        <View style = {{flex: 1, 
      justifyContent: "center", 
      alignItems: "center" 
    }}>
        <ActivityIndicator size='large' color = "black" />
        </View>
    )
}

export default ThemedLoader;