import httpResponse from '../util/httpResponse.js';
import responseMessage from '../constant/responseMessage.js';
import httpError from '../util/httpError.js';
import quicker from '../util/quicker.js';
import databaseService from '../service/databaseService.js';
import config from '../config/config.js';
import mongoose from 'mongoose';

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

            console.log(otp);
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
    },
    addWorkers: async (req, res, next) => {
        try {
            const { authenticatedUser } = req

            const { name, email, phoneNumber, githubLink } = req.body
            
            if (!name ||!email ||!phoneNumber ||!githubLink) {
                return httpError(next, new Error(responseMessage.REQUIRED_PARAMETER('name, email, phoneNumber, githubLink')), req, 400);
            }

            const worker = await databaseService.addWorker({
                name,
                email,
                phoneNumber,
                githubLink,
                ownerId: authenticatedUser._id
            })

            if (!worker) {
                return httpError(next, new Error(responseMessage.FAILED_OPERATION('Failed to add worker')), req, 400);
            }
            
            httpResponse(req, res, 201, responseMessage.SUCCESS);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    getWorkersByOwner: async (req, res, next) => {
        try {
            const { authenticatedUser } = req;
            
            const workers = await databaseService.getWorkersByOwner(authenticatedUser._id);
            
            if (!workers || workers.length === 0) {
                return httpError(next, new Error(responseMessage.NOT_FOUND('No workers found')), req, 404);
            }
    
            httpResponse(req, res, 200,responseMessage.SUCCESS, workers);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    getWorkerById: async (req, res, next) => {
        try {
            const { id } = req.params;
    
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return httpError(next, new Error(responseMessage.INVALID_ID('Worker ID is invalid')), req, 400);
            }
    
            const worker = await databaseService.getWorkerById(id);
    
            if (!worker) {
                return httpError(next, new Error(responseMessage.NOT_FOUND('Worker not found')), req, 404);
            }
    
            httpResponse(req, res, 200,responseMessage.SUCCESS, worker);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    updateWorker: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { name, email, phoneNumber, githubLink } = req.body;
    
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return httpError(next, new Error(responseMessage.INVALID_ID('Worker ID is invalid')), req, 400);
            }
    
            const updatedWorker = await databaseService.updateWorker(id, { name, email, phoneNumber, githubLink });
    
            if (!updatedWorker) {
                return httpError(next, new Error(responseMessage.FAILED_OPERATION('Failed to update worker')), req, 400);
            }
    
            httpResponse(req, res, 200, responseMessage.SUCCESS);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    deleteWorker: async (req, res, next) => {
        try {
            const { id } = req.params;
    
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return httpError(next, new Error(responseMessage.INVALID_ID('Worker ID is invalid')), req, 400);
            }
    
            const deletedWorker = await databaseService.deleteWorker(id);
    
            if (!deletedWorker) {
                return httpError(next, new Error(responseMessage.FAILED_OPERATION('Failed to delete worker')), req, 400);
            }
    
            httpResponse(req, res, 200, responseMessage.SUCCESS);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    createProject: async (req, res, next) => {
        try {
            const { authenticatedUser } = req;
            const { 
                name, 
                startDate, 
                endDate, 
                totalBudget, 
                projectAdvance = 0,
                workers 
            } = req.body;
    
            if (!name || !startDate || !endDate || !totalBudget) {
                return httpError(next, new Error(responseMessage.REQUIRED_PARAMETER('name, startDate, endDate, totalBudget')), req, 400);
            }
    
            if (projectAdvance > totalBudget) {
                return httpError(next, new Error('Project advance cannot exceed total budget'), req, 400);
            }
    
            let totalSpending = 0;
            let totalSpent = 0;
            let formattedWorkers = [];
    
            if (workers && workers.length > 0) {
                workers.forEach(worker => {
                    if (!worker.workerId || !worker.totalPayment) {
                        return httpError(next, new Error(responseMessage.REQUIRED_PARAMETER('workerId, totalPayment')), req, 400);
                    }
    
                    let advanceGiven = worker.advanceGiven || 0;
                    let remainingPayment = worker.totalPayment - advanceGiven;
                    
                    totalSpending += worker.totalPayment;
                    totalSpent += advanceGiven;
    
                    formattedWorkers.push({
                        workerId: worker.workerId,
                        totalPayment: worker.totalPayment,
                        advanceGiven: advanceGiven,
                        remainingPayment: remainingPayment
                    });
                });
            }
    
            const remainingFromClient = totalBudget - projectAdvance;
            const remainingAfterSpending = totalBudget - totalSpending;
            const cashOnHand = projectAdvance - totalSpent;
    
            const project = {
                name,
                startDate,
                endDate,
                totalBudget,
                totalSpending,
                totalSpent,
                remainingFromClient,
                remainingAfterSpending,
                cashOnHand,
                projectAdvance,
                workers: formattedWorkers,
                ownerId: authenticatedUser._id,
                advancePaymentStatus: projectAdvance > 0
            };
    
            const newProject = await databaseService.createProject(project);
    
            if (!newProject) {
                return httpError(next, new Error(responseMessage.FAILED_OPERATION('Failed to create project')), req, 400);
            }
    
            httpResponse(req, res, 201, responseMessage.SUCCESS, newProject);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    getAllProjects: async (req, res, next) => {
        try {
            const { authenticatedUser } = req;
            
            const projects = await databaseService.getAllProjects(authenticatedUser._id);
            
            if (!projects || projects.length === 0) {
                return httpResponse(req, res, 200, responseMessage.NOT_FOUND('Data'));
            }
            
            httpResponse(req, res, 200, responseMessage.SUCCESS, projects);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    getProjectDetails: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { authenticatedUser } = req;
    
            const project = await databaseService.projectDetails(id);
    
            if (!project) {
                return httpError(next, new Error(responseMessage.NOT_FOUND('Project')), req, 404);
            }
            if (project.ownerId.toString() !== authenticatedUser._id.toString()) {
                return httpError(next, new Error(responseMessage.UNAUTHORIZED), req, 403);
            }
    
            httpResponse(req, res, 200, responseMessage.SUCCESS, project);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    deleteProject: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { authenticatedUser } = req;

            const deletedProject = await databaseService.deleteProject(id, authenticatedUser._id);

            if (!deletedProject) {
                return httpError(next, new Error(responseMessage.NOT_FOUND('Project')), req, 404);
            }

            httpResponse(req, res, 200, responseMessage.SUCCESS, deletedProject);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

};
