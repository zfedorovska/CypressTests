import { defineConfig } from "cypress";
const { verifyDownloadTasks } = require('cy-verify-downloads');
//Excel requiremets
const xlsx = require("node-xlsx").default;
const fs = require("fs");
const path = require("path");
//MySql requirements
const mysql = require("mysql");
//Faker
const { faker } = require("@faker-js/faker");

export default defineConfig({
  e2e: {
    baseUrl: "http://uitestingplayground.com",
    setupNodeEvents(on, config) {
      on('task', verifyDownloadTasks);
      on('task', {
        queryDb: (query) => {
          return queryTestDb(query, config);
        }
      });
      on('task', {
        freshUser() {
          let user = {
            username: faker.name.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            registeredAt: faker.date.past(),
          };
          return user;
        }
      })
      on('task', {
        parseXlsx({ filePath }) {
          return new Promise((resolve, reject) => {
            try {
              const jsonData = xlsx.parse(fs.readFileSync(filePath));
              resolve(jsonData);
            } catch (e) {
              reject(e);
            }
          })
        }
      })
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    env: {
      demoVar: "Hello from the Cypress.Config.Ts",
      demoQA: "https://demoqa.com",
      theInternet: "https://the-internet.herokuapp.com",
      //https://www.globalsqa.com/angularjs-protractor-practice-site/
      Angular: "https://www.globalsqa.com",
      db: {
        host: "localhost",
        user: "root",
        password: "",
        database: "cypress_test",
      },
    }
  },
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Favorite life',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
  video: true,
  screenshotOnRunFailure: true,
  projectId: "ge5bi4",

});

function queryTestDb(query, config) {
  const connection = mysql.createConnection(config.env.db);
  connection.connect();
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) reject(error);
      else {
        connection.end();
        console.log(results);
        return resolve(results);
      }
    })
  })
}


