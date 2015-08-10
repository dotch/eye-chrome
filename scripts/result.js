'use strict';

document.addEventListener('DOMContentLoaded', function() {

  function deleteDataElement(index) {
    chrome.storage.sync.get('questionData', function(stored) {
      var data = stored['questionData'];
      data.splice(index, 1);
      chrome.storage.sync.set({'questionData': data}, function() {
        updateData();
      });
    });
}

  function updateData() {
    chrome.storage.sync.get('questionData', function(stored) {
      var data = stored['questionData'] || [];
      var htmlString =
        '<tr>' +
        '<th>Question</th>' +
        '<th>Question Text</th>' +
        '<th>Question Type</th>' +
        '<th>Question Type Detail</th>' +
        '<th>Answer</th>' +
        '<th>Fixations</th>' +
        '<th>Jumps</th>' +
        '<th>Delete</th>' +
        '</tr>';
      for (var i = 0; i < data.length; i++) {
        var questionData = data[i];
        htmlString +=
          '<tr>' +
          '<td>' + questionData.questionId + '</td>' +
          '<td>' + questionData.questionText + '</td>' +
          '<td>' + questionData.questionType + '</td>' +
          '<td>' + questionData.questionTypeDetail + '</td>' +
          '<td>' + questionData.answerText + '</td>' +
          '<td>' + questionData.fixations / questionData.questionText.length + '</td>' +
          '<td>' + questionData.jumps + '</td>' +
          '<td><button class="delete-button" data-index="' + i + '">delete</button></td>' +
          '</tr>';
      }
      if (data.length) {
        var avgFixations = data.reduce(function(prev, curr, idx, arr) {
            return prev + (curr.fixations / curr.questionText.length);
          }, 0) / data.length;
        var avgJumps = data.reduce(function(prev, curr, idx, arr) {
            return prev + curr.jumps;
          }, 0) / data.length;
        htmlString +=
          '<tr>' +
          '<td colspan="5">Average</td>' +
          '<td>' + avgFixations + '</td>' +
          '<td>' + avgJumps + '</td>' +
          '<td></td>' +
          '</tr>';
      }

      var element = document.querySelector('#data');
      element.innerHTML = htmlString;

      var deleteListener = function(e) {
        var id = e.target.dataset.index;
        deleteDataElement(id);
      };
      var deleteButtons = document.querySelectorAll('.delete-button');
      for (var j = 0; j < deleteButtons.length; j++) {
        deleteButtons[j].addEventListener('click', deleteListener);
      }

      var chartArea = document.querySelector('#charts');
      chartArea.innerHTML = '';
      if (data.length) {
        drawChart(['fixations'].concat(_.pluck(data, 'fixations')), avgFixations, _.pluck(data, 'questionId'));
        drawChart(['jumps'].concat(_.pluck(data, 'jumps')), avgJumps, _.pluck(data, 'questionId'));
      }
    });
  }

  function drawChart(data, average, questions) {
    // chart
    var chart = c3.generate({
      size: {height: 500, width: 500},
      data: {
        columns: [
          data
        ],
        type: 'bar'
      },
      axis: {
        x: {
          type: 'category',
          categories: questions,
          label: 'Question'
        }
      },
      grid: {
        y: {lines: [{value: average}]}
      }
    });
    document.querySelector('#charts').appendChild(chart.element);
  }

  updateData();

});

