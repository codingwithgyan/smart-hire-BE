const Interview = require("../../models/interview.model");
const { v4: uuid } = require("uuid");
const { INTERVIEW_TYPE } = require("../../constants/index");
const moment = require("moment");
const { UPCOMING } = INTERVIEW_TYPE;
/* validate params  */
const isValid = (value) => {
  if (!value || value?.length === 0) return false;
  return true;
};

const addInterview = async (req, res) => {
  const {
    companyID,
    candidateName,
    candidateEmail,
    candidatePhone,
    candidateExtra,
    interviewerName,
    interviewerEmail,
    interviewerPhone,
    interviewerExtra,
    date,
    questions,
    response,
  } = req.body;

  if (!isValid(companyID)) {
    return res.status(400).send({
      status: false,
      message: "Company ID is missing",
    });
  }

  if (
    !isValid(candidateName) ||
    !isValid(candidateEmail) ||
    !isValid(candidatePhone) ||
    !isValid(interviewerName) ||
    !isValid(interviewerEmail) ||
    !isValid(interviewerPhone)
  ) {
    return res.status(400).send({
      status: false,
      message: "Mandatory fields are missing",
    });
  }
  const payload = {
    companyID,
    candidateName,
    candidateEmail,
    candidatePhone,
    candidateExtra,
    interviewerName,
    interviewerEmail,
    interviewerPhone,
    interviewerExtra,
    date,
    questions,
    response,
  };
  payload["candidateLink"] = uuid();
  payload["interviewerLink"] = uuid();
  try {
    const interview = await new Interview(payload).save();

    return res.status(200).send({
      status: true,
      message: "User Created successfully",
      data: interview,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Some error Occurred",
      error: error,
    });
  }
};

const getInteviewCount = async (req, res) => {
  const companyID = req?.body?.user?.companyID;
  const role = req?.body?.user?.role;
  try {
    let interviewCount = null;
    if(role === "SUPERADMIN")
        interviewCount = await Interview.aggregate([
        {
          $group: {
            _id: "$stage",
            count: { $sum: 1 },
          },
        },
      ]);
    else   
    {
      const interview = await Interview.find({ companyID:companyID})
      let arr = [];
      const obj = {}
      if(interview)
      {
        interview?.map(item=>{
          if(!obj[item?.stage])
          {
            obj[item?.stage] = 1;
          }
            else
            {
              obj[item?.stage] += 1;
            }
          });
        }
      Object.entries(obj).forEach(([key,value])=>{
          arr.push({ _id:key,count:value});
      })
      interviewCount = arr;
    }

    // interviewCount = await Interview.aggregate([
    //   { "$match": { "companyID": companyID } },
    //   {
    //     $group: {
    //       _id: "$stage",
    //       count: { $sum: 1 },
    //     },
    //   },
    // ]);

    return res.status(200).send({
      status: false,
      data: interviewCount,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Some error Occurred",
      error: error,
    });
  }
};

const getAllInterviews = async (req, res) => {
  const { stage = UPCOMING, currentPage = 1, currentLimit = 10 } = req.body;
  const companyID = req.body.user.companyID;
  const role = req.body.user.role;
  try {
    let interview = null;
    if(role === "SUPERADMIN")
      interview = await Interview.find({ stage: stage })
        .skip((currentPage - 1) * currentLimit)
        .limit(currentLimit)
        .populate("companyID");
    else
      interview = await Interview.find({ companyID:companyID, stage: stage })
        .skip((currentPage - 1) * currentLimit)
        .limit(currentLimit)
        .populate("companyID");
    const count = await Interview.find({ companyID:companyID, stage: stage }).countDocuments();
    const data = {
      data: interview,
      metadata: {
        total: count,
      },
    };
    return res.status(200).send({
      status: false,
      data: data,
      message: "",
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Some error Occurred",
      error: error,
    });
  }
};

const getDataByMonth = (user) => {
  let arr = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, count: 0 }));
  user.forEach((interview) => {
    const month = moment(interview?.date * 1000)?.month() + 1;
    arr = arr.map((item) => {
      if (item.month === month) {
        item.count += 1;
      }
      return item;
    });
  });
  return arr;
};
const getMonthlyStats = async (req, res) => {
  const companyID = req.body.user.companyID;
  const role = req.body.user.role;
  try {
    let user;
    if (role === "SUPERADMIN") user = await Interview.find();
    else user = await Interview.find({ companyID: companyID });
    if (!user) {
      return res.status(200).send({
        status: true,
        data: [],
        message: "Data fetched successfully",
      });
    }
    const data = getDataByMonth(user);
    return res.status(200).send({
      status: true,
      data: data,
      message: "Data fetched successfully",
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Some error Occurred",
      error: error,
    });
  }
};

const getInterviewByUUID = async (req, res) => {
  const { uuid } = req.query;
  if (!uuid || uuid?.length == 0) {
    return res.status(500).send({
      status: false,
      message: "Please provide a valid UUID",
    });
  }
  const data = {};
  try {
    const candidate = await Interview.findOne({ candidateLink: uuid });
    let interviewer = null;
    if (!candidate) {
      interviewer = await Interview.findOne({ interviewerLink: uuid });
      data["role"] = "INTERVIWER";
      data["interview"] = interviewer;
    } else {
      data["role"] = "CANDIDATE";
      data["interview"] = candidate;
    }

    if (!candidate && !interviewer) {
      return res.status(404).send({
        status: false,
        message: "Please provide a valid UUID",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Data fetched successfully",
      data,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Some error Occurred",
      error: error,
    });
  }
};

const editInterview = async (req, res) => {
  const {
    candidateName,
    candidateEmail,
    candidatePhone,
    candidateExtra,
    interviewerName,
    interviewerEmail,
    interviewerPhone,
    interviewerExtra,
    date,
    questions,
    response,
    score,
    stage,
  } = req.body;
  const payload = {};
  if (isValid(candidateName)) payload.candidateName = candidateName;

  if (isValid(candidateEmail)) payload.candidateEmail = candidateEmail;

  if (isValid(candidatePhone)) payload.candidatePhone = candidatePhone;

  if (isValid(candidateExtra)) payload.candidateExtra = candidateExtra;

  if (isValid(interviewerName)) payload.interviewerName = interviewerName;

  if (isValid(interviewerEmail)) payload.interviewerEmail = interviewerEmail;

  if (isValid(interviewerPhone)) payload.interviewerPhone = interviewerPhone;

  if (isValid(interviewerExtra)) payload.candidateExtra = interviewerExtra;

  if (isValid(date)) payload.date = date;

  if (isValid(questions)) payload.questions = questions;

  if (isValid(response)) payload.response = response;

  if (isValid(score)) payload.score = score;

  if (isValid(stage)) payload.stage = stage;

  const id = req?.body?._id;

  try {
    const interview = await Interview.findByIdAndUpdate(id, payload);
    return res.status(200).send({
      status: false,
      message: "Interview details updated",
      data: interview,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Some error Occurred",
      error: error,
    });
  }
};

module.exports = {
  addInterview,
  getInteviewCount,
  getAllInterviews,
  getMonthlyStats,
  getInterviewByUUID,
  editInterview,
};
