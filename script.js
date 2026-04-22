// Game data
const initialExpenses = [
    {
        id: 1,
        name: "Зарплаты чиновников",
        icon: "💼",
        original: 120,
        current: 120,
        cutPercent: 0,
        maxCut: 50,
        consequences: [
            "Недовольство госслужащих",
            "Забастовки администрации",
            "Утечка кадров"
        ]
    },
    {
        id: 2,
        name: "Содержание дорог",
        icon: "🛣️",
        original: 80,
        current: 80,
        cutPercent: 0,
        maxCut: 40,
        consequences: [
            "Ухудшение качества дорог",
            "Рост числа аварий",
            "Жалобы жителей"
        ]
    },
    {
        id: 3,
        name: "Образование",
        icon: "📚",
        original: 100,
        current: 100,
        cutPercent: 0,
        maxCut: 30,
        consequences: [
            "Закрытие школ",
            "Увольнение учителей",
            "Протесты родителей"
        ]
    },
    {
        id: 4,
        name: "Здравоохранение",
        icon: "🏥",
        original: 90,
        current: 90,
        cutPercent: 0,
        maxCut: 25,
        consequences: [
            "Сокращение больниц",
            "Нехватка лекарств",
            "Рост заболеваемости"
        ]
    },
    {
        id: 5,
        name: "Культура и спорт",
        icon: "🎭",
        original: 50,
        current: 50,
        cutPercent: 0,
        maxCut: 60,
        consequences: [
            "Закрытие библиотек",
            "Отмена мероприятий",
            "Недовольство молодёжи"
        ]
    },
    {
        id: 6,
        name: "Благоустройство",
        icon: "🌳",
        original: 60,
        current: 60,
        cutPercent: 0,
        maxCut: 45,
        consequences: [
            "Грязные улицы",
            "Запустение парков",
            "Падение качества жизни"
        ]
    }
];

const INITIAL_DEFICIT = 50; // million rubles
let expenses = [];
let totalCut = 0;

// Initialize game
function initGame() {
    expenses = JSON.parse(JSON.stringify(initialExpenses));
    totalCut = 0;
    renderExpenses();
    updateBudget();
    document.getElementById('successAlert').classList.remove('show');
}

// Render expenses list
function renderExpenses() {
    const list = document.getElementById('expensesList');
    list.innerHTML = '';

    expenses.forEach(expense => {
        const item = document.createElement('div');
        item.className = 'expense-item' + (expense.cutPercent >= expense.maxCut ? ' max-cut' : '');

        const saved = expense.original - expense.current;

        item.innerHTML = `
            <div class="expense-info">
                <div class="expense-name">
                    <span class="expense-icon">${expense.icon}</span>
                    ${expense.name}
                </div>
                <div class="expense-original">Исходно: ${expense.original} млн ₽</div>
                <div class="expense-current">Сейчас: ${expense.current} млн ₽ (сокращено на ${saved} млн ₽)</div>
            </div>
            <div class="cut-control">
                <div class="cut-percent">${expense.cutPercent}%</div>
                <button class="btn-cut" onclick="cutExpense(${expense.id})" 
                        ${expense.cutPercent >= expense.maxCut ? 'disabled' : ''}>
                    -10%
                </button>
            </div>
        `;

        list.appendChild(item);
    });
}

// Cut expense by 10%
function cutExpense(id) {
    const expense = expenses.find(e => e.id === id);
    if (expense && expense.cutPercent < expense.maxCut) {
        const cutAmount = expense.original * 0.1;
        expense.current = Math.max(0, expense.current - cutAmount);
        expense.cutPercent += 10;

        updateBudget();
        renderExpenses();
        updateConsequences();
        checkWin();
    }
}

// Update budget display
function updateBudget() {
    totalCut = expenses.reduce((sum, e) => sum + (e.original - e.current), 0);
    const currentDeficit = INITIAL_DEFICIT - totalCut;
    const progressPercent = Math.min(100, (totalCut / INITIAL_DEFICIT) * 100);

    const budgetAmount = document.getElementById('budgetAmount');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const progressPercentEl = document.getElementById('progressPercent');

    budgetAmount.textContent = currentDeficit >= 0
        ? `+${currentDeficit.toFixed(1)} млн ₽`
        : `${currentDeficit.toFixed(1)} млн ₽`;

    if (currentDeficit >= 0) {
        budgetAmount.classList.add('positive');
    } else {
        budgetAmount.classList.remove('positive');
    }

    progressFill.style.width = `${progressPercent}%`;
    progressText.textContent = `${Math.round(progressPercent)}%`;
    progressPercentEl.textContent = `${Math.round(progressPercent)}%`;

    document.getElementById('totalCut').textContent = `${totalCut.toFixed(1)} млн ₽`;
    document.getElementById('remaining').textContent = `${currentDeficit.toFixed(1)} млн ₽`;
}

// Update consequences list
function updateConsequences() {
    const list = document.getElementById('consequencesList');
    const activeConsequences = [];

    expenses.forEach(expense => {
        if (expense.cutPercent > 0) {
            activeConsequences.push(
                `<strong>${expense.name}</strong> (-${expense.cutPercent}%): ${expense.consequences.join(', ')}`
            );
        }
    });

    if (activeConsequences.length === 0) {
        list.innerHTML = '<li>Пока нет сокращений</li>';
    } else {
        list.innerHTML = activeConsequences.map(c => `<li>${c}</li>`).join('');
    }
}

// Check win condition
function checkWin() {
    if (totalCut >= INITIAL_DEFICIT) {
        document.getElementById('successAlert').classList.add('show');
    }
}

// Reset game
function resetGame() {
    initGame();
}

// Start the game
initGame();