<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./banner-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="./banner-light.png">
  <img src="./banner-dark.png" alt="JavaScript 100 Days">
</picture>

A collection of projects to improve JavaScript skills and practice HTML and CSS concepts. Each project covers different web development aspects, from basic to advanced.

## How to Run

No build step required. Open any project's `index.html` directly in a browser, or use a local server (e.g. [VS Code Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)).

## Structure

Each project lives in its own folder:

```
project-name/
├── index.html
├── style.css
└── index.js
```

## Projects

| #   | Project                                    |
| --- | ------------------------------------------ |
| 01  | [Tinder Swipe](./01-Tinder-Swipe/)         |
| 02  | [Arkanoid Game](./02-Arkanoid-Game/)       |
| 03  | [Monkeytype Clone](./03-Monkeytype-Clone/) |
| 04  | [Geo IP](./04-Geo-IP/)                     |

## Workflow

Each project is developed on its own branch and merged into `main` via pull request. Direct commits to `main` are not allowed.

```bash
git checkout -b feat/04-project-name
# ... develop the project ...
git push origin feat/04-project-name
# open a PR → merge into main
```

## Adding a project

1. **Create the folder** following the naming convention `NN-Project-Name/` with `index.html`, `style.css` and `index.js`.

2. **Add the site nav** inside `<body>` and link `shared.css` in `<head>`:

```html
<link rel="stylesheet" href="../shared.css" />
```

```html
<nav class="site-nav">
  <a class="site-nav__logo" href="../">
    <span class="site-nav__number">100</span>
    <span class="site-nav__badge">JS</span>
    <span class="site-nav__label">days</span>
  </a>
  <a class="site-nav__back" href="../">← Back</a>
</nav>
```

3. **Generate the thumbnail:**
   - Capture the project with [shots.so](https://shots.so) — 16:9, choose a background color
   - Optimize with [squoosh.app](https://squoosh.app) → WebP, 400×225px, uncheck "Maintain aspect ratio"
   - Save as `assets/thumbnails/NN.webp`

4. **Register the project** in `projects.js`:

```js
{
  id: 'NN',
  title: 'Project Name',
  description: 'Short description.',
  tags: ['Tag1', 'Tag2'],
  thumbnail: './assets/thumbnails/NN.webp',
  demo: './NN-Project-Name/',
  code: 'https://github.com/javierOrtega95/javascript-100-days/tree/main/NN-Project-Name',
}
```
