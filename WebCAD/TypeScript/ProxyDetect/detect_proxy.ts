
// declare global {

    // lib.dom.d.ts
    interface RTCPeerConnection
    {
        // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection
        // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer
        createOffer(success:RTCSessionDescriptionCallback, failure: RTCPeerConnectionErrorCallback, options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit>;
    }

    interface Window
    {
        RTCPeerConnection: RTCPeerConnection;
        mozRTCPeerConnection: RTCPeerConnection;
        webkitRTCPeerConnection: RTCPeerConnection;
    }
    
// }




window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;   //compatibility for firefox and chrome
var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};
pc.createDataChannel("");    // create a bogus data channel

pc.createOffer(pc.setLocalDescription.bind(pc), noop);    // create offer and set local description
pc.onicecandidate = function(ice){  // listen for candidate events
    if(!ice || !ice.candidate || !ice.candidate.candidate)  return;
    var myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
    console.log('my IP: ', myIP);
    pc.onicecandidate = noop;
};

// window.RTCPeerConnection = null;
