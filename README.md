# LittleSteps Preschool Network Task Portal

A lightweight task management portal for a preschool network company. It supports:

- Task creation with campus, department, assignee, priority, and due date.
- Status updates (`Open`, `In Progress`, `Completed`).
- Task filtering by status and priority.
- Dashboard metrics for workload visibility.
- Local persistence via `localStorage`.
- Light/dark theme toggle.

## Run locally

Open `index.html` directly in a browser, or serve the directory with any static server.

## Publish the portal (GitHub Pages)

This repository now includes an automated GitHub Pages workflow at `.github/workflows/deploy-pages.yml`.

1. Push this branch to GitHub.
2. In your repository settings, open **Pages** and set **Source** to **GitHub Actions**.
3. Ensure your default branch is one of: `main`, `master`, or `work` (or edit the workflow trigger branch list).
4. After each push, GitHub Actions will deploy the latest portal automatically.

Once deployed, the portal will be available at:

`https://<your-github-username>.github.io/<your-repository-name>/`
