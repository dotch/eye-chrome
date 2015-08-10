//Dom Elements
var button = document.querySelector('#save');
var eyePositionCheckbox = document.querySelector('#show-eye-pos');
var mouseCheckbox = document.querySelector('#use-mouse');
var indicator = document.querySelector('#indicator');

button.addEventListener('click', save);

function save() {
  var showEyePos = eyePositionCheckbox.checked;
  var useMouse = mouseCheckbox.checked;
  chrome.storage.sync.set({
    'options': {
      showEyePos: showEyePos,
      useMouse: useMouse
    }
  }, function() {
    indicator.classList.remove('hidden');
  });
}

function load() {
  chrome.storage.sync.get('options', function(data) {
    var options = data['options'] || {};
    var showEyePos = !!options['showEyePos'];
    var useMouse = !!options['useMouse'];
    eyePositionCheckbox.checked = showEyePos;
    mouseCheckbox.checked = useMouse;
  })
}

load();