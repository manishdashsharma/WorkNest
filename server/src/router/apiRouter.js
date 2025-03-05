import { Router } from 'express'
import apiController from '../controller/apiController.js'
import authentication from '../middleware/authentication.js'

const router = Router()

router.route('/self').get(apiController.self)
router.route('/health').get(apiController.health)
router.route('/send-otp').post(apiController.sendOtp)
router.route('/verify-otp').post(apiController.verifyOTP)
router.route('/self-identification').get(authentication,apiController.selfIdentification)
router.route('/add-workers').post(authentication,apiController.addWorkers)
router.route('/get-workers-by-owner').get(authentication,apiController.getWorkersByOwner)
router.route('/get-workers/:id').get(authentication,apiController.getWorkerById)
router.route('/update-worker/:id').post(authentication,apiController.updateWorker)
router.route('/delete-worker/:id').get(authentication,apiController.deleteWorker)
router.route('/create-project').post(authentication,apiController.createProject)
router.route('/get-all-projects').get(authentication,apiController.getAllProjects)
router.route('/get-project-details/:id').get(authentication,apiController.getProjectDetails)
router.route('/delete-project/:id').get(authentication,apiController.deleteProject)


export default router