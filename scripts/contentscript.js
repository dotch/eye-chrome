'use strict';

//function initializeEyeBall() {
//  var eye = document.createElement('div');
//  eye.style.width = '16px';
//  eye.style.height = '16px';
//  eye.style.position = 'absolute';
//  eye.style.backgroundColor = 'red';
//  eye.style.borderRadius = '100%';
//  eye.style.overflow = 'hidden';
//  eye.style.pointerEvents = 'none';
//  document.body.appendChild(eye);
//}

function contains(rect, x, y) {
  return rect.left < x && rect.right > x && rect.top < y && rect.bottom > y;
}

function Controller() {
  this.prevEl = null;
  this.questions = [];
}

Controller.prototype.handlePosition = function(x, y) {
  for (var i = 0; i < this.questions.length; i++) {
    var q = this.questions[i];
    var boundingRectQuestion = q.questionElement.getBoundingClientRect();
    var boundingRectAnswer = q.answerElement.getBoundingClientRect();

    if (contains(boundingRectQuestion, x, y) ) {
      this.questions[i].fixations++;
      if (this.prevEl === q.answerElement) q.jumps++;
      this.prevEl = q.questionElement;
    } else if (contains(boundingRectAnswer, x, y)) {
      this.prevEl = q.answerElement;
    }
  }
};

Controller.prototype.saveQuestionData = function(answers) {
  for (var i = 0; i < this.questions.length; i++) {
    var data = this.questions[i];
    if (answers) {
      data.answerText = answers[i];
    }
    data.createdAt = Date.now();
    chrome.runtime.sendMessage(data, function (response) {
      console.log(response);
    });
    console.log('save', this.questions[i]);
  }
};

Controller.prototype.initialize = function(questionsArray) {
  this.questions = questionsArray;
  this.questions.forEach(function(q){
    q.fixations = 0;
    q.jumps = 0;
  });
  this.initialized = true;
};

var ctrl;
var site;
var tracker;
if (window.location.origin.indexOf('survey.medien.ifi.lmu') !== -1)  {
  // LimeSurvey
  console.log('lmu limesurvey detected');
  ctrl = new Controller();
  site = new Limesurvey(ctrl);
  tracker = new MouseTracker(ctrl);
} else if (window.location.origin.indexOf('unipark') !== -1) {
  // Unipark
  console.log('unipark detected');
  ctrl = new Controller();
  site = new Unipark(ctrl);
  tracker = new MouseTracker(ctrl);
}
