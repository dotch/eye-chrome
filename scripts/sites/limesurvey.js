function Limesurvey(ctrl, increaseFontSize) {


  if (increaseFontSize) {
    document.body.style.fontSize = '22px';
    var ths = document.querySelectorAll('table.question th');
    for (var th = 0; th < ths.length; th++) {
      ths[th].style.fontSize = '16px';
    }
  }

  var questionContainers = document.querySelectorAll('.group > div > table.question');
  var questions = [];
  var answers = [];

  //console.log(questions);
  for (var i = 0; i < questionContainers.length; i++) {
    var qc = questionContainers[i];

    // Type: SubQuestionList
    var subQuestionList = qc.querySelectorAll('.subquestions-list');
    if (subQuestionList.length) {
      //console.log('subquestions', qc);
      var subQuestionContainers = qc.querySelectorAll('.answers-list');
      var scaleEls = qc.querySelectorAll('.subquestions-list > thead > tr > th');
      var scale = [];
      for (var k = 0; k < scaleEls.length ; k++) {
        scale.push(scaleEls[k].textContent);
      }
      for (var s = 0; s < subQuestionContainers.length; s++) {
        var sqc = subQuestionContainers[s];
        var subQuestionElement = sqc.querySelector('.answertext');
        var subQuestionText = sqc.querySelector('span') ? sqc.querySelector('span').textContent : sqc.querySelector('.answertext').textContent;
        var subQuestionId = qc.parentNode.id + '_' + s;
        var subQuestionType = 'subquestion';
        var subQuestionAnswerElement = sqc; // question overlays answerElement but gets checked first.
        var subQuestionAnswerField = sqc.querySelector('input');
        questions.push({
          questionElement: subQuestionElement,
          questionId: subQuestionId,
          questionText: subQuestionText,
          questionType: subQuestionType,
          questionTypeDetail: null,
          answerElement: subQuestionAnswerElement,
          answerField: subQuestionAnswerField,
          scale: scale
        });
      }
    } else {
      //console.log('not subquestions', qc);
      var questionElement = qc.querySelector('.questiontext');
      var questionText = questionElement.textContent.trim();
      var questionId = qc.parentNode.id;
      var questionType = qc.parentNode.classList[0];
      var answerElement =  qc.querySelector('.answer');
      var answerField = answerElement.querySelector('input[id^="java"]') || answerElement.querySelector('input') || answerElement.querySelector('textarea');
      questions.push({
        questionElement: questionElement,
        questionId: questionId,
        questionText: questionText,
        questionType: questionType,
        questionTypeDetail: null,
        answerElement: answerElement,
        answerField: answerField
      });
    }

  }
  console.log(questions);

  if (questions.length) {
    ctrl.initialize(questions);
    //console.log(questions);
    // listen to submit button
    var nextButton = document.querySelector('button#movenextbtn');
    var submitButton = document.querySelector('button#movesubmitbtn');

    var submitListener = function(e) {
      e.preventDefault();
      e.stopPropagation();

      var answers = [];
      for (var j = 0; j < questions.length; j++) {
        var q = questions[j];
        var answer;
        if (q.scale) {
          var index = Number(q.answerField.value[1]) - 1;
          answer = q.scale[index];
        } else if (q.answerField.id.indexOf('java') !== -1) {
          var query = '[for="' + q.answerField.id.replace('java', 'answer') + q.answerField.value + '"]';
          var answerLabel = document.querySelector(query);
          answer = answerLabel ? answerLabel.textContent : q.answerField.value;
        } else {
          answer = q.answerField.value;
        }
        console.log(q.questionText, answer);
        answers.push(answer);
      }
      ctrl.saveQuestionData.bind(ctrl)(answers);
    };

    if (submitButton) {
      submitButton.addEventListener('click', submitListener);
    }
    if (nextButton) {
      nextButton.addEventListener('click', submitListener);
    }
  }

}