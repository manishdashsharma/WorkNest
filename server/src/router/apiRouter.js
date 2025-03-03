import { Router } from 'express'
import apiController from '../controller/apiController.js'
import authentication from '../middleware/authentication.js'

const router = Router()

router.route('/self').get(apiController.self)
router.route('/health').get(apiController.health)
router.route('/send-otp').post(apiController.sendOtp)
router.route('/verify-otp').post(apiController.verifyOTP)
router.route('/self-identification').get(authentication,apiController.selfIdentification)

export default router