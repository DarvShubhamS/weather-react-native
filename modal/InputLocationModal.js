import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Image, ImageBackground, Modal, Pressable, StyleSheet, Text, TextInput, View , ToastAndroid , Platform, FlatList, ActivityIndicator } from "react-native";
import * as Location from 'expo-location'

export default function InputLocationModal(props) {
   
    const [searchString, setSearchStribng] = useState('');
    const [searchList,setSearchList] = useState([]);
    const [weatherData,setWeatherData] = useState(null);
    const [showCard,setCardView] = useState(false);
    const [showLoaderSearch,setLoaderSearch] = useState(false);
    const [showLoader,setLoader] = useState(false);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [showUserInput,SetshowUserInput] = useState(true);
    const [redirection,setRedirection] = useState(false);
    const apiKey = process.env.EXPO_PUBLIC_API_KEY;
    console.log(apiKey)

   

    function setSearchText(val) {
        if(val) {
            setSearchStribng(val);
        } else {
            setWeatherData(null);
            setCardView(false);
        }
    }

    async function fetchList() {
       setLoaderSearch(true); 
       if(searchString) {
        var url = `http://api.openweathermap.org/geo/1.0/direct?q=${searchString}&limit=5&appid=${apiKey}` 
        const data = await axios.get(url)
        var dataEdited = data.data;
        setSearchList(dataEdited);
        setLoaderSearch(false); 
        // console.log(dataEdited)
       } else {
        setLoaderSearch(false); 
        if (Platform.OS === 'android') {
            var msg = 'city cannot be empty , please enter city'
            ToastAndroid.show(msg, ToastAndroid.SHORT)
          } else {
            AlertIOS.alert(msg);
          }
       } 
    }


    async function setWeatherInfo(data) {
        setLoader(true);
        await getWeatherInfo(data).then((data) => {
            console.log(data)
            setWeatherData({
              data : data  
            });

            SetshowUserInput(false);
            setSearchList('');
            
        })
    }


    useEffect(() => {

        setLoader(false);

        if(searchString) {
            redirect();
        }

    }, [weatherData])

    async function getWeatherInfo(data) {

      console.log(data)  
  
      const url =  `https://api.openweathermap.org/data/2.5/weather?lat=${data[0]}&lon=${data[1]}&limit=5&appid=${apiKey}`;
      
      console.log(url) 

      const resp = await axios.get(url);

      return resp.data;

    }


    async function getLocation() {
        let { status } = await Location.requestForegroundPermissionsAsync();

        console.log(status);
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        } else {
            let location = await Location.getLastKnownPositionAsync({});
            setLocation(location);
        }

    }


    useEffect(() => {
        if(location && location.coords) {
            var lat = location.coords.latitude;
            var long = location.coords.longitude;
            setWeatherInfo([lat,long,true])
        }
    }, [location])


    function redirect() {
        setRedirection(true)
        props.navigation.navigate('Home',{
            weatherData : weatherData
        })
    }


    return (

        <Modal animationType='slide' style={{flex:1}}>

            {redirection ? (<View style={style.modalContainer}><ActivityIndicator size="large" color="#00ff00" style={style.loaderStyle} /></View>) : (
                            <View style={style.modalContainer}>
                            <ImageBackground source={require('../assets/backDrop.jpeg')} style={{flex: 1, padding:20 }}>
                                <View>
                                    <Pressable style={style.backBtnContainer}>
                                        {/* <Image style={style.backBtn} source={require('../assets/chevron-left-solid.png')}/> */}
                                        <Text style={[style.primaryColor]}>
                                            Weather
                                        </Text>
                                    </Pressable>
                        
                                </View>
                
                                <TextInput style={style.searchBox} placeholder="🔍 Search for a city" placeholderTextColor="#79739a" onChangeText={setSearchText}/>
            
                                {showUserInput ? (
                                    <View>
                                        <Pressable style={style.BtnContainerParent} onPress={fetchList}>
                                            <View style={style.BtnContainer}>
                                                <Text>
                                                    Search
                                                </Text>
                                            </View>
                                        </Pressable>
            
                                        <Text style={{color:'white', marginTop:10, textAlign:'center'}}>
                                        or Get Current location on Map
                                        </Text>
            
                                        <Pressable style={style.BtnContainerParent} onPress={getLocation}>
                                            <View style={style.BtnContainer}>
                                                <Text>
                                                    Select Location
                                                </Text>
                                            </View>
                                        </Pressable>
                                    </View>
                                ) : (
                                    <Pressable style={style.BtnContainerParent} onPress={() => {SetshowUserInput(true);setWeatherData(null)}}>
                                        <View style={style.BtnContainer}>
                                            <Text>
                                                Clear Data
                                            </Text>
                                        </View>
                                    </Pressable>
                                )}
                
            
                          
                                {searchList.length > 0 && !weatherData && !showLoader ? (
            
                                    <>
            
                    
                                     <FlatList 
                                     data={searchList}
                                     renderItem={(itemData) => {
                                       return (
                                     
                                         <Pressable style={style.card} onPress={setWeatherInfo.bind(this,[itemData.item.lat,itemData.item.lon])}>
                                             <View>
                                                 <Text style={[style.primaryColor]}>{itemData.item.name}, {itemData.item.country}</Text>
                                             </View>
                                         </Pressable> 
                                       )
                                     }}
                                     keyExtractor={(item,index) => {
                                         return index
                                     }}
                                 /> 
            
                                </>
                                ) : weatherData ? (
                                    <Text style={{color:'white', marginTop:10}}>
                                        Info : Tap on Below Card To see detailed Info
                                    </Text>
                                    ) : showLoaderSearch ? ( <ActivityIndicator size="large" color="#00ff00" style={style.loaderStyle} />) :  (<Text style={{color:'white', marginTop:10}}>
                                            Select Location Below To Get Started :
                                        </Text>
                                    )
                                }
                                
                                {weatherData && !searchString ? (<Pressable style={style.cardLiveLocation} onPress={redirect}>
                                    <View>
                                        <Text style={[style.primaryColor]}>{weatherData.data.name}</Text>
                                     </View>
                                </Pressable>) : showLoader ? (<ActivityIndicator size="large" color="#00ff00" style={style.loaderStyle} />) : <View></View>}
            
                                
                            </ImageBackground>
                           
                        </View>
            )}

        </Modal>
    )
}

const style = StyleSheet.create({
    modalContainer : {
        backgroundColor : '#011f4b',
        height: '100%',
        justifyContent: 'flex-start',
        flex : 1
    },
      primaryColor: {
        color: 'white',
        fontSize:40
    },
    backBtn : {
       width: 50,
       height:50
    },
    backBtnContainer : {
     marginTop:20,  
     flexDirection: 'row',
     height:80,
     alignItems:'center'
    },
    BtnContainerParent : {
        justifyContent:'flex-end',
        alignItems:'center',
    },
    BtnContainer : {
      marginTop:20,  
      alignItems:'center',
      backgroundColor: 'white',
      padding:10,
      borderRadius:25,
      width:'100%'
    },
    searchBox: {
        marginTop:20,
        borderRadius: 20,
        padding:15,
        borderWidth:10,
        borderColor: '#2a264f',
        backgroundColor: '#312d5c',
        fontSize:20,
        color:'white'
    },
    card : {
        marginTop: 20,
        borderRadius:25,
        flex: 1,
        flexBasis:'auto',
        height: 'auto',
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
    } ,
    cardLiveLocation : {
        height :60,
        marginTop:20,
        backgroundColor: 'rgba(83, 53, 100, 0.7)',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2},
        shadowRadius: 10,
        elevation: 8,
        alignItems: 'center',
        borderRadius:25
    }

})