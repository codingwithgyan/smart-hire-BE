const Queue = require('bull');
const Job = require("../../models/job.model");
const runPythonFile = require('./ExecutePython');
const jobQueue = new Queue("job-queue");
const  { JOB_STATUS, LANGUAGE_SUPPORT} = require("../../constants/index");

const {PENDING, SUCCESS, ERROR} = JOB_STATUS;
const {JAVASCRIPT, PYTHON} = LANGUAGE_SUPPORT;
const TOTAL_WORKERS = 8;

jobQueue.process(TOTAL_WORKERS,async({data})=>{
    const { jobId } = data;
    const job = await Job.findById(jobId);
    if(!job)
        throw "Job details not found"

    try
    {
        job["startedAt"] = new Date();
        const codeResponse = await runPythonFile(job?.filePath,job?.lang);

        job["completedAt"] = new Date();
        job["status"] = SUCCESS;
        job["output"] = codeResponse;
        
        await job.save();
    }
    catch(error)
    {
        job["completedAt"] = new Date();
        job["status"] = ERROR;
        job["output"] = JSON.stringify(error);
        await job.save();

        return res.status(400).send(
            {
                status:false,
                error:JSON.stringify(error?.stderr)
            }
        );
    }
    return true;
});

const addJobToQueue = async(jobId) => {
   await jobQueue.add({jobId})
}

module.exports = {addJobToQueue};