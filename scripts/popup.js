'use strict';

document.addEventListener('DOMContentLoaded', function() {

  function updateData() {
    var data = JSON.parse(localStorage.getItem('data'));
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
          '<td>' + questionData.fixations / questionData.questionText.length + '</td>' +
          '<td>' + questionData.jumps + '</td>' +
          '</tr>';
      }
    }
    var element = document.querySelector('#data');
    element.innerHTML = htmlString;


    //var sum = data.reduce(function(prev, curr, idx, arr) {
    //  return prev + curr.fixationsRelative;
    //}, 0);
    //var avgEl = document.querySelector('#avg');
    //avgEl.innerHTML = sum / data.length;

  }

  var clearButton = document.querySelector('#clear');
  clearButton.addEventListener('click', function() {
    localStorage.removeItem('data');
    updateData();

    //var element = document.querySelector('#data');
    //element.innerHTML = '';
  });

  var resultButton = document.querySelector('#result');
  resultButton.addEventListener('click', function() {
    chrome.tabs.create({url: chrome.extension.getURL('result.html')});
  });

  updateData();

});

