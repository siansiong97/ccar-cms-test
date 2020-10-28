import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';

const socket = io('http://localhost:3030/');   // local/
// const socket = io('https://uat2-api.ccar.my/');  //uat
// const socket = io('https://api.ccar.my/');   // live
 
const client = feathers();

client.configure(socketio(socket),{pingTimeOut:60000});
client.configure(authentication({
  // storage: window.localStorage
}));

export default client;
