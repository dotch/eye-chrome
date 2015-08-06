'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.setBadgeText({text: 'eye'});

console.log('background');

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  var data = JSON.parse(localStorage.getItem('data')) || [];
  data.push(message);
  localStorage.setItem('data', JSON.stringify(data));
  sendResponse({
    saved: data
  });
});