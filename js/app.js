import Question from "./Question.js";
import Quiz from "./Quiz.js";

const App = ( ()=> {
    // Cache the DOM
    const quizEl = document.querySelector(".appquiz");
    const quizQuestionEl = document.querySelector(".appquiz__question");
    const trackerEl = document.querySelector(".appquiz__tracker");
    const taglineEl = document.querySelector(".appquiz__tagline");
    const choicesEl = document.querySelector(".appquiz__choices");
    const progressInnerEl = document.querySelector(".progress__inner");
    const nextButtonEl = document.querySelector(".next");
    const restartButtonEl = document.querySelector(".restart");

    const q1 = new Question(
        "First President of the US?",
        ["Barrack", "Osama", "George", "Joe"],
        2
        )
    const q2 = new Question(
        "When was JavaScript created?",
        ["June 1995", "May 1995", "July 1985", "Sep 1997"],
        1
        )
    const q3 = new Question(
        "What does CSS stand for?",
        ["Counter selector sense", "Casacading self style", "Casacading style sheets", "Cream soap salad"],
        2
        )
    const q4 = new Question(
        "What is 1 + 1?",
        ["1", "3", "5", "2"],
        3
        )
    const q5 = new Question(
        "What is 2 * 2?",
        ["4", "2", "1", "3"],
        0
        )

        const quiz = new Quiz([q1, q2, q3, q4, q5]);

        const listeners = _ => {
            nextButtonEl.addEventListener("click", function() {
                const selectedRadioElem = document.querySelector('input[name="choice"]:checked');
                if (selectedRadioElem) {
                    const key = Number(selectedRadioElem.getAttribute("data-order"));
                    quiz.guess(key);
                    renderAll();
                }
            });

            restartButtonEl.addEventListener("click", function() {
                // 1. reset the quiz
                quiz.reset();
                // 2. renderAll again
                renderAll();
                // 3. restore next button
                nextButtonEl.style.opacity = 1;
                // 4. reset tagline
            });
        }

        const setValue = (elem, value) => {
            elem.innerHTML = value;
        }

        const renderQuestion = _ => {
            const question = quiz.getCurrentQuestion().question;
            setValue(quizQuestionEl,question);
        }

        const renderChoicesElements = _ => {
            let markup = "";
            const currentChoices = quiz.getCurrentQuestion().choices;
            currentChoices.forEach((elem, index) => {
                markup += `
                <li class="appquiz__choice">
                    <input type="radio" name="choice" class="appquiz__input" data-order="${index}" id="choice${index}">
                    <label for="choice${index}" class="appquiz__label">
                    <i></i>
                    <span>${elem}</span>
                    </label>
                </li>
                `
            });
            setValue(choicesEl, markup);
        }

        const renderTracker = _ => {
            const index = quiz.currentIndex;
            setValue(trackerEl, `${index+1} of ${quiz.questions.length}`)
        }

        const getPercentage = (num1, num2) => {
            return Math.round((num1/num2) * 100);
        }

        const launch = (width, maxPercent) => {
            let loadingBar = setInterval(function() {
                if (width > maxPercent) {
                    clearInterval(loadingBar);
                } else {
                    width++;
                    progressInnerEl.style.width = `${width}%`;                }
                }, 3)
            }

            const renderProgress = _ => {
                // 1. width in %
                const currentWidth = getPercentage(quiz.currentIndex, quiz.questions.length);
                // 2. launch(0, width)
                launch(0, currentWidth);
            }

            const renderEndScreen = _ => {
            setValue(quizQuestionEl, `Great Job`);
            setValue(taglineEl, `Complete`);
            setValue(trackerEl, `Your score: ${getPercentage(quiz.score, quiz.questions.length)}%`);
            nextButtonEl.style.opacity = 0;
            renderProgress();
        }

        const renderAll = _ => {
            if (quiz.hasEnded()){
                //renderEndScreen
                renderEndScreen();
            } else {
                // 1. render the question
                renderQuestion();
                // 2. Render the choices elements
                renderChoicesElements();
                // 3. Render Tracker
                renderTracker();
                // 4. Render Progress
                renderProgress();
                // 5. Render tagline
                setValue(taglineEl, "Pick an option below!");
            }
        }

        return {
            renderAll: renderAll,
            listeners: listeners
        }

})();

App.renderAll();
App.listeners();