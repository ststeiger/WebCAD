function coalesce() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var len = args.length;
    for (var i = 0; i < len; i++) {
        if (args[i] !== null && args[i] !== undefined) {
            return args[i];
        }
    }
    return null;
}
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
var pc = new RTCPeerConnection({ iceServers: [] }), noop = function () {
};
pc.createDataChannel("");
pc.createOffer(pc.setLocalDescription.bind(pc), noop);
pc.onicecandidate = function (ice) {
    if (!ice || !ice.candidate || !ice.candidate.candidate)
        return;
    var myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
    console.log('my IP: ', myIP);
    pc.onicecandidate = noop;
};
