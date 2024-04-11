import axios from "axios";
import { useState , useEffect} from "react";
import { Button, Image, ImageBackground, Pressable, StyleSheet, Text, View , ActivityIndicator, FlatList, ScrollView } from "react-native";


export default function WeatherInfoHome({navigation, route}) {

  const [weatherData,setWeatherData] = useState(null);
  const [showLoader,setLoader] = useState(true);
  const [hourlyData,sethourlyData] = useState(null);
    
  useEffect(() => {
    if (route.params?.weatherData) {
      setTimeout(() => {
        setWeatherData(route.params.weatherData);
      },1500)
    
    }
  }, [route.params?.weatherData]);


  useEffect(() => {

    if(weatherData !== null) {
      setLoader(false);
      console.log('data' , weatherData.data.coord);

      const fetchData = async () =>{
        var url = `https://openweathermap.org/data/2.5/onecall?lat=${weatherData.data.coord.lat}&lon=${weatherData.data.coord.lon}&units=metric&appid=439d4b804bc8187953eb36d2a8c26a02`;
        console.log(url)
        try {
          const data = await axios.get(url);
          sethourlyData(data.data.hourly);
        } catch (error) {
          console.error(error.message);
        }
      
      }

      fetchData();

    }

  }, [weatherData])


  useEffect(() => {
    if(hourlyData !== null) {
      console.log(hourlyData[0].weather)
    }
  },[hourlyData])

   return (

     <View style={style.container}>
      <ImageBackground source={require('../../assets/default.gif')} style={{flex: 1 }}>
          {showLoader ? (<ActivityIndicator size="large" color="#00ff00" style={style.loaderStyle} /> ) : (
              <>
              <View style={{alignItems : 'center', marginTop : 30}}>
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
            
            <View style={style.hourlyContainer}>
              <Text style={[style.primaryColorTemp, {marginBottom : 20}]}>
                  Hourly Forecast
              </Text>
              <FlatList 
                  data={hourlyData}
                  renderItem={(itemData) => {

                    let url = require('../../assets/cloud.gif');

                    if(itemData.item.weather[0].main === 'Clear'){
                     url = require('../../assets/sunny.gif')
                    } else if(itemData.item.weather[0].mai === 'Rain') {
                      url = require('../../assets/rainy.gif')
                    } else if(itemData.item.weather[0].main === 'Snow') {
                      url = require('../../assets/snow.gif')
                    }

                    return (
                      <ImageBackground style={style.horulyCard} source={url}>
                        <Pressable style={style.overlayCard}>
                          <View>

                            <Text style={[style.primaryColorCity]}>
                              {new Date(itemData.item.dt).toLocaleTimeString()}
                            </Text>

                            <Text style={[style.primaryColorTemp, {marginTop : 0}]}>
                              {Math.round(itemData.item.temp)}° C
                            </Text>

                            <Text style={[style.primaryColorInfo, {marginBottom : 20}]}>
                              {itemData.item.weather[0].description}
                            </Text>

                          </View>
                        </Pressable>
                      </ImageBackground>
                    )
                  }}


      

                  keyExtractor={(item,index) => {
                    return index

                  }}

                  

    
                
                />
  
            </View>
            </>
            
          )}
      </ImageBackground>
        
     </View>
   )
}

const style = StyleSheet.create({
    container : {
      backgroundColor : '#011f4b',
      height: '100%',
      justifyContent: 'flex-start',
      flex : 1
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
      marginTop : 40,
      width: '50%'
  },
  primaryColorInfoDegree:  {
      color: 'white',
      fontSize: 20,
      fontWeight:500,
      textAlignVertical:'center',
      textAlign:'center',
  } ,

  loaderStyle : {
    flex : 1
  },
  hourlyContainer : {
    padding: 20,
    marginTop : 20,
    height: '100%',
    backgroundColor: 'rgba(83, 53, 100, 0.7)',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2},
    shadowRadius: 10,
    elevation: 8,
    borderRadius:25,
  }, 

  horulyCard : {
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
    alignItems:'center',
    marginBottom : 20
  },
  overlayCard : {
    height: '100%',
    width:'100%',
    backgroundColor: 'rgba(83, 53, 100, 0.3)',
    justifyContent:'center',
    alignItems:'center'
}

})