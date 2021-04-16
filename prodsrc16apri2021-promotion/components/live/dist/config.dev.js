"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateRandomTransition = generateRandomTransition;
exports.getTotalReactions = getTotalReactions;
exports.getTopReactions = getTopReactions;
exports.createOffer = createOffer;
exports.sendToPeer = sendToPeer;
exports.closeThePeerConnection = closeThePeerConnection;
exports.syncReactionSummary = syncReactionSummary;
exports.LIVE_TEXT_TEMPLATE = exports.reactionAnimationTransitions = exports.ccoinIcon = exports.giftGif = exports.shareIcon = exports.commentIcon = exports.likeIcon = exports.supportIcon = exports.liveIcon = exports.defaultGifts = exports.reactionGif = exports.defaultReactionsAnimation = exports.defaultReactions = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _commonFunction = require("../profile/common-function");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var gifts = [{
  name: 'kopi-ice',
  price: 10
}, {
  name: 'white-rice',
  price: 10
}, {
  name: 'roti-canai',
  price: 20
}, {
  name: 'nasi-lemak',
  price: 20
}, {
  name: 'nasi-kandar',
  price: 50
}, {
  name: 'ramly-burger',
  price: 50
}, {
  name: 'dimsum',
  price: 100
}, {
  name: 'biryani',
  price: 100
}];
var defaultReactions = ['like', 'heart', 'laughing', 'crying', 'angry', 'sleeping', 'rollingEye'];
exports.defaultReactions = defaultReactions;
var defaultReactionsAnimation = ['none', 'least', 'less', 'normal', 'more', 'most'];
exports.defaultReactionsAnimation = defaultReactionsAnimation;
var temp = {};

_lodash["default"].forEach(defaultReactions, function (react) {
  temp["".concat(react, "Gif")] = "/assets/live/".concat(react, ".gif");
});

var reactionGif = temp;
exports.reactionGif = reactionGif;
temp = [];
temp = _lodash["default"].map(gifts, function (gift) {
  gift.icon = "/assets/live/".concat(gift.name, ".png");
  gift.name = (0, _commonFunction.toCamelCase)(gift.name, '-');
  return gift;
});
var defaultGifts = temp;
exports.defaultGifts = defaultGifts;
var liveIcon = '/assets/live/live.png';
exports.liveIcon = liveIcon;
var supportIcon = '/assets/live/support.png';
exports.supportIcon = supportIcon;
var likeIcon = '/assets/live/like.png';
exports.likeIcon = likeIcon;
var commentIcon = '/assets/live/comment.png';
exports.commentIcon = commentIcon;
var shareIcon = '/assets/live/share.png';
exports.shareIcon = shareIcon;
var giftGif = '/assets/live/gift.gif';
exports.giftGif = giftGif;
var ccoinIcon = '/assets/live/ccoin.png';
exports.ccoinIcon = ccoinIcon;
var reactionAnimationTransitions = generateRandomTransition(30, 400, 4, 4);
exports.reactionAnimationTransitions = reactionAnimationTransitions;
var LIVE_TEXT_TEMPLATE = {
  'client-joined': 'have joined',
  'client-left': 'have left',
  'client-text': '',
  'dealer-text': ''
};
exports.LIVE_TEXT_TEMPLATE = LIVE_TEXT_TEMPLATE;

function generateRandomTransition(maxTransitionX, maxTransitionY, eachTransitionLength, group) {
  var reactionAnimationTransitionsTemp = [];
  var eachTransition = [];

  if (!(0, _commonFunction.isValidNumber)(maxTransitionX)) {
    maxTransitionX = 30;
  } else {
    maxTransitionX = parseInt(maxTransitionX);
  }

  if (!(0, _commonFunction.isValidNumber)(maxTransitionY)) {
    maxTransitionY = 400;
  } else {
    maxTransitionY = parseInt(maxTransitionY);
  }

  if (!(0, _commonFunction.isValidNumber)(eachTransitionLength) || parseInt(eachTransitionLength) < 4) {
    eachTransitionLength = 4;
  } else {
    eachTransitionLength = parseInt(eachTransitionLength);
  }

  if (!(0, _commonFunction.isValidNumber)(group) || parseInt(group) < 0) {
    group = 0;
  } else {
    group = parseInt(group);
  }

  _lodash["default"].forEach(_lodash["default"].range(group), function (index) {
    eachTransition.push({
      x: 0,
      y: 0
    });

    _lodash["default"].forEach(_lodash["default"].range(eachTransitionLength - 2), function (index1) {
      eachTransition.push({
        x: _lodash["default"].random(-maxTransitionX, maxTransitionX, false),
        y: -(maxTransitionY / (eachTransitionLength - index1))
      });
    });

    eachTransition.push({
      x: 0,
      y: -maxTransitionY
    });
    reactionAnimationTransitionsTemp.push(eachTransition);
    eachTransition = [];
  });

  return reactionAnimationTransitionsTemp;
}

function getTotalReactions(reactions) {
  if (_lodash["default"].isArray(reactions) && (0, _commonFunction.notEmptyLength)(reactions)) {
    var total = 0;

    _lodash["default"].forEach(reactions, function (reaction) {
      if (!_lodash["default"].isNaN(parseInt(reaction.total))) {
        total += parseInt(reaction.total);
      }
    });

    return total;
  } else {
    return 0;
  }
}

function getTopReactions(reactions, rank) {
  if (_lodash["default"].isArray(reactions) && (0, _commonFunction.notEmptyLength)(reactions)) {
    if (!(0, _commonFunction.isValidNumber)(rank)) {
      rank = 3;
    } else {
      rank = parseInt(rank);
    } //filter out reaction not in list


    var filteredData = _lodash["default"].compact(_lodash["default"].map(reactions, function (reaction) {
      if (_lodash["default"].indexOf(defaultReactions, reaction.type) != -1 && (0, _commonFunction.isValidNumber)(reaction.total)) {
        return reaction;
      } else {
        return null;
      }
    })); //get top reactions


    filteredData = (0, _commonFunction.getTopItems)(filteredData, rank, 'total');
    return filteredData;
  } else {
    return 0;
  }
}

function createOffer(socket, broadcaster) {
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
    broadcaster.peerConnection = new RTCPeerConnection(pc_config);
    broadcaster.peerConnection.createOffer({
      offerToReceiveVideo: 1,
      //for audio
      offerToReceiveAudio: 1
    }).then(function (sdp) {
      broadcaster.peerConnection.setLocalDescription(sdp);
      sendToPeer(socket, 'clientRequestVideoWithDealerSocketId', {
        sdp: sdp,
        dealerSocketId: broadcaster.dealerSocketId
      });
      return broadcaster;
    })["catch"](function (x) {
      console.log('offer failed');
      return null;
    });
  } else {
    return null;
  }
}

function sendToPeer(socket, messageType, payload) {
  if (!!socket) {
    socket.emit(messageType, {
      senderId: socket.id,
      payload: payload
    });
  }
}

function closeThePeerConnection(socket, peerConnection, previousDealerSocketId) {
  if (!!peerConnection && !!socket && !!previousDealerSocketId) {
    peerConnection.close();
    socket.emit('closeClientSocket', previousDealerSocketId);
  }
}

function syncReactionSummary(reactionLogs) {
  var reactionSummary = _lodash["default"].map(defaultReactions, function (reaction) {
    return {
      type: reaction,
      total: 0
    };
  });

  if (_lodash["default"].isArray(reactionLogs) && (0, _commonFunction.notEmptyLength)(reactionLogs)) {
    reactionSummary = _lodash["default"].map(reactionSummary, function (summary) {
      var logs = _lodash["default"].filter(reactionLogs, ['type', summary.type]);

      var total = 0;

      _lodash["default"].forEach(logs, function (log) {
        total += log.total;
      });

      return {
        type: summary.type,
        total: total
      };
    });
  }

  return reactionSummary;
}