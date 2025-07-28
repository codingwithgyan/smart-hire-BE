const Queue = require("bull");
const Job = require("../../models/job.model");
const runPythonFile = require("./ExecutePython");

const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || "123456",
};

const jobQueue = new Queue("job-queue", redisConfig);
const { JOB_STATUS, LANGUAGE_SUPPORT } = require("../../constants/index");
const { PENDING, SUCCESS, ERROR } = JOB_STATUS;
const { JAVASCRIPT, PYTHON } = LANGUAGE_SUPPORT;
const TOTAL_WORKERS = 4;

jobQueue.process(TOTAL_WORKERS, async ({ data }) => {
  const { jobId } = data;
  const job = await Job.findById(jobId);

  try {
    job.startedAt = new Date();
    const codeResponse = await runPythonFile(job.filePath, job.lang);
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

const addJobToQueue = async (jobId) => {
  try {
    if (jobQueue.hasOwnProperty("jobId")) {
      jobQueue["jobId"] = "";
    }
    await jobQueue.add({ jobId });
  } catch (error) {
    throw new Error("Failed to add job to queue");
  }
};
module.exports = { addJobToQueue };
