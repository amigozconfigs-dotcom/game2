let score = 0;
const scoreEl = document.getElementById("score");
const tapBtn = document.getElementById("tapBtn");

tapBtn.addEventListener("click", () => {
  score++;
  scoreEl.textContent = score;
});

// --- Задания: безопасный скрипт (вставь в свой game.js или в <script>) ---
(function(){
  if (window.__questsInit) return;
  window.__questsInit = true;

  function safeLog(...args){ console.log('[quests]', ...args); }

  function initWhenReady(fn){
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  initWhenReady(function(){
    try {
      // Не перезаписываем существующие коины
      if (typeof window.coins === 'undefined') window.coins = 0;

      // Используй существующий контейнер #quests если есть, иначе создаём
      let questsContainer = document.getElementById('quests');
      if (!questsContainer) {
        questsContainer = document.createElement('div');
        questsContainer.id = 'quests';
        // пытаемся вставить после элемента с id "coins" если он есть
        const after = document.getElementById('coins');
        if (after && after.parentNode) after.parentNode.insertBefore(questsContainer, after.nextSibling);
        else document.body.appendChild(questsContainer);
        safeLog('#quests не найден — создан автоматически');
      }

      // Монитор отображения коинов (если есть элемент)
      const coinsDisplay = document.getElementById('coins') || null;
      function updateCoinsDisplay(){
        if (coinsDisplay) coinsDisplay.textContent = 'амг койны: ' + window.coins;
      }

      // Список заданий (можешь заменить/добавить свои)
      window.quests = window.quests || [
        { goal: 100, reward: 300, done: false },
        { goal: 200, reward: 500, done: false },
        { goal: 500, reward: 1000, done: false }
      ];

      // Создаём модалку, если её нет
      let modal = document.getElementById('questModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'questModal';
        Object.assign(modal.style, {
          display: 'none', position: 'fixed', left:0, top:0, width:'100%', height:'100%',
          background:'rgba(0,0,0,0.6)', zIndex: 9999
        });
        const inner = document.createElement('div');
        Object.assign(inner.style, {
          background:'#fff', color:'#000', width:'320px', margin:'8% auto', padding:'16px', borderRadius:'10px', textAlign:'center', position:'relative'
        });
        inner.innerHTML = `
          <span id="qClose" style="position:absolute;right:10px;top:6px;cursor:pointer;color:#900;font-weight:bold">✖</span>
          <h3 class="modal-title"></h3>
          <p class="modal-reward"></p>
          <p class="modal-status"></p>
          <div style="margin-top:12px;">
            <button class="claim-btn" style="padding:8px 12px;cursor:pointer;">Забрать награду</button>
            <button class="close-btn" style="padding