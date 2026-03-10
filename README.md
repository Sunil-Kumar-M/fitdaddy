# FitDaddy

Static fitness website deployed with GitHub Pages.

## Current Stack

- HTML
- CSS
- Vanilla JavaScript
- GitHub Pages

## Project Standards

- Use semantic HTML where possible.
- Keep line endings as `LF`.
- Use 2-space indentation for HTML, CSS, and JavaScript.
- Prefer clear class names over short or cryptic names in new code.
- Keep presentation in CSS and behavior in JavaScript.
- Avoid inline styles and inline event handlers in new code when updating existing features.
- Reuse design tokens from `:root` instead of hardcoding colors.

## Project Structure

The homepage is organized as a simple static site:

```text
.
|-- index.html
|-- assets/
|   |-- css/
|   |   `-- styles.css
|   `-- js/
|       `-- app.js
`-- .github/
    `-- workflows/
        `-- pages.yml
```

## Deployment

The site is deployed through GitHub Pages using the workflow in `.github/workflows/pages.yml`.
