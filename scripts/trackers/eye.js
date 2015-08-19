function EyeTracker(ctrl) {

  function screenToPage(x, y) {
    if (x < window.screenX ||
      x > window.screenX + window.outerWidth ||
      y < window.screenY ||
      y > window.screenY + window.outerHeight) {
      return null;
    }

    // get URL bar and browser chrome height
    var barHeight = window.outerHeight - window.innerHeight;

    // get vertical scroll offset
    var scrollOffsetY = window.pageYOffset;
    var scrollOffsetX = window.pageXOffset;

    return {
      x: x - window.screenX + scrollOffsetX,
      y: y - window.screenY - barHeight + scrollOffsetY
    }
  }

  if (ctrl.initialized) {
    var socket = io.connect('http://localhost:8080');
    console.log('connected to websocket');
    socket.on('frame', function (data) {
      //console.log('frame');
      if (!data.avg.x && !data.avg.y) { return; }
      var pos = screenToPage(data.avg.x, data.avg.y);
      if (!pos) { return; }
      ctrl.handlePosition(pos.x, pos.y);
    });
  }
}