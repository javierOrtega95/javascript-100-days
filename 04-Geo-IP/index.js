const API_URL = 'https://ipinfo.io';

const REGION_NAMES = new Intl.DisplayNames(['en'], { type: 'region' });

const ipInput = document.getElementById('ip-input');
const trackBtn = document.querySelector('#search-form [type="submit"]');
const errorMsg = document.getElementById('error-msg');
const results = document.getElementById('results');
const copyBtn = document.getElementById('copy-btn');

// ── Helpers ───────────────────────────────────────────────────────

const getFlagUrl = (code) =>
  `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove('hidden');

  results.classList.add('hidden');
}

function hideError() {
  errorMsg.classList.add('hidden');
}

// ── Render ────────────────────────────────────────────────────────

function renderResults({ country, ip, city, region, timezone, org, loc }) {
  const countryName = country ? (REGION_NAMES.of(country) ?? country) : '—';
  const [latitude, longitude] = (loc ?? '').split(',');
  const isp = org?.replace(/^AS\d+\s/, '') || '—';

  const flagEl = document.getElementById('result-flag');
  flagEl.src = country ? getFlagUrl(country) : '';
  flagEl.alt = country ? `${countryName} flag` : '';

  document.getElementById('result-country').textContent = countryName;
  document.getElementById('result-ip').textContent = ip;
  document.getElementById('result-city').textContent = city || '—';
  document.getElementById('result-region').textContent = region || '—';
  document.getElementById('result-timezone').textContent = timezone || '—';
  document.getElementById('result-isp').textContent = isp;
  document.getElementById('result-lat').textContent = latitude || '—';
  document.getElementById('result-lng').textContent = longitude || '—';
  document.getElementById('result-proxy').style.display = 'none';

  results.classList.remove('fade-up');
  void results.offsetWidth;
  results.classList.remove('hidden');
  results.classList.add('fade-up');
}

// ── API ───────────────────────────────────────────────────────────

async function lookupIP(ip) {
  const segment = ip ? encodeURIComponent(ip) : '';
  const url = segment ? `${API_URL}/${segment}/json` : `${API_URL}/json`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const data = await response.json();
  if (data.bogon) throw new Error('Private or reserved IP address');

  return data;
}

// ── Search ────────────────────────────────────────────────────────

async function handleSearch() {
  if (trackBtn.disabled) return;

  const ip = ipInput.value.trim();

  hideError();

  trackBtn.disabled = true;
  trackBtn.textContent = 'Tracking…';

  try {
    const data = await lookupIP(ip);
    renderResults(data);
  } catch {
    showError('Could not resolve IP. Check the address and try again.');
  } finally {
    trackBtn.disabled = false;
    trackBtn.textContent = 'Track IP';
  }
}

document.getElementById('search-form').addEventListener('submit', (event) => {
  event.preventDefault();

  handleSearch();
});

// ── Suggestions ──────────────────────────────────────────────────

document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    ipInput.value = chip.dataset.ip;
    handleSearch();
  });
});

// ── Copy ──────────────────────────────────────────────────────────

let copyResetTimer = null;

copyBtn.addEventListener('click', async () => {
  const get = (id) => document.getElementById(id).textContent;

  const text = [
    get('result-ip'),
    get('result-country'),
    `City:     ${get('result-city')}`,
    `Region:   ${get('result-region')}`,
    `Timezone: ${get('result-timezone')}`,
    `ISP:      ${get('result-isp')}`,
    `Lat:      ${get('result-lat')}`,
    `Lng:      ${get('result-lng')}`,
  ].join('\n');

  try {
    await navigator.clipboard.writeText(text);
    const label = copyBtn.querySelector('span');
    label.textContent = 'Copied!';
    clearTimeout(copyResetTimer);
    copyResetTimer = setTimeout(() => {
      label.textContent = 'Copy Data';
    }, 2000);
  } catch {
    showError('Could not copy to clipboard.');
  }
});
