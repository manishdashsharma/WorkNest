export default {
    SUCCESS: 'The operation has been successful',
    SOMETHING_WENT_WRONG: 'Something went wrong!',
    NOT_FOUND: (entity) => `${entity} not found`,
    TOO_MANY_REQUESTS: 'Too many requests! Please try again after some time',
    REQUIRED_PARAMETER: (entity) => `Missing ${entity}`,
    FAILED_OPERATION: (entity) => `${entity}`
};
