# Web Application for a Gym Company

A web application developed to manage the company's customers, income and expenses. <br>
Back-end code on: https://github.com/maisappreis/django-APIs

You can try it out in this production test version: https://maisappreis.github.io/upfit-gym/

## Technologies:
- Vue.js 3
- Vite
- Typescript
- Pinia
- Vitest

![image](https://github.com/maisappreis/upfit-gym/assets/113925909/93fb4995-d68e-4aee-a6ba-abe8e9b105ab)


## 🌱 On Development

### 🛠️ Installation
```sh
npm install
```

### 🛠️ Running
Compile and Hot-Reload for Development
```sh
npm run dev
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

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

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).
