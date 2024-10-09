const { serverApp } = require("../server.js");
const request = require("supertest")(serverApp);
let expect = require("chai").expect;
const { faker } = require("@faker-js/faker");

const baseApiUrl = "/api";
const baseArticlesUrl = "/api/articles";
const baseRandomArticlesUrl = "/api/random/articles";
const baseFilesArticlesUrl = "/api/files/articles";
const baseUsersUrl = "/api/users";
const baseHangmanUrl = "/api/hangman";
const baseMinesweeperUrl = "/api/minesweeper";
const baseBugEaterUrl = "/api/bug-eater";
const baseQuizUrl = "/api/quiz";
const baseStatsUrl = "/api/stats";
const baseCommentsUrl = "/api/comments";
const baseLoginUrl = "/api/login";
const baseLikesUrl = "/api/likes";
const baseLabelsUrl = "/api/labels";
const aboutUrl = "/api/about";
const baseBookmarksUrl = "/api/bookmarks";
const baseArticleLabelsUrl = "/api/article-labels";
const baseSurveysUrl = "/api/surveys";
const baseTicTacToeUrl = "/api/tic-tac-toe";
const languagesUrl = "/api/languages";
const messengerContactsUrl = "/api/messenger/contacts";
const messengerMessagesUrl = "/api/messenger/messages";
const contactsUrl = "/api/contacts";
const messagesUrl = "/api/messages";

const existingUserEmail = "Danial.Dicki@dicki.test";
const existingUserPass = "test2";
const existingUserId = 2;

const existingUserEmail2 = "Henry.Spencer@test.test";
const existingUserPass2 = "1234";
const existingUserId2 = 11;

const existingUserEmail3 = "m.altman@test.test";
const existingUserPass3 = "1234";
const existingUserId3 = 12;

const existingUserEmail4 = "v.cortez@test.test";
const existingUserPass4 = "1234";
const existingUserId4 = 13;

const sleepTime = 200; // in ms
const logLevel = 2;
const clearDbAfter = false;
const clearDbBefore = true;

module.exports = {
  expect,
  request,
  faker,
  baseApiUrl,
  baseArticlesUrl,
  baseUsersUrl,
  baseLikesUrl,
  baseHangmanUrl,
  baseMinesweeperUrl,
  baseQuizUrl,
  baseStatsUrl,
  baseCommentsUrl,
  sleepTime,
  baseLoginUrl,
  existingUserPass,
  existingUserEmail,
  existingUserId,
  logLevel,
  clearDbAfter,
  clearDbBefore,
  baseFilesArticlesUrl,
  baseLabelsUrl,
  baseArticleLabelsUrl,
  baseRandomArticlesUrl,
  aboutUrl,
  baseBookmarksUrl,
  existingUserEmail2,
  existingUserPass2,
  existingUserId2,
  baseSurveysUrl,
  baseTicTacToeUrl,
  baseBugEaterUrl,
  languagesUrl,
  existingUserEmail3,
  existingUserPass3,
  existingUserId3,
  existingUserEmail4,
  existingUserPass4,
  existingUserId4,
  messengerContactsUrl,
  messengerMessagesUrl,
  contactsUrl,
  messagesUrl,
};
