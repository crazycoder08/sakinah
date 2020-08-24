const options = {
  resCode: {
    HTTP_OK: 200,
    HTTP_CREATE: 201,
    HTTP_NO_CONTENT: 204,
    HTTP_BAD_REQUEST: 400,
    HTTP_UNAUTHORIZED: 401,
    HTTP_FORBIDDEN: 403,
    HTTP_NOT_FOUND: 404,
    HTTP_METHOD_NOT_ALLOWED: 405,
    HTTP_CONFLICT: 409,
    HTTP_INTERNAL_SERVER_ERROR: 500,
    HTTP_SERVICE_UNAVAILABLE: 503,
    EMAIL_ADRESS_PRESENT: 00,
    MOBILE_NUMBER_PRESENT: 01
  },
  errorMessages: {
    INTERNAL_SERVER_ERROR: "Internal server error",
    OTP_SEND_FAILED: "OTP send failed!",
    DUPLICATE_MOBILE_NUMBER:
      "The Mobile number is already in use. Please try again using a different mobile number",
    DUPLICATE_EMAIL:
      "The Email address is already in use. Please try again using a different Email address",
    INVALID_INVITE_CODE: "Please enter valid invite code!",
    NO_DATA_AVAILABLE: "No data availble",
    INVALID_ID: "Invalid contest id",
    CONTEST_CLOSED: "Contest closed!",
    ALREADY_JOINED_CONTEST: "Already joined the contest!",
    INVALID_REQUEST: "Invalid request!",
    INVALID_ACCESS_TOKEN: "Invalid access token!"
  },
  errorTypes: {
    OAUTH_EXCEPTION: "OAuthException",
    ALREADY_AUTHENTICATED: "AlreadyAuthenticated",
    UNAUTHORISED_ACCESS: "UnauthorisedAccess",
    INPUT_VALIDATION: "InputValidationException",
    ACCOUNT_ALREADY_EXIST: "AccountAlreadyExistException",
    MOBILE_NUMBER_ALREADY_EXIST: "MobileNumberAlreadyExistException",
    EMAIL_ALREADY_EXIST: "EmailAlreadyExistException",
    ACCOUNT_DOES_NOT_EXIST: "AccountDoesNotExistException",
    ENTITY_NOT_FOUND: "EntityNotFound",
    ACCOUNT_BLOCKED: "AccountBlocked",
    ACCOUNT_DEACTIVATED: "AccountDeactivated",
    CONTENT_BLOCKED: "ContentBlocked",
    CONTENT_REMOVED: "ContentRemoved",
    PRIVATE_CONTENT: "PrivateContent",
    PRIVATE_ACCOUNT: "PrivateAccount",
    DUPLICATE_REQUEST: "DuplicateRequest",
    EMAIL_NOT_VERIFIED: "emailNotVerified",
    INTERNAL_SERVER_ERROR: "InternalServerError",
    CONTEST_FULLED: "ContestFulled",
    ALREADY_JOINED_CONTEST: "AlreadyJoinedContest!",
    MATCH_CLOSED: "MatchClosed",
    INSUFFICIENT_BALANCE: "insufficientBalance",
    DATA_NOT_AVAILABLE: "DataNotFound"
  },
  genOtp: () => {
    return Math.floor(100000 + Math.random() * 900000);
  },
  genOtpMessage: otp => {
    return otp + " is your OTP for your account!";
  }
};
module.exports = options;
