import React from 'react';
import { StyleSheet,AsyncStorage,Text, View,} from 'react-native';
import * as firebase from 'firebase';
import {Container, Form, Item, Label,Input,Button } from 'native-base';
import { Permissions, Notifications } from 'expo';
// Initialize Firebase
var config = {
  apiKey: "AIzaSyBAW343K4cGFG6LYlatWw3Vifm51hgWzus",
  authDomain: "reactfirebase-a3716.firebaseapp.com",
  databaseURL: "https://reactfirebase-a3716.firebaseio.com",
  projectId: "reactfirebase-a3716",
  storageBucket: "reactfirebase-a3716.appspot.com",
  messagingSenderId: "584878713627"
};

firebase.initializeApp(config);
const log =null;
export default class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = ({
        email: '',
        password: '',
        msgTitle:'',
        msgBoady:'',
        notification: {},
        status:'Plese login if you have all ready account...',
        color:'#516ed6',
        login:[],
        loginStatus:false,
        token:null,
    })
}


  componentDidMount() {
    this._retrive();
    log =this;
    registerForPushNotificationsAsync();

    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _retrive = async()=>{

        try{
         //  await AsyncStorage.removeItem('loginFlag');
            let v = await AsyncStorage.getItem('loginFlag');
            let token = await AsyncStorage.getItem('token');
            if(v != null && v === 'true' && token != null ){
                this.setState({loginStatus:true});
                this.setState({status:'Send Notification from here to all user......'});
                this.setState({color:'#52a315'});
                this.setState({token:token});
               
            }
        }
        catch(erro){
            console.log(error);
        }
  }

_store = async()=>{
    try{
        await AsyncStorage.setItem('loginFlag','true');
        this.setState({loginStatus:true});
        this.setState({status:'Send Notification from here to all user......'});
        this.setState({color:'#52a315'});
    }
    catch(error){
        console.log("During store ",error);
    }
}

_handleNotification = (notification) => {
  this.setState({notification: notification});
};

           //database connection 
  sendNotifaction = (title,msg,sql) =>{
        
            console.log(sql);
            fetch('https://3day.000webhostapp.com/Test/Test/notificationTest.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title,
                    msg:msg,
                    sql:sql,
                }) 
                })
        }
        

    
           //database connection 
  sendNotifactionTome = (title,msg,sql) =>{
        
    console.log(sql);
    fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {

          // " accept": "application/json",
         //  " accept-encoding": "gzip, deflate",
            "content-type": "application/json",
        },
        body:JSON.stringify( {
            to:this.state.token,
            sound: "default",
            body: this.state.msgBoady,
            title:this.state.msgTitle,
            badge: 1,
          })
        })
}


  render() {
      if(!this.state.loginStatus)
    return (
      <Container style={styles.container}>
          <Label style={{backgroundColor:this.state.color,padding:15,borderRadius:10}}>
              <Text style={{color:'#ffffff'}}>{this.state.status}</Text>
          </Label>
          <Form>
              <Item floatingLabel>
                  <Label>User ID</Label>
                  <Input
                      autoCorrect={false}
                      autoCapitalize="none"
                      onChangeText={(email) => this.setState({ email })}
                  />

              </Item>

              <Item floatingLabel>
                  <Label>Password</Label>
                  <Input
                      secureTextEntry={true}
                      autoCorrect={false}
                      autoCapitalize="none"
                      onChangeText={(password) => this.setState({ password })}
                  />
              </Item>

              <Button style={{ marginTop: 10 }}
                  full
                  rounded
                  success
                  onPress={() => loginUser(this.state.email, this.state.password)}
              >
                  <Text style={{ color: 'white' }}> Login</Text>
              </Button>

              <Button style={{ marginTop: 10 }}
                  full
                  rounded
                  primary
                  onPress={() => signUpUser(this.state.email, this.state.password)}
              >
                  <Text style={{ color: 'white' }}> Sign Up</Text>
              </Button>

          </Form>
      </Container>
  ); 
      else
  return(
    <Container style={styles.container}>
    <Label style={{backgroundColor:this.state.color,padding:15,borderRadius:10}}>
        <Text style={{color:'#ffffff'}}>{this.state.status}</Text>
    </Label>
    <Form>
        <Item floatingLabel>
            <Label>Title</Label>
            <Input
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(msgTitle) => this.setState({ msgTitle })}
            />

        </Item>

        <Item floatingLabel>
            <Label>Message</Label>
            <Input
                
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(msgBoady) => this.setState({ msgBoady })}
            />
        </Item>

        <Button style={{ marginTop: 10 }}
            full
            rounded
            success
            onPress={() => this.sendNotifaction(this.state.msgTitle, this.state.msgBoady,'SELECT token FROM `security_table`')}
        >
            <Text style={{ color: 'white' }}> Send </Text>
        </Button>

         <Button style={{ marginTop: 10 }}
            full
            rounded
            success
            onPress={() => this.sendNotifactionTome(this.state.msgTitle, this.state.msgBoady,'SELECT token FROM `security_table`')}
        >
            <Text style={{ color: 'white' }}> Send to Me</Text>
        </Button>

    </Form>
</Container>
  );

  }
}


const registerForPushNotificationsAsync = async(user,password)=> {
  
  const PUSH_ENDPOINT = 'https://3day.000webhostapp.com/run_query.php';

  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions 
  if (finalStatus !== 'granted') {
    return;
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();
            await AsyncStorage.setItem('token',token);
  // POST the token to your backend server from where you can retrieve it to send push notifications.
  let sql ="UPDATE `security_table` SET `token`='"+token+"' WHERE id='"+user+"' AND password ='"+password+"'";
  console.log("Squl send ",sql);
  return fetch(PUSH_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: sql,
  }) 
  }).then((response) => response.json())
      .then((responseJson) =>{
        console.log("in token set area ",responseJson);
      }).catch((error) =>{
        console.log("Error in notification ",error);
      });
}

  //login user
const loginUser =(email,password) =>{
  let sql = "SELECT userType FROM `security_table` WHERE  id ='"+email+"' AND password='"+password+"'";
  
  console.log(sql);

  fetch('https://3day.000webhostapp.com/run_query.php', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          query: sql,
      }) 
      }).then((response) => response.json())
          .then((responseJson) => {
              console.log("Insert into ",responseJson);
              log.setState({login:responseJson});
             
              if(log.state.login.length){
                registerForPushNotificationsAsync(email,password);
                log.setState({status:'You are Login sucessfully....'});
                log.setState({color:'#4fc442'});
                log._store();
                console.log('in if part');
              }else{
                log.setState({status:'You are not login retry....'});
                log.setState({color:'#e03a3a'});
                console.log('in else part');
              }
          }).catch((error) => {
            log.setState({status:'You are not login retry....'});
            log.setState({color:'#e03a3a'});
            console.log('in else part');
              alert("updated slow network");
              console.log(error);
          });

}

  //login user
const signUpUser =(email,password) =>{
    let sql = "INSERT INTO `security_table`(`password`, `userType`, `token`) VALUES ('"+password+"','"+email+"','rty')";
    
    
    console.log(sql);
    fetch('https://3day.000webhostapp.com/run_query.php', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: sql,
        }) 
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("Insert into ", responseJson);
               if(responseJson){
                    log.setState({status:'You are register sucessfully plese Login.... your user id '+responseJson});
                    log.setState({color:'#918f04'});
                    console.log('in if part');
                  }else{
                    log.setState({status:'Not register sucessfully plese retry....'});
                    log.setState({color :'#d63131'});
                    console.log('in else part');
                  }

            }).catch((error) => {
                alert("updated slow network");
                console.log(error);
            });
  
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10
},
});
