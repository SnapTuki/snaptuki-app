# SnapTuki CI/CD Pipeline (MVP Strategy)

This document outlines the Continuous Integration and Continuous Deployment (CI/CD) strategy for the complete SnapTuki elder-care platform.

To maintain a lean, high-velocity workflow for the MVP phase, we utilize independent GitHub Actions pipelines for the frontend and backend. These pipelines are decoupled using **path filtering** so that backend domain changes do not trigger frontend builds, and vice-versa. Staging environments are bypassed in favor of rapid deployment directly to production upon merging to the `main` branch.

---

## 🏗 Architecture Overview

Our pipeline is divided into independent workflows triggered by specific directory changes:
1. **Backend CI/CD:** Triggered by changes in the `apps/api/**` directory. Handles the Node.js application, Prisma schemas, and Dockerized testing.
2. **Frontend CI/CD:** Triggered by changes in the `apps/staff-portal/**` directory. Handles UI component testing and building the Nginx production container.

---

## (Docker-First Strategy)

We utilize a **Multi-Stage Dockerfile** combined with `docker-compose.test.yml`. This guarantees 100% parity between a developer's local machine and the GitHub Actions server. The test environment is fully containerized, preventing "it works on my machine" bugs.
We will use cross-platform powershell to run build process with one command!

### Phase 1: Continuous Integration (The PR Pipeline)
Ensures no breaking changes, failing use cases, or invalid Prisma schemas make it into the production branch.

**Trigger:** Opening or updating a Pull Request with changes in codes.

**Workflow Steps:**
1. **Local Development:** Developer creates branches and works on features .
2. **Local build:** Developer runs a build script locally to get fast feedback and fix bugs before running on GithubActions servers. By running `./build.ps1` command the app will be build and run Unite and Integration tests.
3. **Commit & Push:** Branch is pushed to GitHub and a PR is opened targeting `main`.
4. **GitHub Actions CI:**
   * Checks out the repository.
   * Executes the exact same `./build.ps1` command used locally.
   * The Unit and Integration tests will run.
5. **Result:** If tests pass, the PR is eligible for review. If tests fail, the merge is blocked.

### Phase 2: Continuous Deployment (The Production Pipeline)
Automates the deployment process to the production server.

**Trigger:** Manual merging of a branch into main branch after careful review of the codes.

**Workflow Steps:**
1. **Build Production Image:** The multi-stage Dockerfile builds the `production` target (stripping out test dependencies like Vitest).
2. **Push to Docker Hub:** The Node.js image is tagged and pushed to the official Docker Hub repository.
3. **Server Deployment via SSH:**
   * GitHub Actions authenticates securely with the production server using SSH keys.
   * Pulls the newest images from Docker Hub.
   * Restarts the application containers with the fresh code.

---


## 🔀 The Merge (Gatekeeper)

Code is never deployed directly from a feature branch. Once the respective CI pipelines report a success and the code is reviewed, a repository admin manually clicks **Merge Pull Request** in GitHub, pulling the feature branch into `main` and triggering the CD pipelines.

---
## 🔐 Required GitHub Secrets

To ensure these pipelines function correctly, the following repository secrets must be configured in **Settings > Secrets and variables > Actions**:

* `DOCKER_USERNAME`: Docker Hub username.
* `D OCKER_PASSWORD`: Docker Hub personal access token.
* `SERVER_HOST`: The IP address or domain ofthe production server.
* `SERVER_USER`: The SSH username for the production server.
* `SERVER_SSH_KEY`: The private SSH key authorized to access the production server.