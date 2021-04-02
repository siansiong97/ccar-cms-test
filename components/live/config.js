

import _ from 'lodash';
import { isValidNumber, toCamelCase, notEmptyLength, getTopItems  } from '../../common-function';


export const testStreamUrl = 'https://stream-uat2.ccar.my';
export const liveStreamUrl = 'https://stream.ccar.my';

export function getStreamUrl(url){

    let stream = testStreamUrl;
    if (url==='http://localhost:3030/'){stream = 'http://localhost:3030'}
    else if (url==='https://uat2-api.ccar.my/'){stream = testStreamUrl}
    else if (url==='https://api.ccar.my/'){stream = liveStreamUrl}
    else  {stream = 'http://localhost:3030'} //default testing
    
    // return 'http://192.168.0.191:7070/';
    // return "https://stream-uat2.ccar.my";
    // return 'http://localhost:7070/';
    // return 'http://192.168.0.149:3041/'
    return stream;
}


const gifts = [
    {
        name: 'kopi-ice',
        price: 10,
    },
    {
        name: 'white-rice',
        price: 10,
    },
    {
        name: 'roti-canai',
        price: 20,
    },
    {
        name: 'nasi-lemak',
        price: 20,
    },
    {
        name: 'nasi-kandar',
        price: 50,
    },
    {
        name: 'ramly-burger',
        price: 50,
    },
    {
        name: 'dimsum',
        price: 100,
    },
    {
        name: 'biryani',
        price: 100,
    },
];
export const defaultReactions = ['like', 'heart', 'laughing', 'crying', 'angry', 'sleeping', 'rollingEye'];
export const defaultReactionsAnimation = ['none', 'least', 'less', 'normal', 'more', 'most'];


let temp = {};
_.forEach(defaultReactions, function (react) {
    temp[`${react}Gif`] = `/assets/live/${react}.gif`;
})

export const reactionGif = temp;


temp = [];
temp = _.map(gifts, function (gift) {
    gift.icon = `/assets/live/${gift.name}.png`;
    gift.name = toCamelCase(gift.name, '-');
    return gift;
})
export const defaultGifts = temp;

export const liveIcon = '/assets/live/live.png';
export const supportIcon = '/assets/live/support.png';
export const likeIcon = '/assets/live/like.png';
export const commentIcon = '/assets/live/comment.png';
export const shareIcon = '/assets/live/share.png';
export const giftGif = '/assets/live/gift.gif';
export const ccoinIcon = '/assets/live/ccoin.png';


export const reactionAnimationTransitions = generateRandomTransition(30, 400, 4, 4);

export const LIVE_TEXT_TEMPLATE = {
    'client-joined': 'has joined',
    'client-left': 'has left',
    'client-text': '', 
    'dealer-text': '',
    "anonymous-joined": 'has joined',
    "anonymous-left":'has left',
  }

export function generateRandomTransition(maxTransitionX, maxTransitionY, eachTransitionLength, group) {

    let reactionAnimationTransitionsTemp = [];
    let eachTransition = [];

    if (!isValidNumber(maxTransitionX)) {
        maxTransitionX = 30;
    } else {
        maxTransitionX = parseInt(maxTransitionX);
    }

    if (!isValidNumber(maxTransitionY)) {
        maxTransitionY = 400;
    } else {
        maxTransitionY = parseInt(maxTransitionY);
    }

    if (!isValidNumber(eachTransitionLength) || parseInt(eachTransitionLength) < 4) {
        eachTransitionLength = 4;
    } else {
        eachTransitionLength = parseInt(eachTransitionLength);
    }

    if (!isValidNumber(group) || parseInt(group) < 0) {
        group = 0;
    } else {
        group = parseInt(group);
    }

    _.forEach(_.range(group), function (index) {
        eachTransition.push({ x: 0, y: 0 });
        _.forEach(_.range(eachTransitionLength - 2), function (index1) {
            eachTransition.push({ x: _.random(-maxTransitionX, maxTransitionX, false), y: -(maxTransitionY / (eachTransitionLength - index1)) });
        })
        eachTransition.push({ x: 0, y: -maxTransitionY });
        reactionAnimationTransitionsTemp.push(eachTransition);
        eachTransition = [];
    })

    return reactionAnimationTransitionsTemp;
}


export function getTotalReactions(reactions) {


    if (_.isArray(reactions) && notEmptyLength(reactions)) {
        let total = 0;
        _.forEach(reactions, function (reaction) {
            if (!_.isNaN(parseInt(reaction.total))) {
                total += parseInt(reaction.total);
            }
        })

        return total;
    } else {
        return 0;
    }
}

export function getTopReactions(reactions, rank) {

    if (_.isArray(reactions) && notEmptyLength(reactions)) {
        if (!isValidNumber(rank)) {
            rank = 3;
        } else {
            rank = parseInt(rank);
        }

        //filter out reaction not in list
        let filteredData = _.compact(_.map(reactions, function (reaction) {
            if (_.indexOf(defaultReactions, reaction.type) != -1 && isValidNumber(reaction.total)) {
                return reaction;
            } else {
                return null;
            }
        }));

        //get top reactions
        filteredData = getTopItems(filteredData, rank, 'total');
        return filteredData;
    } else {
        return 0;
    }
}

export function createOffer(socket, broadcaster) {

    if (!!broadcaster && !!socket) {

        const pc_config = {
            iceServers: [{
              urls: [ "stun:ss-turn2.xirsys.com" ]
              }, {
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
           }]
          }

        broadcaster.peerConnection = new RTCPeerConnection(pc_config)

        broadcaster.peerConnection.createOffer({
            offerToReceiveVideo: 1,
            //for audio
            offerToReceiveAudio: 1
        })
            .then(sdp => {
                broadcaster.peerConnection.setLocalDescription(sdp);
 
                sendToPeer(socket, 'clientRequestVideoWithDealerSocketId', { sdp, dealerSocketId: broadcaster.dealerSocketId });
                return broadcaster;
            }).catch(x => {
 
                console.log('offer failed');
                return null;
            });

    } else {
        return null;
    }
}

export function sendToPeer(socket, messageType, payload) {

    if (!!socket) {
        socket.emit(messageType, {
            senderId: socket.id,
            payload
        })
    }
}

export function closeThePeerConnection(socket, peerConnection, previousDealerSocketId) {
    if (!!peerConnection && !!socket && !!previousDealerSocketId) {
        peerConnection.close();
        socket.emit('closeClientSocket', previousDealerSocketId);
    }
}

export function syncReactionSummary(reactionLogs) {
    let reactionSummary = _.map(defaultReactions, function (reaction) {
        return {
            type: reaction,
            total: 0,
        }
    });
    if (_.isArray(reactionLogs) && notEmptyLength(reactionLogs)) {
        reactionSummary = _.map(reactionSummary, function (summary) {

            let logs = _.filter(reactionLogs, ['type', summary.type]);
            let total = 0;
            _.forEach(logs, function (log) {
                total += log.total;
            })

            return {
                type: summary.type,
                total: total,
            }
        })
    }

    return reactionSummary;
}
