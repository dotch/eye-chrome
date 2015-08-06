function Unipark(ctrl) {

  var question = document.querySelector('.questionText');
  var answer = document.querySelector('.answertable');

  if (question && answer) {

    var questionText = question.textContent;
    var questionId = questionText.split('. ')[0].trim();
    var questionType = '';
    var questionTypeDetail = '';

    var multiScale = document.querySelectorAll('.answerscale');
    var singleScale = document.querySelectorAll('.scaletitle label');

    // determine the question type
    if (multiScale.length) {
      var assertions = document.querySelectorAll('[class^=answertext]');
      questionType = 'multiple';
      questionTypeDetail = assertions.length + ' assertions - ' + multiScale.length + '-point Likert scale';
    } else if (singleScale.length) {
      questionType = 'single';
      questionTypeDetail = 'single - ' + singleScale.length + '-point scale';
    } else {
      questionType = 'single';
      var answers = document.querySelectorAll('[class^=answertext]');
      questionTypeDetail = 'single - ' + answers.length + ' answers';
    }

    // initialize the controller with the elements and data
    ctrl.initialize([{
      questionElement: question,
      questionId: questionId,
      questionText: questionText,
      questionType: questionType,
      questionTypeDetail: questionTypeDetail,
      answerElement: answer
    }]);

    // listen to submit button
    var submitButton = document.querySelector('.submitbutton');
    submitButton.addEventListener('click', function() {
      var answerText = '';

      // get the selected answer for a single question
      if (questionType === 'single') {
        // example: <input type="hidden" name="v_823" value="3">
        var hiddenInput = document.querySelector('.globaltable2 input');
        var value = hiddenInput.value;
        // example: <label for="v_823x1">Sehr gut</label>
        var selectedId = hiddenInput.getAttribute('name') + 'x' + value;
        var answer = document.querySelector('[for=' + selectedId + ']');
        answerText = answer.textContent;
      }
      console.log(answerText);
      ctrl.saveQuestionData.bind(ctrl)([answerText]);
    });
  }
}