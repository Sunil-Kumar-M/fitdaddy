/* ─── PPL Week Tabs ─── */
  function showWeek(n, btn) {
    document.querySelectorAll('.week-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.week-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('week-' + n).classList.add('active');
    btn.classList.add('active');
    setTimeout(animateCards, 50);
  }

  function animateCards() {
    const cards = document.querySelectorAll('.week-panel.active .day-block');
    cards.forEach((c, i) => {
      c.classList.remove('visible');
      setTimeout(() => c.classList.add('visible'), i * 80);
    });
  }

  /* ─── Supplementary Panel Tabs ─── */
  function showSuppl(id, btn) {
    document.querySelectorAll('.suppl-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.suppl-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('suppl-' + id).classList.add('active');
    btn.classList.add('active');
    if (id === 'ppl') setTimeout(animateCards, 80);
  }

  /* ─── Expandable Supplementary Exercise Rows ─── */
  function toggleSupplEx(row) {
    const wasOpen = row.classList.contains('open');
    // close all in same list
    row.closest('.suppl-ex-list').querySelectorAll('.suppl-ex-row.open').forEach(r => r.classList.remove('open'));
    if (!wasOpen) row.classList.add('open');
  }

  function showPageTab(id, btn) {
    document.querySelectorAll('.page-panel').forEach(panel => panel.classList.remove('active'));
    document.querySelectorAll('.page-tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById('page-' + id).classList.add('active');
    btn.classList.add('active');
    if (id === 'workout') setTimeout(animateCards, 80);
    setTimeout(() => revealVisibleItems(document.getElementById('page-' + id)), 40);
  }

  function fillProteinExample(weight, unit, goal, activity, meals) {
    document.getElementById('bodyweight').value = weight;
    document.getElementById('weightUnit').value = unit;
    document.getElementById('goal').value = goal;
    document.getElementById('proteinActivity').value = activity;
    document.getElementById('mealsPerDay').value = meals;
    calculateProtein();
  }

  function revealVisibleItems(scope = document) {
    scope.querySelectorAll('[data-reveal]').forEach((item, index) => {
      setTimeout(() => item.classList.add('is-visible'), index * 60);
    });
  }

  /* ─── Expandable PPL Exercise Cells ─── */
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tool-card, .tool-sidecard, .diet-card, .meal-block, .schedule-section, .coaching-note, .abs-section, .forearms-section').forEach(el => {
      el.setAttribute('data-reveal', '');
    });

    // Upgrade all ex-cells with expandable detail if they have a glass-tip
    document.querySelectorAll('.ex-cell').forEach(cell => {
      const tip = cell.querySelector('.ex-glass-tip');
      const top = cell.querySelector('.ex-top');
      const setsEl = cell.querySelector('.ex-sets');
      if (!tip || !top) return;

      // Parse sets text for meta
      const setsText = setsEl ? setsEl.textContent.trim() : '';
      const tipText = tip.textContent.trim();

      // Build expanded detail section
      const detail = document.createElement('div');
      detail.className = 'ex-detail';
      detail.innerHTML = `
        <div class="ex-meta-grid">
          <div class="ex-meta-item"><span class="ex-meta-key">Sets × Reps</span><span class="ex-meta-val">${setsText}</span></div>
          <div class="ex-meta-item"><span class="ex-meta-key">Tempo</span><span class="ex-meta-val">3-0-3-1</span></div>
          <div class="ex-meta-item"><span class="ex-meta-key">Eccentric</span><span class="ex-meta-val">3–4 sec</span></div>
          <div class="ex-meta-item"><span class="ex-meta-key">Rest</span><span class="ex-meta-val">60–90 sec</span></div>
        </div>
        <div class="ex-glass-cue">${tipText}</div>`;

      // Add expand hint to top
      const hint = document.createElement('div');
      hint.className = 'ex-expand-toggle';
      hint.innerHTML = '<span class="ex-expand-icon">▸ glass cue</span>';

      tip.replaceWith(detail);
      top.after(hint);

      cell.addEventListener('click', () => {
        const wasOpen = cell.classList.contains('open');
        cell.closest('.exercises-grid').querySelectorAll('.ex-cell.open').forEach(c => c.classList.remove('open'));
        if (!wasOpen) cell.classList.add('open');
      });
    });

    document.querySelectorAll('#height, #weight, #age, #bodyweight').forEach(input => {
      input.addEventListener('keydown', event => {
        if (event.key !== 'Enter') return;
        if (input.id === 'bodyweight') calculateProtein();
        else calculateBMI();
      });
    });

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('[data-reveal]').forEach(item => revealObserver.observe(item));
    revealVisibleItems(document.getElementById('page-workout'));
    setTimeout(animateCards, 100);
  });

function calculateBMI(){
const heightCm = parseFloat(document.getElementById("height").value);
const weightKg = parseFloat(document.getElementById("weight").value);
const age = parseFloat(document.getElementById("age").value);
const sex = document.getElementById("sex").value;
const activity = parseFloat(document.getElementById("bmiActivity").value);
const result = document.getElementById("bmiResult");

if (!heightCm || !weightKg || !age || heightCm <= 0 || weightKg <= 0 || age <= 0) {
  result.className = "tool-result show";
  result.innerHTML = `
    <div class="tool-result-note">
      Please enter valid height, weight, and age values to calculate your BMI and calorie estimates.
    </div>`;
  return;
}

const heightM = heightCm / 100;
const bmi = weightKg / (heightM * heightM);
const healthyMin = 18.5 * heightM * heightM;
const healthyMax = 24.9 * heightM * heightM;
const category = getBmiCategory(bmi);
const bmr = sex === "male"
  ? (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5
  : (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
const maintenance = bmr * activity;

result.className = "tool-result show";
result.innerHTML = `
  <div class="tool-result-head">
    <div>
      <div class="tool-result-label">Body Mass Index</div>
      <div class="tool-result-value">${bmi.toFixed(1)}</div>
    </div>
    <div class="tool-result-stat">
      <span class="k">Category</span>
      <span class="v">${category}</span>
    </div>
  </div>
  <div class="tool-result-note">
    Based on your height and weight, you are in the <strong>${category}</strong> BMI range. Use this as a screening tool along with waist size, strength, and body-fat trends.
  </div>
  <div class="tool-result-grid">
    <div class="tool-result-stat">
      <span class="k">Healthy Weight Range</span>
      <span class="v">${healthyMin.toFixed(1)} - ${healthyMax.toFixed(1)} kg</span>
    </div>
    <div class="tool-result-stat">
      <span class="k">BMR</span>
      <span class="v">${Math.round(bmr)} kcal/day</span>
    </div>
    <div class="tool-result-stat">
      <span class="k">Maintenance Calories</span>
      <span class="v">${Math.round(maintenance)} kcal/day</span>
    </div>
    <div class="tool-result-stat">
      <span class="k">Suggested Direction</span>
      <span class="v">${getBmiSuggestion(bmi)}</span>
    </div>
  </div>`;

}

function calculateProtein(){
const weightInput = parseFloat(document.getElementById("bodyweight").value);
const unit = document.getElementById("weightUnit").value;
const goal = document.getElementById("goal").value;
const activity = document.getElementById("proteinActivity").value;
const meals = parseFloat(document.getElementById("mealsPerDay").value) || 4;
const result = document.getElementById("proteinResult");

if (!weightInput || weightInput <= 0) {
  result.className = "tool-result show";
  result.innerHTML = `
    <div class="tool-result-note">
      Please enter a valid body weight to calculate your daily protein target.
    </div>`;
  return;
}

const weightKg = unit === "lb" ? weightInput * 0.453592 : weightInput;
const goalBase = {
  maintain: 1.6,
  fatloss: 2.2,
  muscle: 1.8,
  recomposition: 2.0,
  endurance: 1.5
};
const activityAdj = {
  low: -0.1,
  moderate: 0,
  high: 0.2,
  athlete: 0.3
};
const gramsPerKg = Math.max(1.4, (goalBase[goal] || 1.6) + (activityAdj[activity] || 0));
const dailyProtein = weightKg * gramsPerKg;
const lowerRange = Math.max(weightKg * (gramsPerKg - 0.2), weightKg * 1.4);
const upperRange = weightKg * (gramsPerKg + 0.2);
const perMeal = dailyProtein / meals;

result.className = "tool-result show";
result.innerHTML = `
  <div class="tool-result-head">
    <div>
      <div class="tool-result-label">Daily Protein Target</div>
      <div class="tool-result-value">${Math.round(dailyProtein)}g</div>
    </div>
    <div class="tool-result-stat">
      <span class="k">Per Kg Target</span>
      <span class="v">${gramsPerKg.toFixed(1)} g/kg</span>
    </div>
  </div>
  <div class="tool-result-note">
    For a <strong>${formatGoal(goal)}</strong> goal with <strong>${formatActivity(activity)}</strong> activity, aim for a protein intake that stays within a useful performance range rather than chasing a single exact number.
  </div>
  <div class="tool-result-grid">
    <div class="tool-result-stat">
      <span class="k">Suggested Range</span>
      <span class="v">${Math.round(lowerRange)} - ${Math.round(upperRange)} g/day</span>
    </div>
    <div class="tool-result-stat">
      <span class="k">Per Meal</span>
      <span class="v">${Math.round(perMeal)} g across ${meals} meals</span>
    </div>
    <div class="tool-result-stat">
      <span class="k">Weight Used</span>
      <span class="v">${weightKg.toFixed(1)} kg</span>
    </div>
    <div class="tool-result-stat">
      <span class="k">Tip</span>
      <span class="v">${getProteinTip(goal)}</span>
    </div>
  </div>`;

}

function getBmiCategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Healthy";
  if (bmi < 30) return "Overweight";
  return "Obesity Range";
}

function getBmiSuggestion(bmi) {
  if (bmi < 18.5) return "Focus on steady calorie surplus";
  if (bmi < 25) return "Maintain or lean bulk/cut as needed";
  if (bmi < 30) return "Mild calorie deficit + strength work";
  return "Structured fat-loss phase is recommended";
}

function formatGoal(goal) {
  return {
    maintain: "maintenance",
    fatloss: "fat loss",
    muscle: "muscle gain",
    recomposition: "body recomposition",
    endurance: "endurance support"
  }[goal] || "maintenance";
}

function formatActivity(activity) {
  return {
    low: "low",
    moderate: "moderate",
    high: "high",
    athlete: "very high"
  }[activity] || "moderate";
}

function getProteinTip(goal) {
  if (goal === "fatloss") return "Keep protein high to protect lean muscle while dieting.";
  if (goal === "muscle") return "Spread protein across the day and pair it with progressive overload.";
  if (goal === "recomposition") return "Prioritize consistency and hit your protein target even on rest days.";
  if (goal === "endurance") return "Include protein after longer training sessions to help recovery.";
  return "Aim for evenly spaced protein feedings to improve muscle protein synthesis.";
}
