 const JOB_STATUS = {
    PENDING: "PENDING",
    SUCCESS: "SUCCESS",
    ERROR: "ERROR",
}

const LANGUAGE_SUPPORT = {
    JAVASCRIPT: {
        extension: "js",
        label: "Javascript",
        type: "JAVASCRIPT",
    },
    PYTHON: {
        extension: "py",
        label: "Python",
        type: "PYTHON",
    }
}

const CLIENT_ROLES = {
    SUPERADMIN:"SUPERADMIN",
    ADMIN: "ADMIN",
    USER : "USER",
}

const USER_STATUS = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
}

const QUESTION_STATUS = {
    PUBLIC: "PUBLIC",
    PRIVATE: "PRIVATE",
}

const INTERVIEW_TYPE = {
    UPCOMING: "UPCOMING",
    PASSED: "PASSED",
    FAILED: "FAILED",
    CANCELLED: "CANCELLED",
}

module.exports = {
    JOB_STATUS,
    LANGUAGE_SUPPORT,
    CLIENT_ROLES,
    USER_STATUS,
    QUESTION_STATUS,
    INTERVIEW_TYPE,
}