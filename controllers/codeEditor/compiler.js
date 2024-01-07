const path = require("path");
const fs = require("fs");
const {v4:uuid} = require("uuid");
const { generateFolder } = require("./file");
const Job = require("../../models/job.model");

const  { JOB_STATUS, LANGUAGE_SUPPORT} = require("../../constants/index");

const {PENDING, SUCCESS, ERROR} = JOB_STATUS;
const {JAVASCRIPT, PYTHON} = LANGUAGE_SUPPORT;

const runPythonFile = require("./ExecutePython");
const { addJobToQueue } = require("./jobQueue");


const createCodeFile = async(req,res) => {
    const { lang="js", code } = req?.body;
    
    const dirPath = generateFolder("codes",lang);
    const fileName = uuid() + `.${lang}`
    const filePath=path.join(dirPath,fileName);
    let job;
    try
    {
        await fs.writeFileSync(filePath,code);

        job = await new Job({language: lang, filePath:filePath}).save();
        const job_id = job?._id;
        addJobToQueue(job_id);
        res.status(200).json({success:true,job_id});
    }
    catch(error)
    {
        return res.status(400).send({status:false,error:JSON.stringify(error)})
    }
    
    
}

const getJobStatus = async(req,res) => {
    const {job_id} = req.query;
    const job = await Job.findById(job_id);
    res.status(200).send({status:true,job_id,job});
}

module.exports = {createCodeFile, getJobStatus};