import httpResponse from '../util/httpResponse.js';
import responseMessage from '../constant/responseMessage.js';
import httpError from '../util/httpError.js';
import quicker from '../util/quicker.js';
import databaseService from '../service/databaseService.js';
import config from '../config/config.js';

export default {
    self: (req, res, next) => {
        try {
            httpResponse(req, res, 200, responseMessage.SUCCESS);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    health: (req, res, next) => {
        try {
            const healthData = {
                application: quicker.getApplicationHealth(),
                system: quicker.getSystemHealth(),
                timestamp: Date.now(),
            };

            httpResponse(req, res, 200, responseMessage.SUCCESS, healthData);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    sendOtp: async (req, res, next) => {
        try {
            const { email } = req.body;

            if (!email) {
                return httpError(next, new Error(responseMessage.REQUIRED_PARAMETER('email')), req, 400);
            }

            const otp = quicker.generateOTP();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

            let user = await databaseService.getUserByEmail(email);

            if (user) {
                const response = await databaseService.updateOTPUserByEmail(email, { otp, expiresAt });

                if (!response.modifiedCount) {
                    return httpError(next, new Error(responseMessage.FAILED_OPERATION('Failed to update OTP')), req, 400);
                }
            } else {                 
                user = await databaseService.user({ email, otp, expiresAt });

                if (!user) {
                    return httpError(next, new Error(responseMessage.FAILED_OPERATION('Failed to create user')), req, 400);
                }
            }

            httpResponse(req, res, 200, responseMessage.SUCCESS);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    verifyOTP: async (req, res, next) => {
        try {

            const { email, otp } = req.body;

            console.log(email,otp);
            

            if (!email ||!otp) {
                return httpError(next, new Error(responseMessage.REQUIRED_PARAMETER('email or OTP')), req, 400);
            }

            const user = await databaseService.getUserByEmail(email);

            if (!user) {
                return httpError(next, new Error(responseMessage.NOT_FOUND('User')), req, 404);
            }

            if (!user.otp || !user.expiresAt) {
                return httpError(next, new Error(responseMessage.NOT_FOUND('No OTP found. Please request a new one.')), req, 400);
            }

            if (user.otp!== otp) {
                return httpError(next, new Error(responseMessage.FAILED_OPERATION('OTP does not match')), req, 400);
            }

            if (user.expiresAt < new Date()) {
                return httpError(next, new Error(responseMessage.FAILED_OPERATION('OTP expired')), req, 400);
            }

            user.otp = '';
            user.expiresAt = '';
            await databaseService.updateOTPUserByEmail(user.email, { otp: '', expiresAt: '' });


            const accessToken = quicker.generateToken(
                {
                    userId: user._id
                },
                config.ACCESS_TOKEN.SECRET,
                config.ACCESS_TOKEN.EXPIRY
            )

            httpResponse(req, res, 200, responseMessage.SUCCESS, accessToken);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    selfIdentification: (req, res, next) => {
        const { authenticatedUser } = req
        try {
            httpResponse(req, res, 200, responseMessage.SUCCESS,authenticatedUser);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    }
};
