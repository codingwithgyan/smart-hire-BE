const Queue = require("bull");
const Job = require("../../models/job.model");
const runPythonFile = require("./ExecutePython");
const runJavascriptFile = require("./ExecuteJavaScript");
require("dotenv").config();

const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || "6379",
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD || "123456",
};

const redisURI = process.env.REDIS_ULI;

const jobQueue = new Queue("job-queue", redisURI);
const { JOB_STATUS, LANGUAGE_SUPPORT } = require("../../constants/index");
const { PENDING, SUCCESS, ERROR } = JOB_STATUS;
const { JAVASCRIPT, PYTHON } = LANGUAGE_SUPPORT;
const TOTAL_WORKERS = 8;

jobQueue.process(TOTAL_WORKERS, async ({ data }) => {
  const { jobId, lang } = data;
  const job = await Job.findById(jobId);
  let codeResponse;
  try {
    job.startedAt = new Date();
    if (lang) {
      codeResponse = await runJavascriptFile(job.filePath, job.lang);
    } else if (lang === "py") {
      codeResponse = await runPythonFile(job.filePath, job.lang);
    }
    job.completedAt = new Date();
    job.status = SUCCESS;
    job.output = codeResponse;
  } catch (error) {
    job.completedAt = new Date();
    job.status = ERROR;
    job.output = JSON.stringify(error);
  }

  await job.save();
  return true;
});

// // Add event listeners
jobQueue.on("waiting", (jobId) => {
  console.log(`Job ${jobId} is waiting`);
});

jobQueue.on("active", (job) => {
  console.log(`Job ${job.id} is now active`);
});

jobQueue.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed with result ${result}`);
});

jobQueue.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed with error ${err}`);
});

jobQueue.on("error", (error) => {
  console.error("Queue error:", error);
});

const addJobToQueue = async (jobId, lang) => {
  try {
    if (jobQueue.hasOwnProperty("jobId")) {
      jobQueue["jobId"] = "";
    }
    await jobQueue.add({ jobId, lang });
  } catch (error) {
    throw new Error("Failed to add job to queue");
  }
};
module.exports = { addJobToQueue };
