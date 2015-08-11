'use strict';

function contains(rect, x, y) {
  return rect.left < x && rect.right > x && rect.top < y && rect.bottom > y;
}

function Controller(showEyePos) {
  this.prevEl = null;
  this.questions = [];
  this.showEyePos = showEyePos;

  if (showEyePos) {
    this.eye = document.createElement('div');
    this.eyeRadius = 8;
    this.eye.style.width = this.eyeRadius*2;
    this.eye.style.height = this.eyeRadius*2;
    this.eye.style.position = 'absolute';
    this.eye.style.backgroundColor = 'red';
    this.eye.style.borderRadius = '100%';
    this.eye.style.overflow = 'hidden';
    this.eye.style.pointerEvents = 'none';
    document.body.appendChild(this.eye);
  }
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
  if (this.showEyePos) {
    this.eye.style.left = x - this.eyeRadius;
    this.eye.style.top = y - this.eyeRadius;
  }
};

Controller.prototype.saveQuestionData = function(answers) {
  var length = this.questions.length;
  var questions = this.questions;
  chrome.storage.sync.get('questionData', function(stored) {
    var questionData = stored['questionData'] || [];
    for (var i = 0; i < length; i++) {
      var data = questions[i];
      if (answers) {
        data.answerText = answers[i];
      }
      data.createdAt = Date.now();
      questionData.push(data);
    }
    chrome.storage.sync.set({ 'questionData': questionData });
  });
};

Controller.prototype.initialize = function(questionsArray) {
  console.log('initializing', questionsArray);
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
var isLimeSurvey = window.location.origin.indexOf('survey.medien.ifi.lmu') !== -1;
var isUniPark = window.location.origin.indexOf('unipark') !== -1;

if (isLimeSurvey || isUniPark) {
  chrome.storage.sync.get('options', function(data) {
    var options = data['options'] || {};
    var useMouse = !!options['useMouse'];
    var showEyePos = !!options['showEyePos'];
    ctrl = new Controller(showEyePos);
    site = isLimeSurvey ? new Limesurvey(ctrl) : new Unipark(ctrl);
    tracker = useMouse ? new MouseTracker(ctrl) : new EyeTracker(ctrl);
  });
}