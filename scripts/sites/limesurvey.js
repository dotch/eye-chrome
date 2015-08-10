function Limesurvey(ctrl) {


  var questionContainers = document.querySelectorAll('table.question');
  var questions = [];

  //console.log(questions);
  for (var i = 0; i < questionContainers.length; i++) {
    var qc = questionContainers[i];
    var questionElement = qc.querySelector('.questiontext');
    var questionText = questionElement.textContent.trim();
    var questionId = qc.parentNode.id;
    var questionType = qc.parentNode.classList[0];
    var answerElement =  qc.querySelector('.answer');
    questions.push({
      questionElement: questionElement,
      questionId: questionId,
      questionText: questionText,
      questionType: questionType,
      questionTypeDetail: null,
      answerElement: answerElement
    })
  }

  if (questions.length) {
    ctrl.initialize(questions);
    console.log(questions);
    // listen to submit button
    var submitButton = document.querySelector('button#movenextbtn');
    submitButton.addEventListener('click', function() {
      var answers = [];
      for (var j = 0; j < questions.length; j++) {
        var selector = '.question [name$="X' + questions[j].questionId.replace('question', '') + '"]';
        var input = document.querySelectorAll(selector);
        console.log(selector, input);
      }
      // TODO: answers
      ctrl.saveQuestionData.bind(ctrl)();
    });
  }

}