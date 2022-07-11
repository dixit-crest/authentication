const messages = {
    DATA_RETRIEVED: {
        message: "Data retrieved successfully"
    },
    DATA_UPDATED: {
        message: "Data updated successfully"
    },
    DATA_DELETED: {
        message: "Data deleted successfully"
    },
    RECORD_CREATED: {
        message: "Record created successfully"
    },
    SERVER_ERROR: {
        message: "Server error occurred"
    },
    ACTION_NOT_PERMITTED: {
        message: "You do not have permission to perform this action."
    },
    ACCOUNT_CREATED: {
        message: "Account created successfully, Please check your email for verification instructions."
    },
}


const EMAIL = {
    RESET_PASSWORD: {
        SUBJECT: "Reset Password | Please click here to reset your password",
    },
    CONFIRM_EMAIL: {
        SUBJECT: "Confirm Email | Please click here to confirm your email",
    },
}
module.exports = {
    messages,
    EMAIL
}