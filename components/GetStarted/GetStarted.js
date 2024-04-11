import { useState , useEffect } from "react";
import { Button, Image, Pressable, StyleSheet, Text, View , ActivityIndicator , ImageBackground } from "react-native";
import InputLocationModal from "../../modal/InputLocationModal";


export default function GetStarted({navigation,route}) {

   const [btnClicked,setBtnClicked] = useState(true);
   const [weatherData,setWeatherData] = useState(null);
   const [showLoader,setLoader] = useState(false);
   const [url,setWeatherUrl] = useState(require('../../assets/cloud.gif'));


    function openModalLocation() {
        setWeatherData(null);
        setLoader(false);
        navigation.navigate('MyModal')
    }


    function redirect() {
        navigation.navigate('WeatherHome',{
            weatherData : weatherData,
            title : weatherData.data.name
        })
    }
    


    useEffect(() => {
        if (route.params?.weatherData) {
          setBtnClicked(false);
          setLoader(true);

          setTimeout(() => {
            console.log(btnClicked)
            setWeatherData(route.params.weatherData);
            console.log(route.params.weatherData)
          },1500)
        
        }
      }, [route.params?.weatherData]);


      useEffect(() => {

        if(weatherData?.data?.weather[0].main === 'Clear'){
            setWeatherUrl(require('../../assets/sunny.gif'))
        } else if(weatherData?.data?.weather[0].main === 'Rain') {
            setWeatherUrl(require('../../assets/rainy.gif'))
        } else if(weatherData?.data?.weather[0].main === 'Snow') {
            setWeatherUrl(require('../../assets/snow.gif'))
        }

        setLoader(false);

    }, [weatherData])



   return (

    btnClicked ? ( 
      <View style={{alignItems:'center',justifyContent:'center',flex: 1}}>

        <Text style={[style.primaryColor, style.textPrimary]}>
           Welcome To
        </Text>

        <Text style={[style.primaryColor,style.textSecondary]}>
            Weather
        </Text>
        
        <Image source={require('../../assets/logo.png')} />
        
        <Pressable style={({pressed}) => pressed ? style.ripple : style.btnStyle} android_ripple={{ color: '#432d6a'}} onPressIn={() => setBtnClicked(true)} onPressOut={() => setBtnClicked(false)}  onPress={openModalLocation}>
            <View>
                <Text style={{color : btnClicked ? 'black' : 'white'}}>
                    Get Started
                </Text>
            </View>
        </Pressable>
    
     </View> ) : 
     
     weatherData ? (

    <View style={{alignItems:'center',justifyContent:'center',flex: 1, padding: 20}}>
        <Text style={[style.primaryColor, style.textPrimary]}>
            You Are In {weatherData.data.name}
        </Text>

        <Pressable style={({pressed}) => pressed ? style.ripple : style.btnStyle} android_ripple={{ color: '#432d6a'}} onPress={openModalLocation}>
            <View>
                <Text style={{color : btnClicked ? 'white' : 'black'}}>
                    Change Location
                </Text>
            </View>
        </Pressable>

        <Pressable style={style.card} onPress={redirect}>
        <ImageBackground  source={url} style={style.CardWeatherUI}>
            <View style={style.overlayCard}>
                <Text style={[style.primaryColorCity]}>
                    {weatherData.data.name}
                </Text>
                <Text style={[style.primaryColorTemp]}>
                    {Math.round(weatherData.data.main.temp  - 273.15)}° C
                </Text>
                <Text style={[style.primaryColorInfo]}>
                    {weatherData.data.weather[0].description}
                </Text>
                <View style={style.infoDegreeContainer}>
                    <Text style={[style.primaryColorInfoDegree]}>
                        H: {Math.round(weatherData.data.main.temp_max  - 273.15)}° C°
                    </Text>

                    <Text style={[style.primaryColorInfoDegree]}>
                        L: {Math.round(weatherData.data.main.temp_min  - 273.15)}° C°
                    </Text>

                </View>
            </View>
        </ImageBackground>
    </Pressable>

      
    </View>
    
) : showLoader ? (<ActivityIndicator size="large" color="#00ff00" style={style.loaderStyle} />) : <View></View>

   )
}

const style = StyleSheet.create({
    btnStyle : {
        backgroundColor : 'white',
        padding:10,
        marginTop:50,
        width:200,
        alignItems:'center',
        borderRadius:25
    },
    primaryColor: {
        color: 'white'
    },
    textPrimary : {
        fontSize: 40
    },
    textSecondary : {
        fontSize: 70
    },
    ripple : {
        backgroundColor: '#432d6a',
        padding:10,
        marginTop:50,
        width:200,
        alignItems:'center',
        borderRadius:25
    },
    card : {
        marginTop: 20,
        borderRadius:25,
        flex: 1,
        height: '100%',
        width:'100%',
        backgroundColor: 'rgba(83, 53, 100, 0.7)',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2},
        shadowRadius: 10,
        elevation: 8,
        alignItems: 'center',
    },
    primaryColorCity: {
        color: 'white',
        fontSize: 50,
        fontWeight:100,
        color: 'white',
        textAlignVertical:'center',
        textAlign:'center'
    },
    primaryColorTemp : {
        color: 'white',
        fontSize: 50,
        fontWeight:500,
        textAlignVertical:'center',
        textAlign:'center'  
    },
    primaryColorInfo : {
        color: 'white',
        fontSize: 20,
        fontWeight:500,
        textAlignVertical:'center',
        textAlign:'center',
        marginTop : 20  
    },
    infoDegreeContainer : {
        flexDirection: 'row',
        justifyContent:'space-between',
        marginTop : 20,
        width: '50%'
    },
    primaryColorInfoDegree:  {
        color: 'white',
        fontSize: 20,
        fontWeight:500,
        textAlignVertical:'center',
        textAlign:'center',
    } ,
    CardWeatherUI : {
        flex: 1,
        width :'100%',
        height: '100%',
        backgroundColor: 'rgba(83, 53, 100, 0.7)',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2},
        shadowRadius: 10,
        elevation: 8,
        borderRadius:25,
        overflow: 'hidden',
        justifyContent:'center',
        alignItems:'center'
    },
    overlayCard : {
        height: '100%',
        width:'100%',
        backgroundColor: 'rgba(83, 53, 100, 0.3)',
        justifyContent:'center',
        alignItems:'center'
    } ,
    loaderStyle : {
        marginTop : 20
    }

})