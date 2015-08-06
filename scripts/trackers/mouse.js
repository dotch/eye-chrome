function MouseTracker(ctrl) {
  if (ctrl.initialized) {
    document.addEventListener('mousemove', function(e) {
      var y = e.pageY;
      var x = e.pageX;
      ctrl.handlePosition(x, y);
    });
  }
}