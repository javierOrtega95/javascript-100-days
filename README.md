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

## Adding a project

1. **Create the folder** following the naming convention `NN-Project-Name/` with `index.html`, `style.css` and `index.js`.

2. **Add the back button** inside `<body>` so users can return to the demo page:

```html
<style>
  .back-btn {
    position: fixed; top: 1rem; left: 1rem;
    background: rgba(0,0,0,0.45); color: #fff;
    text-decoration: none; padding: .35rem .75rem;
    border-radius: 6px; font-size: 13px;
    font-family: system-ui, sans-serif;
    backdrop-filter: blur(8px); z-index: 1000;
    transition: background .15s;
  }
  .back-btn:hover { background: rgba(0,0,0,0.65); }
</style>
<a class="back-btn" href="../">← Back</a>
```

3. **Generate the thumbnail:**
   - Capture the project with [shot.so](https://shot.so) — 16:9, choose a background color
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
