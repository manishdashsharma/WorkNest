 
// projectManagementConfig.js

import toast from 'react-hot-toast';

// Exchange rate for USD to INR conversion
const USD_TO_INR_RATE = 83.5;

// Function to convert any dollar amount to rupees
const convertToRupees = (dollarAmount) => {
  return Math.round(dollarAmount * USD_TO_INR_RATE);
};

export const uiConfig = {
  title: 'Project Management',
  buttonTitles: {
    addProject: 'Add New Project',
    addWorker: 'Add Worker',
  },
  statuses: {
    active: 'Active',
    pending: 'Pending',
    completed: 'Completed',
  },
  currency: '₹', // Using Indian Rupee symbol
};

export const projectApi = {
  // Helper function to get projects from localStorage
  getStoredProjects: async () => {
    const storedProjects = localStorage.getItem('projects');
    const defaultProjects = [
      {
        id: 1,
        name: 'Website Redesign',
        status: 'Active',
        totalBudget: convertToRupees(50000), // ₹4,175,000
        paidAmount: convertToRupees(20000), // ₹1,670,000
        startDate: '2024-01-01',
        endDate: '2024-06-30',
        workers: [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '123-456-7890',
            role: 'Lead Developer',
            totalAmount: convertToRupees(15000), // ₹1,252,500
            paidAmount: convertToRupees(10000), // ₹835,000
            lastPayment: '2024-01-15',
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '123-456-7891',
            role: 'UI Designer',
            totalAmount: convertToRupees(12000), // ₹1,002,000
            paidAmount: convertToRupees(6000), // ₹501,000
            lastPayment: '2024-01-20',
          },
        ],
      },
      {
        id: 2,
        name: 'Mobile App Development',
        status: 'Pending',
        totalBudget: convertToRupees(75000), // ₹6,262,500
        paidAmount: convertToRupees(25000), // ₹2,087,500
        startDate: '2024-02-01',
        endDate: '2024-08-31',
        workers: [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '123-456-7890',
            role: 'Lead Developer',
            totalAmount: convertToRupees(15000), // ₹1,252,500
            paidAmount: convertToRupees(10000), // ₹835,000
            lastPayment: '2024-01-15',
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '123-456-7891',
            role: 'UI Designer',
            totalAmount: convertToRupees(12000), // ₹1,002,000
            paidAmount: convertToRupees(6000), // ₹501,000
            lastPayment: '2024-01-20',
          },
        ],
      },
      {
        id: 3,
        name: 'E-commerce Platform',
        status: 'Active',
        totalBudget: convertToRupees(100000), // ₹8,350,000
        paidAmount: convertToRupees(15000), // ₹1,252,500
        startDate: '2024-03-01',
        endDate: '2024-12-31',
        workers: [
          {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike@example.com',
            phone: '123-456-7892',
            role: 'Backend Developer',
            totalAmount: convertToRupees(20000), // ₹1,670,000
            paidAmount: convertToRupees(15000), // ₹1,252,500
            lastPayment: '2024-02-28',
          },
        ],
      },
    ];

    return storedProjects
      ? [...defaultProjects, ...JSON.parse(storedProjects)]
      : defaultProjects;
  },

  // Get all projects
  getAllProjects: async () => {
    try {
      const projects = await projectApi.getStoredProjects();
      // Ensure all project IDs are strings
      return projects.map((project) => ({
        ...project,
        id: String(project.id),
      }));
    } catch (error) {
      toast.error('Error fetching projects:', error);
      throw error;
    }
  },

  // Get project by ID
  getProjectById: async (id) => {
    try {
      const projects = await projectApi.getStoredProjects();
      // Convert both IDs to strings for comparison
      return projects.find((p) => String(p.id) === String(id));
    } catch (error) {
      toast.error('Error fetching project:', error);
      throw error;
    }
  },

  // Add new project
  addProject: async (projectData) => {
    try {
      const projects = await projectApi.getStoredProjects();
      const newProject = {
        ...projectData,
        // Ensure ID is a string for consistent comparison
        id: String(Date.now()),
        paidAmount: 0,
        workers: [],
        // Convert budget to number (assuming input is already in rupees)
        totalBudget: Number(projectData.totalBudget),
        startDate: new Date(projectData.startDate).toISOString().split('T')[0],
        endDate: new Date(projectData.endDate).toISOString().split('T')[0],
      };

      // Only store the new projects (not the default ones)
      const storedProjects = JSON.parse(
        localStorage.getItem('projects') || '[]'
      );
      const updatedProjects = [...storedProjects, newProject];
      localStorage.setItem('projects', JSON.stringify(updatedProjects));

      return newProject;
    } catch (error) {
      toast.error('Error adding project:', error);
      throw error;
    }
  },

  // Update existing project
  updateProject: async (projectId, projectData) => {
    try {
      const projects = await projectApi.getStoredProjects();
      const updatedProjects = projects.map((project) =>
        project.id === projectId ? { ...project, ...projectData } : project
      );
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      return projectData;
    } catch (error) {
      toast.error('Error updating project:', error);
      throw error;
    }
  },

  // Delete project
  deleteProject: async (projectId) => {
    try {
      const projects = await projectApi.getStoredProjects();
      const updatedProjects = projects.filter(
        (project) => project.id !== projectId
      );
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      return true;
    } catch (error) {
      toast.error('Error deleting project:', error);
      throw error;
    }
  },

  // Add worker to project
  addWorker: async (workerData) => {
    try {
      const projects = await projectApi.getStoredProjects();
      const projectId = workerData.projectId;
      const newWorker = {
        id: Date.now(),
        ...workerData,
        // Ensure totalAmount is stored as a number
        totalAmount: Number(workerData.totalAmount),
        paidAmount: 0,
        lastPayment: new Date().toISOString().split('T')[0],
      };

      const updatedProjects = projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            workers: [...project.workers, newWorker],
          };
        }
        return project;
      });

      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      return newWorker;
    } catch (error) {
      toast.error('Error adding worker:', error);
      throw error;
    }
  },

  // Update worker
  updateWorker: async (workerId, workerData) => {
    try {
      const projects = await projectApi.getStoredProjects();
      const updatedProjects = projects.map((project) => ({
        ...project,
        workers: project.workers.map((worker) =>
          worker.id === workerId ? { ...worker, ...workerData } : worker
        ),
      }));

      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      return workerData;
    } catch (error) {
      toast.error('Error updating worker:', error);
      throw error;
    }
  },

  // Format currency for display
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }
};