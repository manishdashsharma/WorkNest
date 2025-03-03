import { useState } from 'react';
import { uiConfig } from './projectManagementConfig';

const AddNewProject = ({ onClose, onSave }) => {
  const [projectForm, setProjectForm] = useState({
    name: '',
    status: uiConfig.statuses.active,
    totalBudget: '',
    totalSpent: 0,
    startDate: '',
    endDate: '',
    workers: [],
  });

  const [workerForm, setWorkerForm] = useState({
    name: '',
    phone: '',
    email: '',
    role: '',
    totalAmount: '',
    paidAmount: '',
    lastPaymentDate: '',
  });

  const [error, setError] = useState('');
  const [showWorkerForm, setShowWorkerForm] = useState(false);

  const roles = [
    'Developer',
    'UI Designer',
    'Project Manager',
    'QA Engineer',
    'DevOps Engineer',
  ];

  const calculateTotalSpent = () => {
    return projectForm.workers.reduce(
      (total, worker) => total + Number(worker.paidAmount),
      0
    );
  };

  const calculateRemainingBudget = () => {
    return Number(projectForm.totalBudget) - calculateTotalSpent();
  };

  const handleAddWorker = (e) => {
    if (
      !workerForm.name ||
      !workerForm.phone ||
      !workerForm.email ||
      !workerForm.role ||
      !workerForm.totalAmount ||
      !workerForm.paidAmount ||
      !workerForm.lastPaymentDate
    ) {
      setError('Please fill all worker details');
      return;
    }

    const remainingAmount =
      Number(workerForm.totalAmount) - Number(workerForm.paidAmount);

    const newWorker = {
      ...workerForm,
      id: Math.random().toString(36).substr(2, 9),
      remainingAmount,
      totalAmount: Number(workerForm.totalAmount),
      paidAmount: Number(workerForm.paidAmount),
    };

    setProjectForm((prev) => ({
      ...prev,
      workers: [...prev.workers, newWorker],
      totalSpent: calculateTotalSpent() + Number(workerForm.paidAmount),
    }));

    setWorkerForm({
      name: '',
      phone: '',
      email: '',
      role: '',
      totalAmount: '',
      paidAmount: '',
      lastPaymentDate: '',
    });
    setShowWorkerForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (new Date(projectForm.startDate) > new Date(projectForm.endDate)) {
        setError('Start date cannot be later than end date');
        return;
      }

      if (calculateTotalSpent() > Number(projectForm.totalBudget)) {
        setError('Total spent amount exceeds project budget');
        return;
      }

      const newProject = {
        ...projectForm,
        id: Math.random().toString(36).substr(2, 9),
        remainingBudget: calculateRemainingBudget(),
        totalSpent: calculateTotalSpent(),
        workers: projectForm.workers.map(worker => ({
          ...worker,
          totalAmount: Number(worker.totalAmount),
          paidAmount: Number(worker.paidAmount),
          remainingAmount: Number(worker.totalAmount) - Number(worker.paidAmount)
        }))
      };

      newProject.totalBudget = Number(newProject.totalBudget);

      await onSave(newProject);
      onClose();
    } catch (err) {
      setError('Failed to create project');
      console.error('Project creation error:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 z-50 overflow-y-auto">
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl p-3 md:p-6 w-full max-w-4xl my-2 md:my-4 h-[calc(100vh-2rem)] md:h-auto overflow-y-auto shadow-xl border border-slate-700/50">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-b from-slate-800 to-slate-800/95 backdrop-blur-sm z-10 flex justify-between items-center mb-6 pb-4 border-b border-slate-700/50">
          <h3 className="text-xl md:text-2xl font-bold text-white bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
            New Project
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all p-2 rounded-lg"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm backdrop-blur-sm animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          {/* Project Details Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="block text-slate-300 text-sm font-medium">
                Project Name
              </label>
              <input
                type="text"
                value={projectForm.name}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, name: e.target.value })
                }
                className="w-full bg-slate-800/50 rounded-lg p-3 text-white border border-slate-600/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none text-sm transition-all placeholder:text-slate-500"
                required
                placeholder="Enter project name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-slate-300 text-sm font-medium">
                Total Budget
              </label>
              <input
                type="number"
                value={projectForm.totalBudget}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    totalBudget: e.target.value,
                  })
                }
                className="w-full bg-slate-800/50 rounded-lg p-3 text-white border border-slate-600/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none text-sm transition-all placeholder:text-slate-500"
                required
                min="0"
                placeholder="Enter budget amount"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-slate-300 text-sm font-medium">
                Start Date
              </label>
              <input
                type="date"
                value={projectForm.startDate}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, startDate: e.target.value })
                }
                className="w-full bg-slate-800/50 rounded-lg p-3 text-white border border-slate-600/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none text-sm transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-slate-300 text-sm font-medium">
                End Date
              </label>
              <input
                type="date"
                value={projectForm.endDate}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, endDate: e.target.value })
                }
                className="w-full bg-slate-800/50 rounded-lg p-3 text-white border border-slate-600/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none text-sm transition-all"
                required
              />
            </div>
          </div>

          {/* Workers Section */}
          <div className="border-t border-slate-700/50 pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h4 className="text-lg font-semibold text-white bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">Project Team</h4>
              <button
                type="button"
                onClick={() => setShowWorkerForm(true)}
                className="w-full sm:w-auto px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all text-sm font-medium shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 focus:ring-2 focus:ring-violet-600/50"
              >
                Add Team Member
              </button>
            </div>

            {/* Worker Form */}
            {showWorkerForm && (
              <div className="mb-8 p-4 md:p-6 border border-slate-700/50 rounded-xl bg-slate-800/50 backdrop-blur-sm">
                <h5 className="text-lg font-semibold text-white mb-6">
                  New Team Member
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="block text-slate-300 text-sm font-medium">Name</label>
                    <input
                      type="text"
                      value={workerForm.name}
                      onChange={(e) =>
                        setWorkerForm({ ...workerForm, name: e.target.value })
                      }
                      className="w-full bg-slate-800/50 rounded-lg p-3 text-white border border-slate-600/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none text-sm transition-all placeholder:text-slate-500"
                      required
                      placeholder="Enter name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-slate-300 text-sm font-medium">Phone</label>
                    <input
                      type="tel"
                      value={workerForm.phone}
                      onChange={(e) =>
                        setWorkerForm({ ...workerForm, phone: e.target.value })
                      }
                      className="w-full bg-slate-800/50 rounded-lg p-3 text-white border border-slate-600/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none text-sm transition-all placeholder:text-slate-500"
                      required
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-slate-300 text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={workerForm.email}
                      onChange={(e) =>
                        setWorkerForm({ ...workerForm, email: e.target.value })
                      }
                      className="w-full bg-slate-800/50 rounded-lg p-3 text-white border border-slate-600/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none text-sm transition-all placeholder:text-slate-500"
                      required
                      placeholder="Enter email address"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-slate-300 text-sm font-medium">Role</label>
                    <select
                      value={workerForm.role}
                      onChange={(e) =>
                        setWorkerForm({ ...workerForm, role: e.target.value })
                      }
                      className="w-full bg-slate-800/50 rounded-lg p-3 text-white border border-slate-600/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none text-sm transition-all"
                      required
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-slate-300 text-sm font-medium">
                      Total Amount
                    </label>
                    <input
                      type="number"
                      value={workerForm.totalAmount}
                      onChange={(e) =>
                        setWorkerForm({
                          ...workerForm,
                          totalAmount: e.target.value,
                        })
                      }
                      className="w-full bg-slate-800/50 rounded-lg p-3 text-white border border-slate-600/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none text-sm transition-all placeholder:text-slate-500"
                      required
                      min="0"
                      placeholder="Enter total amount"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-slate-300 text-sm font-medium">
                      Paid Amount
                    </label>
                    <input
                      type="number"
                      value={workerForm.paidAmount}
                      onChange={(e) =>
                        setWorkerForm({
                          ...workerForm,
                          paidAmount: e.target.value,
                        })
                      }
                      className="w-full bg-slate-800/50 rounded-lg p-3 text-white border border-slate-600/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none text-sm transition-all placeholder:text-slate-500"
                      required
                      min="0"
                      placeholder="Enter paid amount"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-slate-300 text-sm font-medium">
                      Last Payment Date
                    </label>
                    <input
                      type="date"
                      value={workerForm.lastPaymentDate}
                      onChange={(e) =>
                        setWorkerForm({
                          ...workerForm,
                          lastPaymentDate: e.target.value,
                        })
                      }
                      className="w-full bg-slate-800/50 rounded-lg p-3 text-white border border-slate-600/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none text-sm transition-all"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2 flex flex-col sm:flex-row justify-end gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowWorkerForm(false)}
                      className="w-full sm:w-auto px-6 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddWorker}
                      className="w-full sm:w-auto px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all text-sm font-medium shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 focus:ring-2 focus:ring-violet-600/50"
                    >
                      Add Member
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Workers List */}
            <div className="space-y-4">
              {projectForm.workers.map((worker) => (
                <div key={worker.id} className="bg-slate-800/50 p-4 md:p-6 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all group">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <div className="space-y-1">
                      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Name</p>
                      <p className="text-white text-sm md:text-base font-medium">{worker.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Role</p>
                      <p className="text-white text-sm md:text-base">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
                          {worker.role}
                        </span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Contact</p>
                      <p className="text-white text-sm md:text-base">{worker.phone}</p>
                      <p className="text-slate-400 text-xs md:text-sm break-all group-hover:text-violet-400 transition-colors">{worker.email}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Payment Details</p>
                      <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                        <p className="text-white text-sm md:text-base font-medium">
                          Total: ₹{worker.totalAmount.toLocaleString()}
                        </p>
                        <p className="text-emerald-400 text-sm md:text-base">
                          Paid: ₹{worker.paidAmount.toLocaleString()}
                        </p>
                        <p className="text-amber-400 text-sm md:text-base">
                          Remaining: ₹{worker.remainingAmount.toLocaleString()}
                        </p>
                        <p className="text-slate-400 text-xs">
                          Last Paid: {new Date(worker.lastPaymentDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Section */}
          <div className="border-t border-slate-700/50 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Total Budget</p>
                <p className="text-white text-lg md:text-xl font-semibold">
                  ₹{Number(projectForm.totalBudget || 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Total Spent</p>
                <p className="text-emerald-400 text-lg md:text-xl font-semibold">
                  ₹{calculateTotalSpent().toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Remaining Budget</p>
                <p className="text-amber-400 text-lg md:text-xl font-semibold">
                  ₹{calculateRemainingBudget().toLocaleString()}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-gradient-to-t from-slate-900 to-slate-900/95 backdrop-blur-sm pt-4 -mx-3 px-3 md:-mx-6 md:px-6 border-t border-slate-700/50">
              <div className="flex flex-col sm:flex-row justify-end gap-3 pb-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all text-sm font-medium shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 focus:ring-2 focus:ring-violet-600/50"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewProject;