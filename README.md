# Upfit Gym — Web Application

- Web application developed to manage a gym company's **customers, revenues and expenses**, focusing on a clean UI and scalable frontend architecture.
- More information can be found in the [documentation](https://github.com/maisappreis/upfit-gym/blob/main/documentation.md).

🌐 **Live demo:**  
https://maisappreis.github.io/upfit-gym/

🔗 **Backend repository:**  
https://github.com/maisappreis/django-APIs

---

## 🧠 Overview

This project was built as part of a fullstack architecture, where the frontend communicates with a REST API developed in Django.  
It focuses on **state management, authentication flows and modular frontend structure**, following modern Vue 3 best practices.

---

## 🛠️ Tech Stack

- Vue.js 3
- Vite
- Typescript
- Pinia
- Vitest

---

## 📸 Preview

![App View](https://github.com/user-attachments/assets/9398647b-8c66-4aea-b0ff-d8367d675f5d)


---

## 🧩 Architecture

This application follows a **frontend–backend decoupled architecture**, where the Vue.js frontend communicates with a REST API built in Django.

- The **frontend** is developed with Vue 3 and Vite, using a modular component-based structure.
- **Global state management** is handled with Pinia, centralizing authentication state, API configuration, and shared application data.
- **Authentication** is implemented using JWT tokens, managed on the frontend and validated by the backend.
- The **backend API** is responsible for business logic, data persistence, and permissions, exposing secure REST endpoints.
- The project is structured to support scalability, maintainability, and clear separation of concerns.

---

## 🔐 Authentication Flow

Authentication is implemented using **JWT (JSON Web Tokens)**, enabling stateless and secure communication between the frontend and backend.

1. The user submits credentials through the frontend login form.
2. The frontend sends the credentials to the Django REST API.
3. Upon successful authentication, the backend issues an **access token** (and refresh token).
4. The frontend stores the token and attaches it to subsequent API requests via the `Authorization` header.
5. Protected routes and resources are validated on the backend using JWT authentication.
6. Authentication state is centrally managed on the frontend using **Pinia**.

---

## 🌱 Project Status

🚧 This project is under active development.  
New features, refactors, and improvements are added incrementally.

---

## 📦 Getting Started

### Installation

```sh
npm install
```

### Development

Start the development server with hot reload:
```sh
npm run dev
```

---

## 🏗️ Build & Production

Type-Check, Compile and Minify for Production

Build the production version:
```sh
npm run build
```

---

## 🧪 Testing

Run **Unit Tests** with [Vitest](https://vitest.dev/)
```sh
npm run test:unit
```

Run **End-to-End Tests** with [Cypress](https://www.cypress.io/)
```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

---

## 🚀 Deployment

The frontend is deployed on **GitHub Pages** using a manual deployment flow.

A production build is generated with Vite and published to the `gh-pages` branch through a subtree-based strategy,
allowing the repository to keep source code and build artifacts isolated.

### Deployment Steps

```sh
npm run build
git add dist
git commit -m "deploy: message"
git subtree push --prefix dist origin gh-pages
```

The application is then served directly from the dist folder via GitHub Pages.

---

## 🧹 Linting

Run ESLint to check and fix code style issues [ESLint](https://eslint.org/)

```sh
npm run lint
```

---

## 🧩 TypeScript Support for .vue Files

TypeScript does not natively understand .vue files.
This project uses vue-tsc for type checking and Volar for editor support.

🔌 Recommended extension: [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

---

## 🔧 Configuration

For advanced configuration, see the Vite documentation: [Vite Configuration Reference](https://vitejs.dev/config/).

---

## 👩‍💻 Author

Maisa Pierini Preis

Frontend‑focused Full Stack Developer

- GitHub: https://github.com/maisappreis
- LinkedIn: https://www.linkedin.com/in/maisa-pp-2303/
- Portfolio: https://maisappreis.github.io/

---

## 📄 License

This project is licensed under the MIT License.
