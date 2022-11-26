const messages = {
    DATA_RETRIEVED: {
        messages: "Data retrieved successfully"
    }
    ,
    DATA_UPDATED: {
        messages: "Data updated successfully"
    },
    DATA_DELETED: {
        messages: "Data deleted successfully."
    },
    RECORD_CREATED: {
        messages: "Record created successfully"
    },
    SERVER_ERRPR: {
        messages: "Server error occurred"
    },
    ACTION_NOT_PERMITTED: {
        messages: "You do not have permission to perform this action."
    }
}


const EMAIL = {
    RESET_PASSWORD : {
        SUBJECT: "Reset Password | Please click here to reset your password",
    },
    CONFIRM_EMAIL : {
        SUBJECT: "Confirm Email | Please click here to confirm your email",
    },
}
module.exports = {
    messages,
    EMAIL
}