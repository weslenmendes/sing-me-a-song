# <p align = "center">Sing me a Song</p>

<p align = "center">
   <img src="https://i.ibb.co/xHBXwCC/singing.png" alt="" width="200" />
</p>
<br/><br/><br/>
<div align="center">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge">
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Git-E34F26?style=for-the-badge&logo=git&logoColor=white" />
  <img src="https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white" />
  <img src="https://img.shields.io/badge/-cypress-%23E5E5E5?style=for-the-badge&logo=cypress&logoColor=058a5e" />
</div>

## 📋 Description

This application is a fullstack application, where you can add song recommendations, vote for them, have access to the top ranking by score, and get random song recommendation.

---

## 💻 Technologies and concepts covered

- Node.js
- TypeScript
- Prisma
- Postgres
- Jest and SuperTest
- Cypress
- REST APIs
- ORMs
- Automated Tests
- Unit tests
- Integration Tests
- E2E Tests
- Relational Database
- Layered Architecture

---

## 🚀 Routes

### **API routes**

### Add a recommendation

```yml
POST /recommendations
    - headers: {}
    - body: {
        "name": string,                ## a valid name
        "youtubeLink": string          ## a valid youtube link
      }
```

### Upvote for a recommendation

```yml
POST /recommendations/:id/upvote
    - headers: {}
    - body: {}
```

### Downvote for a recommendation

```yml
POST /recommendations/:id/downvote
    - headers: {}
    - body: {}
```

### Get recommendations

```yml
GET /recommendations
    - headers: {}
    - body: {}
```

### Get a specific recommendation

```yml
GET /recommendations/:id
    - headers: {}
    - body: {}
```

### Get a random recommendation

```yml
GET /recommendations/random
    - headers: {}
    - body: {}
```

### Get top recommendations by amount

```yml
GET /recommendations/top/:amount
    - headers: {}
    - body: {}
```

### Dev test routes (only available for test environment: **npm run dev:test**)

```yml
## clear all test database data

POST /reset
    - headers: {}
    - body: {}
```

```yml
## create recommendations from amount with a score of 0 or given

POST /create/:amount?score=
    - query: {
      score: number;
    }
    - params: {
      amount: number;
    }
    - headers: {}
    - body: {}
```

### **Front-end routes**

```yml
## Home page and timeline
http://localhost:3000/

## Timeline with all top recommendations
http://localhost:3000/top

## Timeline with a specific random recommendation
http://localhost:3000/random
```

---

# 🏁 Getting Started

This project needs the Node.js platform to run, so you need to install [Node.js](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/) first, in order to test the project. Remember to launch you database locally and create a `.env` file with the environment variables listed on `.env.example`.

Then, clone the repository with:

```
git clone https://github.com/weslenmendes/sing-me-a-song.git
```

So, then inside created directory, you can run:

```
cd back-end/
npm install
```

to install the dependencies.

Then, run

```
npm run dev
```

to run the server.

So, then open a new terminal window, you can run:

```
cd front-end/
npm install
```

to install the dependencies.

After, run:

```
npm start
```

then it will open a tab in your default browser at the address [http:localhost:3000]().

If it doesn't open, you can open it in any browser at the given address.

# 🧪 Tests

**Recommendation:** To run the tests on the back-end it is necessary to have configured **.env.test** based on **.env.test.example** in the root of the project. To run the tests on the front-end it is necessary to be running the back-end in test mode, with the command: **npm run dev:test** and run the command **npm start** in the front-end directory, to put the application on the air.

## Unit tests

So, inside the back-end directory, run:

```
npm run test:unit
```

## Integration tests

So, inside the back-end directory, run:

```
npm run test:integration
```

## E2E tests

So, inside the front-end directory, run:

```
npx cypress open
```
