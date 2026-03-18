/**
 * Quiz Logic
 */

const questions = [
    {
        id: 1,
        insight: null,
        question: "How old is your child?",
        options: ["5–7 years", "8–10 years", "11–13 years", "14–16 years"],
        scores: [{}, {}, {}, {}] // Age doesn't heavily skew profile usually, just for data
    },
    {
        id: 2,
        insight: "Children who choose creative activities are often stronger logical thinkers than they appear.",
        question: "When your child has free time, they usually...",
        options: ["Build or make things", "Read or write", "Play games or puzzles", "Draw or create", "Move and play outside"],
        scores: [
            { logical: 2 },
            { creative: 2 },
            { logical: 1, competitive: 1 },
            { creative: 2 },
            { social: 2, competitive: 1 }
        ]
    },
    {
        id: 3,
        insight: "The subject kids enjoy most is rarely the one their parents predict.",
        question: "In school, what comes most naturally to your child?",
        options: ["Numbers and logic", "Expressing ideas", "Creating things", "Solving problems", "Working with others"],
        scores: [
            { logical: 2 },
            { creative: 1, social: 1 },
            { creative: 2 },
            { logical: 2, competitive: 1 },
            { social: 2 }
        ]
    },
    {
        id: 4,
        insight: "Small groups of 3–5 kids learn up to 40% faster than solo lessons — they push each other.",
        question: "How does your child learn best?",
        options: ["By doing it themselves", "By watching first", "By reading and thinking", "By talking it through"],
        scores: [
            { logical: 1, competitive: 1 },
            { creative: 1 },
            { logical: 2 },
            { social: 2 }
        ]
    },
    {
        id: 5,
        insight: "Kids who play chess for 3 months show measurable improvements in math performance.",
        question: "What would your child most enjoy making or achieving?",
        options: ["Win a chess tournament", "Build their own game", "Write a story people love", "Solve a really hard problem", "Create something beautiful"],
        scores: [
            { competitive: 3, logical: 1 },
            { logical: 2, creative: 1 },
            { creative: 3 },
            { logical: 3 },
            { creative: 3 }
        ]
    },
    {
        id: 6,
        insight: "Most parents start with one goal and discover a second one within the first month.",
        question: "What's your main goal right now?",
        options: ["Stay ahead academically", "Explore a passion or hobby", "Build focus and discipline", "Prepare for future opportunities", "Just have fun and learn something new"],
        scores: [
            { competitive: 2, logical: 1 },
            { creative: 2, social: 1 },
            { competitive: 2, logical: 2 },
            { logical: 1, creative: 1 },
            { social: 3 }
        ]
    }
];

const profiles = {
    logical: {
        title: "The Logical Builder",
        desc: "Your child thinks in systems and loves figuring out how things work. They learn best when they can see the logic behind something — and they thrive when challenged with real problems, not just drills.",
        tags: ["Math", "Coding"],
        cards: [
            { subject: "Math", color: "subj-math", title: "Math Problem Solving", desc: "Logic puzzles and real-world problems for confident learners.", time: "Every Mon 5:00 PM" },
            { subject: "Coding", color: "subj-coding", title: "Build Your First Game", desc: "Kids learn Scratch by building a real playable game together.", time: "Every Tue 4:30 PM" }
        ]
    },
    creative: {
        title: "The Creative Storyteller",
        desc: "Your child has a rich inner world and loves to express it. They connect best with learning when it allows them to create, share, and put their own unique spin on the outcome.",
        tags: ["English", "Art"],
        cards: [
            { subject: "English", color: "subj-english", title: "Creative Writing Club", desc: "Kids write short stories, share them, and build confidence in English.", time: "Every Wed 4:00 PM" },
            { subject: "Art", color: "subj-art", title: "Drawing From Imagination", desc: "Learn to draw characters, scenes and worlds from your own mind.", time: "Every Thu 5:00 PM" }
        ]
    },
    social: {
        title: "The Social Explorer",
        desc: "Your child is highly relational and learns best through conversation, interaction, and shared experiences. Group environments where they can bounce ideas off others are where they shine.",
        tags: ["English", "Chess"],
        cards: [
            { subject: "English", color: "subj-english", title: "Creative Writing Club", desc: "Kids write short stories, share them, and build confidence in English.", time: "Every Wed 4:00 PM" },
            { subject: "Chess", color: "subj-chess", title: "Chess for Beginners", desc: "From rules to first strategies — a fun intro to the game of thinking.", time: "Every Tue 5:00 PM" }
        ]
    },
    competitive: {
        title: "The Competitive Achiever",
        desc: "Your child is driven by goals and measurable progress. They love a challenge and the satisfaction of mastering something difficult. Strategic thinking and problem-solving are their sweet spots.",
        tags: ["Chess", "Math"],
        cards: [
            { subject: "Chess", color: "subj-chess", title: "Chess for Beginners", desc: "From rules to first strategies — a fun intro to the game of thinking.", time: "Every Tue 5:00 PM" },
            { subject: "Math", color: "subj-math", title: "Times Tables & Beyond", desc: "Multiplication, division and number sense — made actually fun.", time: "Every Fri 4:00 PM" }
        ]
    }
};

let currentQuestion = 0; // 0 is intro
let scores = { logical: 0, creative: 0, social: 0, competitive: 0 };

document.addEventListener('DOMContentLoaded', () => {
    renderQuestions();
    document.getElementById('back-btn').addEventListener('click', goBack);
});

function renderQuestions() {
    const container = document.getElementById('questions-container');
    questions.forEach((q, index) => {
        const screen = document.createElement('div');
        screen.className = 'screen';
        screen.id = `screen-q${index + 1}`;

        let optionsHtml = q.options.map((opt, optIndex) => `
      <button class="option-card" onclick="selectOption(${index}, ${optIndex})">${opt}</button>
    `).join('');

        screen.innerHTML = `
      <div class="quiz-content">
        <h2 class="quiz-q-h2">${q.question}</h2>
        <div>${optionsHtml}</div>
      </div>
    `;
        container.appendChild(screen);
    });
}

function startQuiz() {
    document.getElementById('quiz-header').style.display = 'flex';
    document.getElementById('progress-container').style.display = 'block';
    goToScreen(`screen-q1`);
    updateProgress(1);
}

function selectOption(qIndex, optIndex) {
    // Add score
    const qObj = questions[qIndex];
    const scoreKeys = Object.keys(qObj.scores[optIndex] || {});
    scoreKeys.forEach(k => { scores[k] += qObj.scores[optIndex][k]; });

    const nextQIndex = qIndex + 1;
    const nextQObj = questions[nextQIndex];

    if (nextQObj) {
        if (nextQObj.insight) {
            showInsight(nextQObj.insight, () => {
                goToScreen(`screen-q${nextQIndex + 1}`);
                updateProgress(nextQIndex + 1);
            });
        } else {
            goToScreen(`screen-q${nextQIndex + 1}`);
            updateProgress(nextQIndex + 1);
        }
    } else {
        // End of questions, go to email
        goToScreen('screen-email');
        document.getElementById('progress-bar').style.width = '100%';
        document.getElementById('question-counter').innerText = 'Done';
    }
}

function showInsight(text, callback) {
    const insightCard = document.getElementById('insight-card');
    document.getElementById('insight-text').innerText = text;

    // Hide current active screen temporarily
    document.querySelector('.screen.active').classList.remove('active');

    insightCard.classList.add('active');
    setTimeout(() => {
        insightCard.classList.remove('active');
        setTimeout(callback, 400); // Wait for insight fade out
    }, 2500);
}

function updateProgress(stepNum) {
    const totalSteps = questions.length;
    const percent = (stepNum / totalSteps) * 100;
    document.getElementById('progress-bar').style.width = `${percent}%`;
    document.getElementById('question-counter').innerText = `${stepNum} / ${totalSteps}`;
}

function goToScreen(id) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function goBack() {
    // Simplistic back: recalculating scores would require history tracking, 
    // for now just visually go back. Or simple reload if on screen-email
    window.location.reload();
}

function submitQuiz() {
    goToScreen('screen-loading');
    document.getElementById('quiz-header').style.display = 'none';
    document.getElementById('progress-container').style.display = 'none';

    const texts = [
        "Analysing learning style...",
        "Matching to available classes...",
        "Building your child's profile..."
    ];
    let textIndex = 0;

    const interval = setInterval(() => {
        textIndex++;
        if (textIndex < texts.length) {
            const el = document.getElementById('loading-text');
            el.style.animation = 'none';
            el.offsetHeight; /* trigger reflow */
            el.style.animation = null;
            el.innerText = texts[textIndex];
        }
    }, 800);

    setTimeout(() => {
        clearInterval(interval);
        showResult();
    }, 2500);
}

function showResult() {
    // Compute best profile
    let bestProfile = 'logical';
    let maxScore = scores.logical;

    ['creative', 'social', 'competitive'].forEach(p => {
        if (scores[p] > maxScore) {
            maxScore = scores[p];
            bestProfile = p;
        }
    });

    const pData = profiles[bestProfile];
    const screen = document.getElementById('screen-result');

    document.body.classList.add('result-state');

    const tagsHtml = pData.tags.map(t => `<span class="pill subj-${t.toLowerCase()}">${t}</span>`).join('');
    const cardsHtml = pData.cards.map(c => `
    <div class="card mb-16 shadow-sm" style="background: white; border: 1.5px solid var(--border); border-radius: 20px; padding: 24px; text-align: left;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <span class="pill ${c.color}">${c.subject}</span>
        <span class="text-label text-secondary">${c.time}</span>
      </div>
      <h3 style="font-family: var(--font-headings); font-size: 20px; color: var(--text-primary); margin-bottom: 8px;">${c.title}</h3>
      <p class="text-small text-secondary mb-16">${c.desc}</p>
      <div style="border-top: 1px solid var(--border); padding-top: 16px;">
        <a href="#stripe-link" class="btn btn-primary btn-small">Book · 30 cr</a>
      </div>
    </div>
  `).join('');

    screen.innerHTML = `
    <!-- Top Result Section -->
    <div class="result-section result-top-bg">
      <div class="container text-center" style="max-width: 600px;">
        <span class="pill" style="background: var(--primary); color: white; margin-bottom: 24px;">Your child's learning profile</span>
        <h1 style="font-family: var(--font-headings); font-size: 48px; color: var(--text-primary); margin-bottom: 16px;">${pData.title}</h1>
        <p class="text-large text-secondary mb-24">${pData.desc}</p>
        <div style="display: flex; gap: 12px; justify-content: center;">
          ${tagsHtml}
        </div>
      </div>
    </div>

    <!-- Suggested Classes -->
    <div class="result-section bg-white">
      <div class="container" style="max-width: 800px;">
        <h2 style="font-family: var(--font-headings); color: var(--text-primary); margin-bottom: 32px; text-align: center;">Classes we recommend this week</h2>
        <div class="grid-2">
          ${cardsHtml}
        </div>
      </div>
    </div>

    <!-- Final Offer -->
    <div class="result-section result-bottom-bg">
      <div class="container text-center" style="max-width: 600px;">
        <h2 style="font-family: var(--font-headings); font-size: 36px; color: var(--text-primary); margin-bottom: 16px;">Try 3 classes for $10</h2>
        <p class="text-large text-secondary mb-24">Your trial includes 100 credits — enough for your first three sessions.</p>
        <div style="display: inline-flex; align-items: center; gap: 8px; color: var(--text-secondary); background: white; padding: 8px 16px; border-radius: 100px; font-size: 14px; border: 1px solid var(--border); margin-bottom: 32px;">
          <span>⏱️</span> Offer available for 24 hours
        </div>
        <br>
        <a href="#stripe-link" class="btn btn-primary" style="margin-bottom: 16px; padding: 16px 32px; font-size: 18px;">Start for $10 →</a>
        <br>
        <a href="classes.html" style="color: var(--text-secondary); font-size: 14px; text-decoration: underline;">Browse all classes first</a>
      </div>
    </div>
  `;

    goToScreen('screen-result');
    // Trigger layout to clear hidden classes correctly
    screen.style.opacity = 1;
    screen.style.pointerEvents = 'auto';
}
