import TweenOne from 'rc-tween-one';
import BezierPlugin from 'rc-tween-one/lib/plugin/BezierPlugin';
import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import { getStreamUrl } from './config';
import { updateActiveMenu } from '../../redux/actions/app-actions';
import client from '../../feathers';


TweenOne.plugins.push(BezierPlugin);


const banner = 'hands-on-wheel.jpg'
const RECORDED_LIVE_LIMIT = 24;
const ads = '20-Car-Dealership-Promotion-Ideas.jpg'

const messageExpireTimeout = 60000;

/*
    this.props.item commented
    this.props.dealerSocketId
    this.props.user
*/


class LivePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        stream: null,
        // totalReactions: this.props.item.totalReactions,
        // numberOfCurrentlyConnectedClients: this.props.item.numberOfCurrentlyConnectedClients,
        // numberOfClientAndDealerMessages: this.props.item.numberOfClientAndDealerMessages,
        mirror:false
    }
  }

  _sendAnswerToClient = (data) => {
    const isTheSameId = data.dealerSocketId === this.props.dealerSocketId;
    
    if(!isTheSameId){
        return;
    }
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp))
    .catch(x => {
    })
  }
  
  _sendCandidateToClient = (data) => {
    const isTheSameId = data.dealerSocketId === this.props.dealerSocketId;
    
    if(!isTheSameId){
        return;
    }
    if(!!data.candidate){
        this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
        .catch(x => {
        })
    }
  }
  
  componentDidMount = () => {
    this.videoRef = React.createRef();
    //make a new socket
    // if (this.state.isLoggedIn) {
    //     var queryObj = {
    //       'customerName': displayName,
    //       customerDbId: this.props.userId,
    //       customerAvatar: this.props.userAvatar,
    //       isDetailsComponent: true
    //     };
    //   } else {
    //     var queryObj = {
    //       isDetailsComponent: true,
    //       'customerName': 'anonymous',
    //     };
    //   }
    //   this.activeSocket = io(
    //     streamUrl,
    //     {
    //       query: queryObj
    //     }
    //   );

    //this the one we currently use in the app witout details
      if (this.props.user.authenticated) {
        var queryObj = {
          'customerName': `${this.props.user.info.user.firstName || ''} ${this.props.user.info.user.lastName || ''}`,
          customerDbId: this.props.user.info.user._id,
          customerAvatar: this.props.user.info.user.avatar,
        };
      } else {
        var queryObj = {
          'customerName': 'anonymous',
          customerAvatar: "https://is4-ssl.mzstatic.com/image/thumb/Purple124/v4/fe/6f/1a/fe6f1a3a-9d14-cfdf-499c-222b7b842fb2/source/512x512bb.jpg"
        };
      }
  
      this.activeSocket = io(
        // client.io.io.uri,
        getStreamUrl(client.io.io.uri),
        {
          query: queryObj
        }
      );


    this.activeSocket.on('sendAnswerToClient', this._sendAnswerToClient);
    this.activeSocket.on('sendCandidateToClient', this._sendCandidateToClient);
  
    // this.activeSocket.on("newMessage", this._newMessage)
    // this.activeSocket.on("newReaction", this._newReaction)
    this.activeSocket.on("dealerCameraMirrorResponse", (data)=>{
      this.setState({mirror:!data.data})
    })
    
    this.setUpConnectionForDealerSocketId();
  }
  
  _newMessage = (data) => {
    //data.connectedUsers
    //data.numberOfClientAndDealerMessages
    this.setState({
        numberOfCurrentlyConnectedClients: data.connectedUsers,
        numberOfClientAndDealerMessages: data.numberOfClientAndDealerMessages
    })
  }
  
  _newReaction = (data) => {
    // console.log('newReaction',data);
    const totalReactions = data.reactionSummary.reduce((accumulator, currentValue) => accumulator + currentValue.total, 0);
    this.setState({
        totalReactions
    })
  }
  
  componentWillUnmount() {
      //the socket is shared so do not close it
      this.peerConnection && this.peerConnection.close();
      this.activeSocket.off('sendAnswerToClient', this._sendAnswerToClient);
      this.activeSocket.off('sendCandidateToClient', this._sendCandidateToClient);
      this.activeSocket.close();
      clearTimeout(this.timeoutHandler);
    //   this.activeSocket.off("newMessage", this._newMessage)
    //   this.activeSocket.off("newReaction", this._newReaction)
  }
  
  setUpConnectionForDealerSocketId(){
      this.setState({
          stream: null
      }, () => {
          // this.videoRef = null;
          // this.videoRef = React.createRef();
          this.peerConnection && this.peerConnection.close();
  
          const pc_config = {
              iceServers: [
                  
                  
                  {
                  urls : 'stun:stun.l.google.com:19302'
                  },
                  // {
                  //   urls: [ "stun:ss-turn2.xirsys.com" ]
                  // },
                  {
                  username: "K7RYJQ0iO86IzU-paa6guXxfLJ7vXWhFwfWzE3X88-LOsT0QN4vquwAUx1vsJJmqAAAAAF-yezBjY2FyMzEzMQ==",
                  credential: "a5e31b16-280d-11eb-89e3-0242ac140004",
                  urls: [
                      "turn:ss-turn2.xirsys.com:80?transport=udp",
                      "turn:ss-turn2.xirsys.com:3478?transport=udp",
                      "turn:ss-turn2.xirsys.com:80?transport=tcp",
                      "turn:ss-turn2.xirsys.com:3478?transport=tcp",
                      "turns:ss-turn2.xirsys.com:443?transport=tcp",
                      "turns:ss-turn2.xirsys.com:5349?transport=tcp"
                  ]
                  }
              ]
          }
      
            this.peerConnection =  new RTCPeerConnection(pc_config);
      
            this.peerConnection.onicecandidate = (e) => {
              if (e.candidate) {
                this.activeSocket.emit('clientSendsHisCandidates', {
                  candidate: e.candidate,
                })
              }
          }
          
              this.peerConnection.onaddstream = event => {
  
                  this.setState({
                      stream: event.stream
                  })
                //   this.videoRef.current.srcObject = event.stream
            
                
              }
  
          
          this.peerConnection.ontrack = event => {
  
             this.timeoutHandler = setTimeout(() => {
                    this.videoRef.current.srcObject = event.streams[0]
                  //this way it will be rerendered when the srcObject changes
                  this.setState({
                      remoteStream: event.stream
                  })
                  
              }, 1000);
          };
  
          this.peerConnection.createOffer({
              offerToReceiveVideo: 1,
              offerToReceiveAudio: 1
          })
          .then(sdp => {
              this.peerConnection.setLocalDescription(sdp);
              this.sendToPeer('clientRequestVideoWithDealerSocketId', { sdp, dealerSocketId: this.props.dealerSocketId });
          }).catch(x => {
              console.log(x);
              console.log('offer failed');
          });
      });
  
  }
  
  componentDidUpdate(prevProps, prevState) {
      const theDealerSocketIdHasChanged = prevProps.dealerSocketId !== this.props.dealerSocketId;
      if(theDealerSocketIdHasChanged){
          //if the dealer socket id has changed use the sane io connection but start a new peer connection
          this.setUpConnectionForDealerSocketId();
      }
  }
  
    sendToPeer = (messageType, payload) => {
      this.activeSocket.emit(messageType, {
        socketID: this.activeSocket.id,
        payload
      })
    }


  render() {
    
    //the video has not loaded...
    if(!this.state.stream){
      return (
        <div style={{backgroundColor: 'black', height: '100%', width: '100%'}}>
          <div style={{height: 500, backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <img style={{
                  objectFit: 'contain',
                  height: '50%',width: '50%',
                  // position: 'absolute', bottom: 20, left: "50%",
                  // transform: `translate(${x}px, ${y}px)` 
                  //  transform: `translateX(-50%)` 
                }}
                src={"/assets/ccarLive/logo.png"}
              />
            </div>
          </div>
        )
        return (
            <div style={{
                backgroundColor: 'black',
                // height: 300, width: 300
                justifyContent: 'center',
                alignItems:'center',
                display: 'flex'
            }}
            className='fill-parent absolute-center background-black'        

            >
                <img src={'https://is4-ssl.mzstatic.com/image/thumb/Purple124/v4/fe/6f/1a/fe6f1a3a-9d14-cfdf-499c-222b7b842fb2/source/512x512bb.jpg'} style={{ width: 100, height: 100, }} />
            </div>
        )
    } else {
        //there is a stream we show the video here...
        //create video ref...
        return (
          <video ref={this.videoRef} autoPlay muted={this.props.muted} className='fill-parent absolute-center background-white' style={{backgroundColor: 'black'}} />
        )
    }
    
  }

}

const mapStateToProps = state => ({
  app: state.app,
  user: state.user,
});

const mapDispatchToProps = {
  updateActiveMenu: updateActiveMenu,
}

export default connect(mapStateToProps, mapDispatchToProps)(LivePage);