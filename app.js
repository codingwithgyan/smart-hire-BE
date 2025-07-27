const express = require("express");
const cors = require('cors');
const protect = require("./middleware/protect");
const {createCodeFile, getJobStatus} = require("./controllers/codeEditor/compiler");
const { superUserSignup, superUserLogin, superUserEdit, getSuperAdminData } = require("./controllers/superUser/superUser");
const { clientUserSignup, clientUserLogin, AddCompany, getAllClients, clientUserEdit, getClientData } = require("./controllers/clientUser/clientUser");
const { addQuestion, getAllQuestions } = require("./controllers/questionBank/questionBank");
const { addInterview, getAllInterviews, getInteviewCount, getMonthlyStats, getInterviewByUUID, editInterview } = require("./controllers/interview/interview");
const app = express();

app.use(cors({
    origin: '*'
}));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* Super User */
app.post("/api/super/login",superUserLogin)
app.post("/api/super/signup",superUserSignup)
app.get("/api/super",protect,getSuperAdminData)
app.post("/api/super/edit",protect,superUserEdit)

/* Org Creation */
app.post("/api/org/add",protect,AddCompany)

/* Client User */
app.post("/api/client/login",clientUserLogin)
app.post("/api/client/signup",clientUserSignup)
app.post("/api/client/all",protect,getAllClients)
app.get("/api/client",protect,getClientData);
app.post("/api/client/edit",protect,clientUserEdit)

/* Interviews */
app.post("/api/interview/add",protect,addInterview)
app.get("/api/interivew/stats",protect,getInteviewCount)
app.post("/api/interview/all",protect,getAllInterviews)
app.get("/api/interview/monthly-data",protect,getMonthlyStats)
app.post("/api/interview/edit",editInterview)

/* Question */
app.post("/api/question/add",protect,addQuestion)
app.post("/api/question/all",protect,getAllQuestions)

/* Code Editor */
app.post("/api/run",protect,createCodeFile)
app.get("/api/code/status",protect,getJobStatus)
app.get("/api/test/info",getInterviewByUUID)

/* Handling route  not found - 404 */
app.use(function(req, res) {
   return res.status(404).send({
            status:false,
            message:'Page not found'
    });
});

module.exports = app;