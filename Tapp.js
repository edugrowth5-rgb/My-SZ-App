/* Project: Success Zone - TEC Exam Prep
   Feature: Auto-Save Progress (Resume from where left)
*/

const allQuestions = {
    'Entrepreneurship': entrepreneurshipData,
    'Economy': economyData,
    'Opportunity': opportunityData,
    'Planning': planningData,
    'Marketing': marketingData,
    'Accounting': accountingData,
    'Legal': legalData,
    'Finance': financeData,
    'SoftSkills': softskillsData,
    'Digital': digitalData,
    'All': finalExamData
};

let quizQuestions = [];
let currentQ = 0;
let score = 0;
let userAnswers = [];
let currentCategory = ""; // वर्तमान विषय को याद रखने के लिए

// ऐप लोड होते ही चेक करें कि क्या कोई पुराना डेटा बचा है
window.onload = () => {
    const savedData = localStorage.getItem('sz_quiz_progress');
    if (savedData) {
        const data = JSON.parse(savedData);
        // यूजर से पूछें कि क्या वो वहीं से शुरू करना चाहते हैं
        const resume = confirm(`आपने पिछला टेस्ट ${data.category} पर अधूरा छोड़ा था। क्या आप वहीं से शुरू करना चाहते हैं?`);
        
        if (resume) {
            resumeQuiz(data);
        } else {
            localStorage.removeItem('sz_quiz_progress'); // डेटा साफ़ करें
        }
    }
};

function showCategories() {
    document.getElementById("welcome-screen").classList.add("hidden");
    document.getElementById("category-screen").classList.remove("hidden");
}

function startQuiz(category) {
    currentCategory = category;
    quizQuestions = allQuestions[category];
    userAnswers = new Array(quizQuestions.length).fill(null);
    // Shuffle केवल नए क्विज के लिए
    quizQuestions = [...quizQuestions].sort(() => Math.random() - 0.5);

    setupQuizUI();
}

// अधूरे क्विज को फिर से शुरू करने का फंक्शन
function resumeQuiz(data) {
    currentCategory = data.category;
    quizQuestions = data.questions;
    userAnswers = data.answers;
    currentQ = data.currentStep;
    
    document.getElementById("welcome-screen").classList.add("hidden");
    setupQuizUI();
}

function setupQuizUI() {
    document.getElementById("category-screen").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden");
    updateScore();
    loadQuestion();
}

function loadQuestion() {
    const qData = quizQuestions[currentQ];
    document.getElementById("question").innerText = qData.q;
    document.getElementById("progress").innerText = `सवाल: ${currentQ + 1}/${quizQuestions.length}`;
    
    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";
    
    qData.options.forEach((opt, index) => {
        const btn = document.createElement("button");
        btn.innerText = opt;
        btn.classList.add("option");
        
        if (userAnswers[currentQ] !== null) {
            btn.disabled = true;
            if (index === qData.ans) btn.classList.add("correct");
            if (index === userAnswers[currentQ] && index !== qData.ans) btn.classList.add("wrong");
        }
        
        btn.onclick = () => checkAnswer(index, btn);
        optionsDiv.appendChild(btn);
    });

    document.getElementById("back-btn").classList.toggle("hidden", currentQ === 0);
    document.getElementById("next-btn").classList.toggle("hidden", userAnswers[currentQ] === null);
    
    // हर सवाल लोड होने पर प्रोग्रेस सेव करें
    saveProgress();
}

function checkAnswer(idx, btn) {
    userAnswers[currentQ] = idx;
    const correct = quizQuestions[currentQ].ans;
    const allBtns = document.querySelectorAll(".option");
    allBtns.forEach(b => b.disabled = true);

    if (idx === correct) btn.classList.add("correct");
    else {
        btn.classList.add("wrong");
        allBtns[correct].classList.add("correct");
    }
    updateScore();
    saveProgress(); // जवाब देने के बाद सेव करें
    document.getElementById("next-btn").classList.remove("hidden");
}

// प्रोग्रेस को localStorage में सेव करने का फंक्शन
function saveProgress() {
    const quizState = {
        category: currentCategory,
        questions: quizQuestions,
        answers: userAnswers,
        currentStep: currentQ
    };
    localStorage.setItem('sz_quiz_progress', JSON.stringify(quizState));
}

function updateScore() {
    score = userAnswers.reduce((t, a, i) => (a === quizQuestions[i].ans ? t + 1 : t), 0);
    document.getElementById("score-display").innerText = `स्कोर: ${score}`;
}

function goBack() {
    if (currentQ > 0) { 
        currentQ--; 
        loadQuestion(); 
    }
}

document.getElementById("next-btn").onclick = () => {
    currentQ++;
    if (currentQ < quizQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
};

function showResults() {
    // क्विज खत्म होने पर सेव किया गया डेटा डिलीट कर दें
    localStorage.removeItem('sz_quiz_progress');
    
    document.getElementById("game-container").classList.add("hidden");
    document.getElementById("result-screen").classList.remove("hidden");
    let percentage = (score / quizQuestions.length) * 100;
    document.getElementById("final-stat").innerHTML = `कुल सवाल: ${quizQuestions.length}<br>सही: ${score}<br>प्रतिशत: ${percentage.toFixed(2)}%`;
}
