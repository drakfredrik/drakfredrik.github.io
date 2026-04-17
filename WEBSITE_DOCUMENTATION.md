# NORDPAPP Website Documentation

## 1. Overview
This website is a static site built with:

- [Eleventy (11ty)](https://www.11ty.dev/) for templates and content rendering
- [Nunjucks](https://mozilla.github.io/nunjucks/) for layouts/components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- GitHub Actions for CI/CD and deployment to GitHub Pages

Build output is generated in `dist/`.

---

## 2. Project Structure

```text
.
|-- .eleventy.js
|-- package.json
|-- tailwind.config.js
|-- .github/workflows/build.yml
|-- src/
|   |-- index.njk
|   |-- _data/
|   |   `-- site.yaml
|   |-- _includes/
|   |   |-- base.njk
|   |   |-- section-hero.njk
|   |   `-- section-columns.njk
|   |-- content/
|   |   |-- 01-hero.md
|   |   |-- 02-what-we-do.md
|   |   |-- 03-why-us.md
|   |   `-- content.json
|   |-- css/
|   |   |-- input.css
|   |   `-- styles.css
|   `-- images/
`-- dist/ (generated)
```

---

## 3. How It Is Built

### 3.1 Build Configuration
Build behavior is configured in `.eleventy.js`:

- Input folder: `src/`
- Output folder: `dist/`
- Content collection: all markdown files in `src/content/*.md`
- Collection sorting: by front matter `order`
- Passthrough assets:
  - `src/images` -> `dist/images`
  - `src/css/styles.css` -> `dist/css/styles.css`

### 3.2 NPM Scripts
From `package.json`:

- `npm run build:css`
  - Compiles Tailwind from `src/css/input.css` to `src/css/styles.css` (minified)
- `npm run build`
  - Runs CSS build, then Eleventy build
- `npm run start`
  - Runs Tailwind watcher and Eleventy dev server concurrently

### 3.3 Local Development

```bash
npm install
npm run start
```

This gives you live CSS rebuild + Eleventy server.

### 3.4 Production Build

```bash
npm ci
npm run build
```

Static site is produced in `dist/`.

---

## 4. Where To Put Images

Place images in:

- `src/images/`

Because of Eleventy passthrough copy, they become available at:

- `/images/<filename>` in the built site

Examples already used:

- `/images/favicon.png`
- `/images/nordpapp-logo.png`
- `/images/nordpapp-symbol.png`
- `/images/hero-bg.jpg`

### 4.1 Usage in Templates or Markdown

In templates:

```njk
<img src="/images/my-image.jpg" alt="Description" />
```

In section front matter (hero background):

```yaml
backgroundImage: /images/my-hero.jpg
```

---

## 5. How To Add A Section

Sections are markdown files in `src/content/`. They are rendered in `src/index.njk` by iterating over `collections.sections`.

## 5.1 Add Another Existing Type (`hero` or `columns`)

1. Create a new markdown file in `src/content/`, for example:

   - `04-new-section.md`

2. Add front matter with an `order` and supported `type`.

### Example: Hero Section

```md
---
order: 4
type: hero
backgroundImage: /images/new-hero.jpg
---

# New Hero Title

Short supporting text.
```

### Example: Columns Section

```md
---
order: 5
type: columns
title: New Columns Section
columns:
  - title: First Column
    text: First column description.
  - title: Second Column
    text: Second column description.
  - title: Third Column
    text: Third column description.
---

Optional intro markdown text shown above the columns.
```

3. Save and run `npm run start` (or rebuild) to see it.

The `order` value controls the section order on the page.

## 5.2 Add A New Section Type (New Template)

If you need a new design type (for example `quote`, `gallery`, etc.):

1. Create a new include template in `src/_includes/`, e.g.:

   - `section-quote.njk`

2. Update `src/index.njk` and add a new branch:

```njk
{% elif section.data.type == "quote" %}
  {% include "section-quote.njk" %}
```

3. Create a matching content file in `src/content/` with:

```yaml
type: quote
```

4. Add any required front matter fields that your new template expects.

---

## 6. Site-Wide Data

Global text values are in:

- `src/_data/site.yaml`

Current keys:

- `name` (used in title/logo alt text)
- `footer` (used in footer text)

---

## 7. Styling

Tailwind config is in `tailwind.config.js`.

- Content scan paths include Nunjucks/HTML/Markdown in `src/`
- Custom colors are defined under `theme.extend.colors`

Main CSS entry:

- `src/css/input.css` (Tailwind directives)

Generated CSS output:

- `src/css/styles.css` (minified build artifact)

---

## 8. Build And Deploy With GitHub Actions

Workflow file:

- `.github/workflows/build.yml`

### 8.1 Current Workflow Behavior

On every push to `main`, the workflow:

1. Checks out code
2. Sets up Node.js 20
3. Runs `npm ci`
4. Builds Tailwind CSS
5. Builds Eleventy
6. Deploys `dist/` to GitHub Pages using `peaceiris/actions-gh-pages`

### 8.2 Requirements

- Repository must allow GitHub Actions to write pages content
- `GITHUB_TOKEN` is used automatically (already configured by default in GitHub Actions)
- Pages should be configured to serve from the branch created/updated by the action (commonly `gh-pages`)

### 8.3 Typical GitHub Pages Settings

In GitHub repository settings:

1. Go to **Settings -> Pages**
2. Source: **Deploy from a branch**
3. Branch: `gh-pages` (root)

After that, pushes to `main` auto-deploy.

---

## 9. Quick Content Update Checklist

1. Add/update section markdown in `src/content/`
2. Add any new images to `src/images/`
3. Run local preview with `npm run start`
4. Commit and push to `main`
5. GitHub Actions builds and deploys automatically

---

## 10. Common Pitfalls

- Wrong image path: use absolute web path `/images/...`, not local file paths
- Missing `order`: section may appear in unexpected position
- Unsupported `type`: section will not render unless handled in `src/index.njk`
- Editing only `styles.css`: remember it is generated; source of truth is `src/css/input.css` and class usage in templates/content
