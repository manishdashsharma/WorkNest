
import { useState, useEffect } from 'react';
import { projectApi, uiConfig } from './projectManagementConfig.js';
import AddNewProject from './AddNewProject';

const ProjectManagementPage = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showAddProject, setShowAddProject] = useState(false);

  // Form states
  const [workerForm, setWorkerForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    totalAmount: 0,
  });

  const resetWorkerForm = () => {
    setWorkerForm({
      name: '',
      email: '',
      phone: '',
      role: '',
      totalAmount: 0,
    });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (editingWorker) {
      setWorkerForm({
        name: editingWorker.name || '',
        email: editingWorker.email || '',
        phone: editingWorker.phone || '',
        role: editingWorker.role || '',
        totalAmount: editingWorker.totalAmount || 0,
      });
    }
  }, [editingWorker]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectApi.getAllProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProject = async (newProject) => {
    try {
      setLoading(true);
      const savedProject = await projectApi.addProject(newProject);

      // Update the projects list to include the new project
      setProjects((prevProjects) => [...prevProjects, savedProject]);
      setError(null);
    } catch (err) {
      setError('Failed to create project');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = async (projectId) => {
    try {
      setLoading(true);
      const projectData = projects.find(
        (p) => String(p.id) === String(projectId)
      );

      if (!projectData) {
        throw new Error('Project not found');
      }
      setSelectedProject(projectData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch project details');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedProject(null);
  };

  const calculatePendingAmount = (worker) => {
    return worker.totalAmount - worker.paidAmount;
  };

  const handleWorkerSubmit = async (e) => {
    e.preventDefault();
    try {
      const newWorker = {
        ...workerForm,
        projectId: selectedProject.id,
        paidAmount: editingWorker ? editingWorker.paidAmount : 0,
        lastPayment: editingWorker
          ? editingWorker.lastPayment
          : new Date().toISOString(),
      };

      if (editingWorker) {
        await projectApi.updateWorker(editingWorker.id, newWorker);
      } else {
        await projectApi.addWorker(newWorker);
      }

      await handleProjectClick(selectedProject.id);
      setShowWorkerModal(false);
      setEditingWorker(null);
      resetWorkerForm();
    } catch (err) {
      setError('Failed to save worker details');
    }
  };

  const handlePaymentUpdate = async (workerId, newPaymentAmount) => {
    try {
      const worker = selectedProject.workers.find((w) => w.id === workerId);
      const updatedWorker = {
        ...worker,
        paidAmount: worker.paidAmount + Number(newPaymentAmount),
        lastPayment: new Date().toISOString(),
      };

      await projectApi.updateWorker(workerId, updatedWorker);
      await handleProjectClick(selectedProject.id);
      setShowPaymentModal(false);
      setPaymentHistory([
        ...paymentHistory,
        {
          amount: Number(newPaymentAmount),
          date: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setError('Failed to update payment');
    }
  };

  const BackButton = () => (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
    >
      <svg
        className="w-4 h-4 md:w-5 md:h-5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M15 19l-7-7 7-7" />
      </svg>
      <span className="text-sm md:text-base">Back to Projects</span>
    </button>
  );

  const ProjectCard = ({ project }) => (
    <div
      onClick={() => handleProjectClick(project.id)}
      className="bg-slate-800 rounded-lg border border-slate-700 p-4 md:p-6 cursor-pointer 
               hover:border-violet-500 transition-colors duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <h3 className="text-base md:text-lg font-semibold text-white">
          {project.name}
        </h3>
        <span
          className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm w-fit ${
            project.status === uiConfig.statuses.active
              ? 'bg-green-500 bg-opacity-20 text-green-300'
              : 'bg-yellow-500 bg-opacity-20 text-yellow-300'
          }`}
        >
          {project.status}
        </span>
      </div>
      <div className="space-y-2 text-slate-300 text-sm md:text-base">
        <p>Total Budget: ${project.totalBudget.toLocaleString()}</p>
        <p>Paid Amount: ${project.paidAmount.toLocaleString()}</p>
        <p>Team Size: {project.workers.length} members</p>
        <div className="text-xs md:text-sm text-slate-400">
          <p>Start: {new Date(project.startDate).toLocaleDateString()}</p>
          <p>End: {new Date(project.endDate).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );

  const WorkerFormModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50 overflow-y-auto">
      <div className="bg-slate-800 rounded-lg p-4 md:p-6 w-full max-w-md my-4">
        <h3 className="text-lg md:text-xl font-bold text-white mb-4">
          {editingWorker ? 'Edit Worker' : 'Add New Worker'}
        </h3>
        <form onSubmit={handleWorkerSubmit} className="space-y-4">
          {/* ... [Form fields remain the same] ... */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowWorkerModal(false);
                setEditingWorker(null);
                resetWorkerForm();
              }}
              className="w-full sm:w-auto px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              {editingWorker ? 'Update' : 'Add'} Worker
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const PaymentModal = ({ worker }) => {
    const [paymentAmount, setPaymentAmount] = useState('');
    const pendingAmount = calculatePendingAmount(worker);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50 overflow-y-auto">
        <div className="bg-slate-800 rounded-lg p-4 md:p-6 w-full max-w-md my-4">
          <h3 className="text-lg md:text-xl font-bold text-white mb-4">
            Update Payment
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-700 p-3 md:p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-3 md:gap-4 text-sm md:text-base">
                <div>
                  <p className="text-slate-400 text-xs md:text-sm">
                    Worker Name
                  </p>
                  <p className="text-white">{worker.name}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs md:text-sm">
                    Total Amount
                  </p>
                  <p className="text-white">
                    ${worker.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs md:text-sm">
                    Previously Paid
                  </p>
                  <p className="text-green-400">
                    ${worker.paidAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs md:text-sm">
                    Pending Amount
                  </p>
                  <p className="text-yellow-400">
                    ${pendingAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-slate-300 mb-1 text-sm md:text-base">
                Payment Amount
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="number"
                  max={pendingAmount}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="flex-1 bg-slate-700 rounded-lg p-2 text-white border border-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setPaymentAmount(pendingAmount.toString())}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Pay All
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePaymentUpdate(worker.id, paymentAmount)}
                className="w-full sm:w-auto px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                disabled={
                  !paymentAmount ||
                  Number(paymentAmount) <= 0 ||
                  Number(paymentAmount) > pendingAmount
                }
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProjectDetails = ({ project }) => (
    <div>
      <BackButton />
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <h2 className="text-lg md:text-xl font-bold text-white">
            {project.name}
          </h2>
          <div className="flex items-center gap-4">
            <span
              className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm ${
                project.status === uiConfig.statuses.active
                  ? 'bg-green-500 bg-opacity-20 text-green-300'
                  : 'bg-yellow-500 bg-opacity-20 text-yellow-300'
              }`}
            >
              {project.status}
            </span>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <div className="bg-slate-700 bg-opacity-50 p-3 md:p-4 rounded-lg">
              <p className="text-slate-300 text-sm">Total Budget</p>
              <p className="text-lg md:text-xl font-bold text-white">
                ${project.totalBudget.toLocaleString()}
              </p>
            </div>
            <div className="bg-slate-700 bg-opacity-50 p-3 md:p-4 rounded-lg">
              <p className="text-slate-300 text-sm">Total Paid</p>
              <p className="text-lg md:text-xl font-bold text-green-400">
                ${project.paidAmount.toLocaleString()}
              </p>
            </div>
            <div className="bg-slate-700 bg-opacity-50 p-3 md:p-4 rounded-lg">
              <p className="text-slate-300 text-sm">Total Pending</p>
              <p className="text-lg md:text-xl font-bold text-yellow-400">
                ${(project.totalBudget - project.paidAmount).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-slate-700 bg-opacity-30 p-3 md:p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <p className="text-slate-400 text-sm">Start Date</p>
                <p className="text-white">
                  {new Date(project.startDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">End Date</p>
                <p className="text-white">
                  {new Date(project.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
              <h4 className="text-base md:text-lg font-semibold text-white">
                Team Members
              </h4>
              <button
                onClick={() => setShowWorkerModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
              >
                {uiConfig.buttonTitles.addWorker}
              </button>
            </div>
            <div className="space-y-3 md:space-y-4">
              {project.workers.map((worker) => (
                <div
                  key={worker.id}
                  className="bg-slate-700 bg-opacity-30 p-3 md:p-4 rounded-lg"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{worker.name}</p>
                        <button
                          onClick={() => {
                            setEditingWorker(worker);
                            setWorkerForm(worker);
                            setShowWorkerModal(true);
                          }}
                          className="p-1 text-slate-400 hover:text-white transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="text-slate-400 text-sm">{worker.role}</p>
                      <p className="text-slate-400 text-sm mt-2">
                        {worker.email}
                      </p>
                      <p className="text-slate-400 text-sm">{worker.phone}</p>
                    </div>
                    <div className="text-left md:text-right space-y-1">
                      <p className="text-white">
                        Total: ${worker.totalAmount.toLocaleString()}
                      </p>
                      <p className="text-green-400">
                        Paid: ${worker.paidAmount.toLocaleString()}
                      </p>
                      <p className="text-yellow-400">
                        Pending: $
                        {calculatePendingAmount(worker).toLocaleString()}
                      </p>
                      <p className="text-xs md:text-sm text-slate-400">
                        Last Payment:{' '}
                        {new Date(worker.lastPayment).toLocaleDateString()}
                      </p>
                      {calculatePendingAmount(worker) > 0 && (
                        <button
                          onClick={() => {
                            setEditingWorker(worker);
                            setShowPaymentModal(true);
                          }}
                          className="w-full md:w-auto mt-2 px-3 py-1 bg-violet-600 text-white rounded hover:bg-violet-700 text-sm transition-colors"
                        >
                          Update Payment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="h-1 md:h-2 bg-violet-500"></div>
            <div className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-3 bg-slate-700 rounded-full">
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6 text-violet-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  {uiConfig.title}
                </h1>
              </div>
              <button
                onClick={() => setShowAddProject(true)}
                className="w-full sm:w-auto px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors text-sm md:text-base"
              >
                {uiConfig.buttonTitles.addProject}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-violet-400 text-sm md:text-base">
              Loading...
            </div>
          </div>
        ) : error ? (
          <div className="text-red-400 text-center p-3 md:p-4 bg-red-900 bg-opacity-20 rounded-lg text-sm md:text-base">
            {error}
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {!selectedProject ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <ProjectDetails project={selectedProject} />
            )}
          </div>
        )}

        {/* Modals */}
        {showAddProject && (
          <AddNewProject
            onClose={() => setShowAddProject(false)}
            onSave={handleSaveProject}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectManagementPage;
