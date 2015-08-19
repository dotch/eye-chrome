'use strict';

document.addEventListener('DOMContentLoaded', function() {

  function updateData() {
    chrome.storage.sync.get('questionData', function(stored) {
      var data = stored['questionData'] || [];

      var htmlString =
        '<tr>' +
        '<th>Question</th>' +
        '<th>Question Type</th>' +
        '<th>Fixations</th>' +
        '<th>Jumps</th>' +
        '</tr>';
      if (data) {
        for (var i = 0; i < data.length; i++) {
          var questionData = data[i];
          htmlString +=
            '<tr>' +
            '<td>' + questionData.questionId + '</td>' +
            '<td>' + questionData.questionType + '</td>' +
            '<td>' + questionData.fixationsRelative + '</td>' +
            '<td>' + questionData.jumps + '</td>' +
            '</tr>';
        }
      }
      var element = document.querySelector('#data');
      element.innerHTML = htmlString;
    });
  }

  var clearButton = document.querySelector('#clear');
  clearButton.addEventListener('click', function() {
    chrome.storage.sync.remove('questionData', function() {
      updateData();
    });
  });

  var resultButton = document.querySelector('#result');
  resultButton.addEventListener('click', function() {
    chrome.tabs.create({url: chrome.extension.getURL('result.html')});
  });

  updateData();

});

