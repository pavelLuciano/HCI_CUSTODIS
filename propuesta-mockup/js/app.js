const custodisData = window.CustodisData || { recordings: [], collections: [], permProjects: [] };
const recordings = custodisData.recordings;
const collections = custodisData.collections;
const permProjects = custodisData.permProjects;

let wavesurfer = null;
let uploadedFiles = [];

const permDescriptions = {
  public: 'Cualquier visitante puede escuchar, pero no descargar.',
  registrado: 'Usuarios con cuenta pueden escuchar y descargar en MP3.',
  investigador: 'Los usuarios con cuenta verificada pueden descargar en WAV/FLAC.',
  admin: 'Solo el administrador puede acceder y gestionar los archivos.',
};

function navigate(view, data) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById('view-' + view);
  if (target) {
    target.classList.add('active');
  }

  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const navLink = document.querySelector('.nav-links a[data-nav="' + view + '"]');
  if (navLink) navLink.classList.add('active');

  window.scrollTo(0, 0);

  if (view === 'explorer') {
    renderRecordings();
  } else if (view === 'detail' && data) {
    loadDetail(data);
  } else if (view === 'permissions') {
    renderPermissions();
  } else if (view === 'collections') {
    renderCollections();
  }
}

function renderMiniWaveform(seed) {
  const bars = [];
  let value = seed * 97 + 13;

  for (let index = 0; index < 24; index += 1) {
    value = (value * 37 + 17) % 101;
    const height = 10 + (value % 28);
    const played = index % 5 === 0 ? ' played' : '';
    bars.push('<span class="wave-bar' + played + '" style="height:' + height + 'px"></span>');
  }

  return bars.join('');
}

function durationToSeconds(durationText) {
  const parts = durationText.split(':').map(Number);
  if (parts.length !== 2 || parts.some(Number.isNaN)) return 0;
  return parts[0] * 60 + parts[1];
}

function sortRecordings(list, sortLabel) {
  const sorted = [...list];

  if (sortLabel === 'Más recientes') {
    return sorted.sort((a, b) => b.date.localeCompare(a.date));
  }

  if (sortLabel === 'Más antiguas') {
    return sorted.sort((a, b) => a.date.localeCompare(b.date));
  }

  if (sortLabel === 'Mayor duración') {
    return sorted.sort((a, b) => durationToSeconds(b.duration) - durationToSeconds(a.duration));
  }

  return sorted;
}

function formatDate(dateText) {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const parts = dateText.split('-');
  return parseInt(parts[2], 10) + ' ' + months[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
}

function formatPlaybackTime(seconds) {
  const safeSeconds = Number.isFinite(seconds) ? seconds : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const remaining = Math.floor(safeSeconds % 60);
  return minutes + ':' + String(remaining).padStart(2, '0');
}

function updateDetailProgress(currentTime) {
  if (!wavesurfer) return;

  const duration = wavesurfer.getDuration() || 0;
  const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const progressFill = document.getElementById('detailProgressFill');
  const currentTimeLabel = document.getElementById('detailTimeCurrent');
  const totalTimeLabel = document.getElementById('detailTimeTotal');

  if (progressFill) progressFill.style.width = percentage + '%';
  if (currentTimeLabel) currentTimeLabel.textContent = formatPlaybackTime(currentTime);
  if (totalTimeLabel) totalTimeLabel.textContent = formatPlaybackTime(duration);
}

function setDetailPlayIcon(isPlaying) {
  const icon = document.getElementById('detailPlayIcon');
  if (!icon) return;

  icon.innerHTML = isPlaying
    ? '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>'
    : '<polygon points="6 3 20 12 6 21 6 3"/>';
}

function renderRecordings(filteredList) {
  const list = sortRecordings(filteredList || recordings, document.getElementById('sortSelect')?.value || 'Relevancia');
  const container = document.getElementById('resultsList');
  if (!container) return;

  const resultsCount = document.getElementById('resultsCount');
  if (resultsCount) {
    resultsCount.textContent = list.length + ' resultado' + (list.length !== 1 ? 's' : '') + ' encontrado' + (list.length !== 1 ? 's' : '');
  }

  if (list.length === 0) {
    container.innerHTML = '<div class="empty-state"><h3>No encontramos grabaciones con esos filtros</h3><p>Prueba ampliar la zona o quitar alguno.</p></div>';
    return;
  }

  container.innerHTML = list.map(r => {
    const wfId = 'wf_' + r.id;
    return '<div class="recording-card" onclick="navigate(\'detail\',' + r.id + ')" style="cursor:pointer">' +
      '<div class="recording-card-header">' +
        '<h3>' + r.title + '</h3>' +
        '<span class="format-badge">' + r.format + ' · ' + r.size + '</span>' +
      '</div>' +
      '<div class="recording-meta">' +
        '<span>📍 ' + r.location + '</span>' +
        '<span>📁 ' + r.files + ' Archivos</span>' +
        '<span>📅 ' + formatDate(r.date) + '</span>' +
        '<span> ' + r.duration + '</span>' +
      '</div>' +
      '<div class="waveform-row" onclick="event.stopPropagation();togglePlay(' + r.id + ',\'' + wfId + '\')">' +
        '<button class="play-btn" id="playBtn' + r.id + '">▶</button>' +
        '<div class="waveform" id="' + wfId + '">' + renderMiniWaveform(r.id) + '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function togglePlay(id, wfId) {
  const btn = document.getElementById('playBtn' + id);
  const waveform = document.getElementById(wfId);
  if (!btn || !waveform) return;

  const isPlaying = btn.textContent.trim() === '⏸';

  document.querySelectorAll('.play-btn').forEach(button => {
    button.textContent = '▶';
  });
  document.querySelectorAll('.waveform').forEach(wave => wave.classList.remove('playing'));

  if (!isPlaying) {
    btn.textContent = '⏸';
    waveform.classList.add('playing');
    showToast('Reproduciendo audio...', 'info');
  }
}

function loadDetail(id) {
  const recording = recordings.find(item => item.id === id) || recordings[0];
  if (!recording) return;

  if (wavesurfer) {
    wavesurfer.destroy();
    wavesurfer = null;
  }

  const waveformContainer = document.getElementById('detailWaveform');
  if (waveformContainer) {
    waveformContainer.innerHTML = '';
  }

  const title = document.getElementById('detailTitle');
  const size = document.getElementById('detailSize');
  const location = document.getElementById('detailLocation');
  const subtitle = document.getElementById('detailSubtitle');
  const metaList = document.getElementById('detailMetaList');

  if (title) title.textContent = recording.title;
  if (size) size.textContent = recording.size;
  if (location) location.textContent = recording.location + ', Chile';

  if (subtitle) {
    subtitle.innerHTML =
      '<span>📍 ' + recording.location + '</span>' +
      '<span>📁 ' + recording.files + ' Archivos</span>' +
      '<span>📅 ' + formatDate(recording.date) + '</span>' +
      '<span>🕐 ' + recording.duration + '</span>';
  }

  if (metaList) {
    metaList.innerHTML =
      '<div class="meta-item">' +
        '<span class="meta-label">Especie</span>' +
        '<span class="meta-value">' + recording.species + '</span>' +
      '</div>' +
      '<div class="meta-item">' +
        '<span class="meta-label">Fecha de captura</span>' +
        '<span class="meta-value">' + formatDate(recording.date) + ' — 06:15 AM</span>' +
      '</div>' +
      '<div class="meta-item">' +
        '<span class="meta-label">Dispositivo</span>' +
        '<span class="meta-value">' + recording.device + '</span>' +
      '</div>' +
      '<div class="meta-item">' +
        '<span class="meta-label">Proyecto</span>' +
        '<span class="meta-value">' + recording.project + '</span>' +
      '</div>';
  }

  updateDetailProgress(0);
  setDetailPlayIcon(false);

  const audioUrl = 'assets/audio_prueba.mp3';
  wavesurfer = WaveSurfer.create({
    container: '#detailWaveform',
    waveColor: '#BFBFBF',
    progressColor: '#2E75B6',
    height: 80,
    barWidth: 3,
    barGap: 2,
    barRadius: 2,
    normalize: true,
    cursorWidth: 0,
    fillParent: true,
  });

  wavesurfer.on('ready', () => {
    updateDetailProgress(0);
  });

  wavesurfer.on('timeupdate', currentTime => {
    updateDetailProgress(currentTime);
  });

  wavesurfer.on('play', () => {
    setDetailPlayIcon(true);
  });

  wavesurfer.on('pause', () => {
    setDetailPlayIcon(false);
  });

  wavesurfer.on('finish', () => {
    updateDetailProgress(0);
    setDetailPlayIcon(false);
  });

  wavesurfer.on('error', () => {
    showToast('No se pudo cargar el audio de prueba.', 'error');
  });

  wavesurfer.load(audioUrl);
}

function toggleDetailPlay() {
  if (!wavesurfer) return;
  wavesurfer.playPause();
}

function seekDetail(event) {
  if (!wavesurfer) return;

  const rect = event.currentTarget.getBoundingClientRect();
  const ratio = (event.clientX - rect.left) / rect.width;
  wavesurfer.seekTo(Math.max(0, Math.min(1, ratio)));
}

function handleDownload() {
  showToast('Inicia sesión para descargar este archivo', 'info');
  setTimeout(() => openModal('login'), 800);
}

function applyFilters() {
  const region = document.getElementById('filterRegion')?.value || '';
  const species = (document.getElementById('filterSpecies')?.value || '').toLowerCase();
  const dateFrom = document.getElementById('filterDateFrom')?.value || '';
  const dateTo = document.getElementById('filterDateTo')?.value || '';
  const ecosistemas = Array.from(document.querySelectorAll('.checkbox-group input:checked')).map(cb => cb.value);

  const filtered = recordings.filter(recording => {
    if (region && recording.region !== region) return false;
    if (species && !recording.species.toLowerCase().includes(species) && !recording.title.toLowerCase().includes(species)) return false;
    if (dateFrom && recording.date < dateFrom) return false;
    if (dateTo && recording.date > dateTo) return false;

    if (ecosistemas.length > 0) {
      const ecosystemMatch = ecosistemas.some(option => recording.ecosystem.toLowerCase().includes(option));
      if (!ecosystemMatch) return false;
    }

    return true;
  });

  renderRecordings(filtered);
  showToast(filtered.length + ' resultado' + (filtered.length !== 1 ? 's' : '') + ' encontrado' + (filtered.length !== 1 ? 's' : ''), 'info');
}

const dropZone = document.getElementById('dropZone');
if (dropZone) {
  dropZone.addEventListener('dragover', event => {
    event.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

  dropZone.addEventListener('drop', event => {
    event.preventDefault();
    dropZone.classList.remove('dragover');
    handleFiles(event.dataTransfer.files);
  });

  dropZone.addEventListener('click', event => {
    if (event.target.tagName !== 'BUTTON' && event.target.tagName !== 'INPUT') {
      document.getElementById('fileInput').click();
    }
  });
}

function handleFiles(files) {
  const list = document.getElementById('fileList');
  if (!list) return;

  Array.from(files).forEach((file, index) => {
    const id = 'file_' + Date.now() + '_' + index;
    uploadedFiles.push({ id, name: file.name, size: (file.size / 1024 / 1024).toFixed(1) });

    const item = document.createElement('div');
    item.className = 'file-item';
    item.id = id;
    item.innerHTML =
      '<span class="file-item-icon">🎵</span>' +
      '<span class="file-item-name">' + file.name + '</span>' +
      '<span class="file-item-size">' + (file.size / 1024 / 1024).toFixed(1) + ' MB</span>' +
      '<span class="file-item-status" id="status_' + id + '">Subiendo...</span>' +
      '<div class="progress-bar"><div class="progress-fill" id="progress_' + id + '" style="width:0%"></div></div>';
    list.appendChild(item);
    simulateUpload(id);
  });
}

function simulateUpload(id) {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    const progressFill = document.getElementById('progress_' + id);
    const statusLabel = document.getElementById('status_' + id);

    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      if (progressFill) progressFill.style.width = '100%';
      if (statusLabel) {
        statusLabel.textContent = '✓ Completo';
        statusLabel.style.color = 'var(--secondary)';
      }
    } else if (progressFill) {
      progressFill.style.width = progress + '%';
    }
  }, 200);
}

function selectPerm(element) {
  document.querySelectorAll('.perm-option').forEach(option => option.classList.remove('selected'));
  element.classList.add('selected');
  element.querySelector('input').checked = true;
}

function publishRecording() {
  const title = document.getElementById('uploadTitle').value;
  const date = document.getElementById('uploadDate').value;

  if (!title) {
    showToast('Falta el título de la grabación. Complétalo para poder publicar.', 'error');
    return;
  }

  if (!date) {
    showToast('Falta la fecha de captura. Complétala para poder publicar.', 'error');
    return;
  }

  if (uploadedFiles.length === 0) {
    showToast('Selecciona al menos un archivo de audio.', 'error');
    return;
  }

  showToast('Grabación publicada correctamente.', 'success');
  setTimeout(() => navigate('explorer'), 1200);
}

function resetUpload() {
  document.getElementById('uploadTitle').value = '';
  document.getElementById('uploadSpecies').value = '';
  document.getElementById('uploadDate').value = '';
  document.getElementById('uploadCoords').value = '';
  document.getElementById('uploadDevice').value = '';
  document.getElementById('fileList').innerHTML = '';
  document.getElementById('fileInput').value = '';
  uploadedFiles = [];
  showToast('Formulario reiniciado', 'info');
}

function renderPermissions() {
  const tbody = document.getElementById('permTableBody');
  if (!tbody) return;

  tbody.innerHTML = permProjects.map(project =>
    '<tr>' +
      '<td>' +
        '<div class="proj-name">' + project.name + '</div>' +
        '<div class="proj-date">creado el ' + project.date + '</div>' +
      '</td>' +
      '<td>' + project.files + ' archivos</td>' +
      '<td>' +
        '<select class="perm-select" id="permSelect' + project.id + '" onchange="updatePermDesc(' + project.id + ', this.value)">' +
          '<option value="public" ' + (project.level === 'public' ? 'selected' : '') + '>Público</option>' +
          '<option value="registrado" ' + (project.level === 'registrado' ? 'selected' : '') + '>Usuarios Registrados</option>' +
          '<option value="investigador" ' + (project.level === 'investigador' ? 'selected' : '') + '>Investigadores Registrados</option>' +
          '<option value="admin" ' + (project.level === 'admin' ? 'selected' : '') + '>Solo Administrador</option>' +
        '</select>' +
        '<div class="perm-desc" id="permDesc' + project.id + '">' + project.desc + '</div>' +
      '</td>' +
      '<td><button class="btn btn-ghost" onclick="savePerm(' + project.id + ')">Guardar cambios</button></td>' +
    '</tr>'
  ).join('');
}

function updatePermDesc(id, level) {
  const element = document.getElementById('permDesc' + id);
  if (element) element.textContent = permDescriptions[level] || '';
}

function savePerm(id) {
  const project = permProjects.find(item => item.id === id);
  const select = document.getElementById('permSelect' + id);
  if (!project || !select) return;

  const level = select.value;
  project.level = level;
  const label = level === 'public' ? 'todos los visitantes' : level === 'registrado' ? 'usuarios registrados' : level === 'investigador' ? 'investigadores registrados' : 'el administrador';
  showToast('Listo. Ahora este proyecto está disponible para ' + label + '.', 'success');
}

function renderCollections() {
  const container = document.getElementById('allCollections');
  if (!container) return;

  container.innerHTML = collections.map(collection =>
    '<div class="col-card" onclick="navigate(\'explorer\')">' +
      '<div class="col-card-img" style="background-image:url(\'' + collection.img + '\')"></div>' +
      '<div class="col-card-body">' +
        '<h4>' + collection.name + '</h4>' +
        '<p>' + collection.project + ' · ' + collection.files + ' Archivos</p>' +
        '<span class="ver-mas">Ver más →</span>' +
      '</div>' +
    '</div>'
  ).join('');
}

function openModal(name) {
  const modal = document.getElementById(name + 'Modal');
  if (modal) modal.classList.add('active');
}

function closeModal(name) {
  const modal = document.getElementById(name + 'Modal');
  if (modal) modal.classList.remove('active');
}

document.querySelectorAll('.modal-overlay').forEach(modal => {
  modal.addEventListener('click', event => {
    if (event.target === modal) modal.classList.remove('active');
  });
});

function showToast(message, type) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast ' + (type || 'info');
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  toast.innerHTML = '<span style="font-weight:700;font-size:16px">' + (icons[type] || 'ℹ') + '</span><span>' + message + '</span>';
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = '.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function toggleMobileNav() {
  document.getElementById('mobileNav').classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {
  renderRecordings();
});
