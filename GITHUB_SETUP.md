# GitHub Repository Setup Guide

## Step 1: Create Repository on GitHub

1. Go to [GitHub](https://github.com)
2. Click the **+** icon (top right) → **New repository**
3. Enter repository details:
   - **Repository name:** `hyrup` (or your preferred name)
   - **Description:** Student Authentication System
   - **Visibility:** Choose **Public** (for portfolio) or **Private** (for confidential work)
   - **Initialize:** Leave unchecked (we'll push existing code)
4. Click **Create repository**

---

## Step 2: Initialize Git Locally

If you haven't initialized git in your project:

```bash
cd c:\Users\muthu\OneDrive\Desktop\hyrup
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

---

## Step 3: Add Files to Git

```bash
# Add all files
git add .

# Verify staged files
git status
```

**Expected output:** Shows package.json, server.js, models/, controllers/, etc.

---

## Step 4: Create Initial Commit

```bash
git commit -m "Initial commit: Student authentication system with JWT"
```

---

## Step 5: Add Remote Repository

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/hyrup.git
```

**Verify remote was added:**
```bash
git remote -v
```

---

## Step 6: Push to GitHub

For the first push, use:

```bash
git branch -M main
git push -u origin main
```

**Options:**
- Use `-u` flag to set upstream for future pushes
- Then you can just use `git push` for subsequent commits

---

## Step 7: Verify on GitHub

1. Go to `https://github.com/YOUR_USERNAME/hyrup`
2. Verify all files are there:
   - ✅ package.json
   - ✅ server.js
   - ✅ models/
   - ✅ controllers/
   - ✅ routes/
   - ✅ middleware/
   - ✅ config/
   - ✅ utils/
   - ✅ README.md
   - ✅ DOCUMENTATION.md
   - ✅ DATABASE_SCHEMA.md

---

## Ongoing Git Workflow

### Making Changes

```bash
# Make changes to files
# ...

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add logout endpoint and refresh token logic"

# Push to GitHub
git push
```

### Commit Message Examples

```bash
git commit -m "feat: add student registration endpoint"
git commit -m "fix: correct password validation in login"
git commit -m "docs: update README with API examples"
git commit -m "refactor: extract token generation to utility"
```

---

## .gitignore Verification

Ensure `.gitignore` file is in place to exclude:

```
node_modules/
.env
.DS_Store
logs/
```

This prevents sensitive files and dependencies from being committed.

---

## Useful Git Commands

```bash
# View commit history
git log --oneline

# View all branches
git branch -a

# View current status
git status

# Undo last commit (keep changes)
git reset --soft HEAD~1

# View differences
git diff

# Clone this repository
git clone https://github.com/YOUR_USERNAME/hyrup.git
```

---

## Making Your Repository Production-Ready

### Add Badges to README

```markdown
[![Node.js](https://img.shields.io/badge/Node.js-v14+-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.1-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-blue)](LICENSE)
```

### Create LICENSE File (Optional)

```bash
# MIT License example (create file named LICENSE)
MIT License

Copyright (c) 2024 Your Name

Permission is hereby granted, free of charge...
```

### Add Contributing Guidelines (Optional)

Create `CONTRIBUTING.md`:

```markdown
# Contributing to HYRUP

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
```

---

## Branching Strategy (Recommended)

```
main (production-ready)
  ↑
  ├── develop (development branch)
  |     ↑
  |     ├── feature/add-refresh-token
  |     ├── fix/login-validation
  |     └── docs/update-readme
```

**Commands:**

```bash
# Create feature branch
git checkout -b feature/add-logout-endpoint

# Switch back to develop
git checkout develop

# Merge feature into develop
git merge feature/add-logout-endpoint

# Push develop
git push origin develop
```

---

## Using GitHub Issues & Projects

### Create Issues for Tracking

1. Go to **Issues** tab on GitHub
2. Click **New issue**
3. Title: "Add password reset functionality"
4. Description: Detailed requirements
5. Add labels: `feature`, `enhancement`

### Link Commits to Issues

```bash
git commit -m "Add logout endpoint (#15)"
# Issue #15 will be automatically linked
```

---

## Protecting Main Branch (Recommended)

1. Go to repository **Settings**
2. Click **Branches** (left sidebar)
3. Under "Branch protection rules", click **Add rule**
4. Branch name pattern: `main`
5. Enable:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Include administrators
6. Click **Create**

---

## Secrets Management (for CI/CD)

If using GitHub Actions:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add secrets:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_ACCESS_SECRET`: Your JWT secret
   - `JWT_REFRESH_SECRET`: Your refresh secret

---

## Troubleshooting

### "fatal: 'origin' does not appear to be a 'git' repository"

**Solution:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/hyrup.git
```

### "Permission denied (publickey)"

**Solution:** Set up SSH keys
```bash
# Generate SSH key
ssh-keygen -t rsa -b 4096 -C "your.email@example.com"

# Add to GitHub Settings → SSH and GPG keys
# Use SSH URL instead:
git remote set-url origin git@github.com:YOUR_USERNAME/hyrup.git
```

### "Your branch is up-to-date but has differences"

**Solution:**
```bash
git pull origin main
git push origin main
```

---

## CI/CD Setup (Optional)

### GitHub Actions Workflow

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - run: npm install
    - run: npm test
```

---

## Repository Structure Summary

```
hyrup/
├── .git/                    (Git metadata)
├── .gitignore              (Files to exclude)
├── node_modules/           (Dependencies)
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── server.js
├── package.json
├── package-lock.json
├── .env                    (Not committed - add to .gitignore)
├── README.md
├── DOCUMENTATION.md
├── DATABASE_SCHEMA.md
├── POSTMAN_COLLECTION.json
└── GITHUB_SETUP.md         (This file)
```

---

## Repository Links

- **Repository:** `https://github.com/YOUR_USERNAME/hyrup`
- **Issues:** `https://github.com/YOUR_USERNAME/hyrup/issues`
- **Pull Requests:** `https://github.com/YOUR_USERNAME/hyrup/pulls`
- **Wiki:** `https://github.com/YOUR_USERNAME/hyrup/wiki` (optional)

---

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Enable branch protection on `main`
3. ✅ Add topics to repository (Settings → Topics)
4. ✅ Update GitHub profile with this project link
5. ✅ Consider adding GitHub Pages for documentation
6. ✅ Set up issue templates for contributors

---

**Your HYRUP project is now on GitHub! 🚀**
