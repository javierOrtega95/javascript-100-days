import { projects } from './projects.js';

const $projects = document.querySelector('#projects');

$projects.innerHTML = projects
  .map(
    ({ id, title, description, tags, thumbnail, demo, code }) => `
  <li class="project-card">
    <div class="project-thumb">
      ${thumbnail ? `<img src="${thumbnail}" alt="${title}" loading="lazy" />` : `<span class="thumb-placeholder">${id}</span>`}
    </div>
    <div class="project-content">
      <div>
        <div class="project-meta">
          <span class="project-num">#${id}</span>
          <h2 class="project-title"><a href="${demo}">${title}</a></h2>
        </div>
        <p class="project-desc">${description}</p>
        <ul class="project-tags">
          ${tags.map((tag) => `<li>${tag}</li>`).join('')}
        </ul>
      </div>
      <div class="project-links">
        <a class="link-demo" href="${demo}">Demo →</a>
        <a class="link-code" href="${code}" target="_blank" rel="noopener">Code</a>
      </div>
    </div>
  </li>`
  )
  .join('');
