
import { useState, useEffect } from 'react';
import {
  RefreshCw,
  BarChart2,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Users,
  AlertCircle,
} from 'lucide-react';
import { fetchProjectData, formatCurrency } from './homeConfig.js';

const StatusBadge = ({ status }) => {
  const statusColors = {
    'In Progress': 'bg-teal-900 text-teal-300',
    Pending: 'bg-amber-900 text-amber-300',
    'Not Started': 'bg-gray-800 text-gray-400',
    Completed: 'bg-emerald-900 text-emerald-300',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium 
      ${statusColors[status] || 'bg-gray-800 text-gray-400'}`}
    >
      {status}
    </span>
  );
};

const ProgressBar = ({ progress, status }) => {
  const getColor = () => {
    switch (status) {
      case 'In Progress':
        return 'bg-teal-600';
      case 'Completed':
        return 'bg-emerald-600';
      case 'Pending':
        return 'bg-amber-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="w-full bg-gray-800 rounded-full h-2.5">
      <div
        className={`${getColor()} h-2.5 rounded-full transition-all duration-500`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

const ProjectDashboard = () => {
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProjectData = async () => {
    try {
      const data = await fetchProjectData();
      setProjectData(data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="flex items-center space-x-3 text-teal-400">
          <RefreshCw className="animate-spin" />
          <span className="text-lg font-semibold">Loading Project Details...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-900 to-red-800">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl text-center">
          <AlertTriangle className="mx-auto text-red-500 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Project Data Unavailable
          </h2>
          <button
            onClick={loadProjectData}
            className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-3 sm:p-6 text-gray-100">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Project Overview */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border border-gray-700 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-teal-400">
              {projectData.project.name}
            </h1>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="flex items-center space-x-2">
                <Clock className="text-teal-500" size={20} />
                <span className="text-sm sm:text-base text-gray-400">
                  {projectData.project.timeline.start} -{' '}
                  {projectData.project.timeline.end}
                </span>
              </div>
              <StatusBadge status={projectData.project.status} />
            </div>
          </div>
          <div className="w-full sm:w-auto text-left sm:text-right">
            <p className="text-gray-500">Total Budget</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-400">
              {formatCurrency(projectData.project.totalBudget)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Contractor Profile */}
          <div className="bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-teal-400">
                Contractor Profile
              </h2>
              <CheckCircle className="text-emerald-500" />
            </div>
            <div>
              <div className="flex items-center mb-4">
                <div>
                  <p className="text-lg sm:text-xl font-semibold text-gray-200">
                    {projectData.contractor.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {projectData.contractor.position}
                  </p>
                </div>
              </div>
              <div className="bg-gray-900 p-3 sm:p-4 rounded-lg space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="text-teal-500" size={20} />
                  <span className="text-sm sm:text-base text-gray-300">
                    {projectData.contractor.phone}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="text-teal-500" size={20} />
                  <span className="text-sm sm:text-base text-gray-300 break-all">
                    {projectData.contractor.email}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="text-teal-500" size={20} />
                  <span className="text-sm sm:text-base text-gray-300">
                    {projectData.contractor.address}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="text-teal-500" size={20} />
                  <span className="text-sm sm:text-base text-gray-300">
                    Key Contacts:{' '}
                    {projectData.contractor.keyContacts
                      .map((contact) => contact.name)
                      .join(', ')}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-gray-500">Total Earnings</p>
                    <p className="text-xl sm:text-2xl font-bold text-emerald-400">
                      {formatCurrency(projectData.contractor.totalEarnings)}
                    </p>
                    <p className="text-gray-500 mt-1">Expected Profit</p>
                    <p className="text-lg sm:text-xl font-bold text-green-400">
                      {formatCurrency(projectData.contractor.expectedProfit, 'INR')}
                    </p>
                  </div>
                  <DollarSign className="text-emerald-500" size={40} />
                </div>
              </div>
            </div>
          </div>

          {/* Work Packages */}
          <div className="bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <BarChart2 className="text-teal-500 mr-3" />
              <h2 className="text-xl sm:text-2xl font-bold text-teal-400">
                Work Packages
              </h2>
            </div>
            <div className="space-y-3">
              {projectData.workPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-gray-900 p-3 sm:p-4 rounded-lg hover:bg-gray-700 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 space-y-2 sm:space-y-0">
                    <div>
                      <h3 className="font-semibold text-teal-300">{pkg.name}</h3>
                      <p className="text-xs text-gray-500">{pkg.description}</p>
                    </div>
                    <StatusBadge status={pkg.status} />
                  </div>
                  <ProgressBar progress={pkg.progress} status={pkg.status} />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Progress</span>
                    <span>{pkg.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Metrics */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center mb-4">
            <AlertCircle className="text-amber-500 mr-3" />
            <h2 className="text-xl sm:text-2xl font-bold text-teal-400">
              Project Metrics
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 p-4 rounded-lg text-center">
              <p className="text-gray-500 mb-2">Overall Progress</p>
              <p className="text-xl sm:text-2xl font-bold text-teal-400">
                {projectData.projectMetrics.overallProgress}%
              </p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg text-center">
              <p className="text-gray-500 mb-2">Risks Identified</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-400">
                {projectData.projectMetrics.risksIdentified}
              </p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg text-center">
              <p className="text-gray-500 mb-2">Critical Risks</p>
              <p className="text-xl sm:text-2xl font-bold text-red-400">
                {projectData.projectMetrics.criticalRisks}
              </p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg text-center">
              <p className="text-gray-500 mb-2">Milestones</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400">
                {projectData.projectMetrics.milestonesMet}/
                {projectData.projectMetrics.totalMilestones}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;