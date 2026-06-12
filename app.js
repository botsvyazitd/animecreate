const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const state = {
  activeFrame: 0,
  frames: [
    { title: 'Открывающий кадр', duration: 2, action: 'Камера медленно показывает город фонарей и силуэт героя.' },
    { title: 'Появление героя', duration: 3, action: 'Герой достаёт светящийся клинок, ветер поднимает лепестки сакуры.' },
    { title: 'Конфликт', duration: 4, action: 'Теневые духи окружают площадь, герой делает первый рывок.' },
  ],
};

const ideas = [
  ['Небесный поезд', 'Киберпанк', 'Пилот дрона спасает город на летающем экспрессе во время неоновой бури.', 'Мика', 'Неоновая куртка, короткие розовые волосы, голографические очки', 'станция над облаками'],
  ['Сад духов', 'Фэнтези', 'Тихая хранительница сада возвращает память духам, потерянным после звездопада.', 'Юи', 'Длинные мятные волосы, кимоно с узорами листьев, посох с колокольчиком', 'магический сад с сияющими прудами'],
  ['Последний клуб манги', 'Повседневность', 'Школьники создают мангу за одну ночь, чтобы спасти любимый клуб.', 'Рэн', 'Школьная форма, взъерошенные волосы, карандаш за ухом', 'класс искусств под дождём'],
  ['Пульс арены', 'Сёнэн', 'Команда новичков выходит на турнир, где эмоции превращаются в боевые техники.', 'Кай', 'Красный плащ, спортивная броня, огненные перчатки', 'огромная арена с энергетическими экранами'],
];

function getProject() {
  return {
    title: $('#project-title').value.trim() || 'Без названия',
    genre: $('#genre').value,
    synopsis: $('#synopsis').value.trim(),
    character: $('#character-name').value.trim() || 'Герой',
    emotion: $('#emotion').value,
    appearance: $('#appearance').value.trim(),
    hairColor: $('#hair-color').value,
    outfitColor: $('#outfit-color').value,
    accentColor: $('#accent-color').value,
    visualStyle: $('#visual-style').value,
    camera: $('#camera').value,
    location: $('#location').value.trim(),
    motion: $('#motion').value,
    fps: $('#fps').value,
    frames: state.frames,
  };
}

function buildPrompt(project = getProject()) {
  const frameText = project.frames
    .map((frame, index) => `${index + 1}. ${frame.title} (${frame.duration}с): ${frame.action}`)
    .join('\n');

  return `Название: ${project.title}\nЖанр: ${project.genre}\nСинопсис: ${project.synopsis}\nПерсонаж: ${project.character}, эмоция — ${project.emotion}.\nВнешность: ${project.appearance}\nЛокация: ${project.location}\nСтиль: ${project.visualStyle}, ${project.camera}, выразительный аниме-свет, детализированный фон, чистая линия, кинематографичная композиция.\nДвижение: ${project.motion}% интенсивности, ${project.fps} fps.\n\nРаскадровка:\n${frameText}\n\nНегативный промпт: лишние пальцы, размытые лица, плохая анатомия, водяные знаки, текстовые артефакты.`;
}

function updatePreview() {
  const project = getProject();
  $('#preview-title').textContent = project.title;
  $('#prompt-output').value = buildPrompt(project);
  $('#motion-output').textContent = `${project.motion}%`;
  document.documentElement.style.setProperty('--primary', project.outfitColor);
  document.documentElement.style.setProperty('--primary-2', project.accentColor);
  $$('.preview-hair, .hair').forEach((el) => (el.style.background = project.hairColor));
  $$('.preview-body, .body').forEach((el) => (el.style.background = project.outfitColor));
  $$('.preview-blade, .sword').forEach((el) => (el.style.boxShadow = `0 0 26px ${project.accentColor}`));
  renderShotList();
  renderTimeline();
}

function renderShotList() {
  $('#shot-list').innerHTML = state.frames
    .map((frame, index) => `<li><strong>${index + 1}. ${frame.title}</strong><br>${frame.duration}с — ${frame.action}</li>`)
    .join('');
}

function renderTimeline() {
  const project = getProject();
  $('#frame-timeline').innerHTML = state.frames
    .map(
      (frame, index) => `
        <button class="frame-card ${index === state.activeFrame ? 'is-active' : ''}" type="button" data-frame="${index}">
          <span class="frame-thumb" style="--thumb-color:${project.outfitColor}"></span>
          <strong>${index + 1}. ${frame.title}</strong>
          <small>${frame.duration}с · ${project.camera}</small>
        </button>`,
    )
    .join('');
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('is-visible');
  setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

function addFrame() {
  const project = getProject();
  state.frames.push({
    title: `Кадр ${state.frames.length + 1}: ${project.emotion}`,
    duration: Math.max(1, Math.round(project.motion / 25)),
    action: `${project.character} в локации «${project.location}»: ${project.camera.toLowerCase()}, движение ${project.motion}%.`,
  });
  state.activeFrame = state.frames.length - 1;
  updatePreview();
  showToast('Кадр добавлен в таймлайн');
}

function randomizeIdea() {
  const idea = ideas[Math.floor(Math.random() * ideas.length)];
  $('#project-title').value = idea[0];
  $('#genre').value = idea[1];
  $('#synopsis').value = idea[2];
  $('#character-name').value = idea[3];
  $('#appearance').value = idea[4];
  $('#location').value = idea[5];
  $('#emotion').selectedIndex = Math.floor(Math.random() * $('#emotion').options.length);
  $('#visual-style').selectedIndex = Math.floor(Math.random() * $('#visual-style').options.length);
  $('#camera').selectedIndex = Math.floor(Math.random() * $('#camera').options.length);
  $('#motion').value = 35 + Math.floor(Math.random() * 60);
  updatePreview();
  showToast('Случайная идея готова');
}

function exportProject() {
  const blob = new Blob([JSON.stringify(getProject(), null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${getProject().title.replace(/\s+/g, '-').toLowerCase()}-anime-project.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast('JSON проекта скачан');
}

function importProject(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const project = JSON.parse(reader.result);
      $('#project-title').value = project.title || '';
      $('#genre').value = project.genre || 'Фэнтези';
      $('#synopsis').value = project.synopsis || '';
      $('#character-name').value = project.character || '';
      $('#emotion').value = project.emotion || 'Решимость';
      $('#appearance').value = project.appearance || '';
      $('#hair-color').value = project.hairColor || '#d8e8ff';
      $('#outfit-color').value = project.outfitColor || '#5946ff';
      $('#accent-color').value = project.accentColor || '#ff70c8';
      $('#visual-style').value = project.visualStyle || 'Кинематографичное аниме 90-х';
      $('#camera').value = project.camera || 'Средний план';
      $('#location').value = project.location || '';
      $('#motion').value = project.motion || 65;
      $('#fps').value = project.fps || 24;
      state.frames = Array.isArray(project.frames) && project.frames.length ? project.frames : state.frames;
      state.activeFrame = 0;
      updatePreview();
      showToast('Проект импортирован');
    } catch (error) {
      showToast('Не удалось импортировать JSON');
    }
  };
  reader.readAsText(file);
}

function bindEvents() {
  $('#anime-form').addEventListener('input', updatePreview);
  $('#fps').addEventListener('input', updatePreview);
  $('#generate-frame').addEventListener('click', addFrame);
  $('#randomize').addEventListener('click', randomizeIdea);
  $('#load-demo').addEventListener('click', randomizeIdea);
  $('#copy-prompt').addEventListener('click', async () => {
    await navigator.clipboard.writeText($('#prompt-output').value);
    showToast('Промпт скопирован');
  });
  $('#export-json').addEventListener('click', exportProject);
  $('#import-json').addEventListener('click', () => $('#import-file').click());
  $('#import-file').addEventListener('change', (event) => importProject(event.target.files[0]));
  $('#play-animation').addEventListener('click', () => {
    document.body.classList.toggle('is-playing');
    $('#play-animation').textContent = document.body.classList.contains('is-playing') ? '⏸ Остановить' : '▶ Воспроизвести';
  });
  $('#duplicate-frame').addEventListener('click', () => {
    const copy = { ...state.frames[state.activeFrame], title: `${state.frames[state.activeFrame].title} копия` };
    state.frames.splice(state.activeFrame + 1, 0, copy);
    state.activeFrame += 1;
    updatePreview();
    showToast('Кадр дублирован');
  });
  $('#remove-frame').addEventListener('click', () => {
    if (state.frames.length === 1) return showToast('Нужен хотя бы один кадр');
    state.frames.splice(state.activeFrame, 1);
    state.activeFrame = Math.max(0, state.activeFrame - 1);
    updatePreview();
    showToast('Кадр удалён');
  });
  $('#frame-timeline').addEventListener('click', (event) => {
    const card = event.target.closest('[data-frame]');
    if (!card) return;
    state.activeFrame = Number(card.dataset.frame);
    renderTimeline();
  });
  $$('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      $$('.tab, .tab-panel').forEach((item) => item.classList.remove('is-active'));
      tab.classList.add('is-active');
      $(`#tab-${tab.dataset.tab}`).classList.add('is-active');
    });
  });
  $('.nav-toggle').addEventListener('click', () => {
    const menu = $('#main-menu');
    const isOpen = menu.classList.toggle('is-open');
    $('.nav-toggle').setAttribute('aria-expanded', String(isOpen));
  });
  $('#anime-form').addEventListener('reset', () => setTimeout(updatePreview));
}

bindEvents();
updatePreview();
