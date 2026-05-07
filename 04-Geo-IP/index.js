const API_URL = 'https://ipapi.co';

const ipInput = document.getElementById('ip-input');
const trackBtn = document.querySelector('#search-form [type="submit"]');
const errorMsg = document.getElementById('error-msg');
const results = document.getElementById('results');
const copyBtn = document.getElementById('copy-btn');

// ── Helpers ───────────────────────────────────────────────────────

const flagUrl = (code) =>
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

function renderResults({
  country_code,
  country_name,
  ip,
  city,
  region,
  timezone,
  org,
  latitude,
  longitude,
}) {
  const flagEl = document.getElementById('result-flag');
  flagEl.src = country_code ? flagUrl(country_code) : '';
  flagEl.alt = country_code ? `${country_name} flag` : '';

  document.getElementById('result-country').textContent = country_name ?? '—';
  document.getElementById('result-ip').textContent = ip;
  document.getElementById('result-city').textContent = city || '—';
  document.getElementById('result-region').textContent = region || '—';
  document.getElementById('result-timezone').textContent = timezone || '—';
  document.getElementById('result-isp').textContent = org || '—';
  document.getElementById('result-lat').textContent = latitude ?? '—';
  document.getElementById('result-lng').textContent = longitude ?? '—';
  document.getElementById('result-proxy').style.display = 'none';

  results.classList.remove('hidden');
  results.classList.add('fade-up');
}

// ── API ───────────────────────────────────────────────────────────

async function lookupIP(ip) {
  const url = ip ? `${API_URL}/${ip}/json/` : `${API_URL}/json/`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const data = await response.json();
  if (data.error) throw new Error(data.reason);

  return data;
}

// ── Search ────────────────────────────────────────────────────────

async function handleSearch() {
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

// ── Copy ──────────────────────────────────────────────────────────

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

  await navigator.clipboard.writeText(text);

  copyBtn.textContent = 'Copied!';

  setTimeout(() => {
    copyBtn.textContent = 'Copy Data';
  }, 2000);
});
