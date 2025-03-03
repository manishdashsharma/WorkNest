import { FaHome, FaSignOutAlt,  } from 'react-icons/fa';
import { RiAdminFill } from 'react-icons/ri';

export const dashboardConfig = {
  logo: {
    title: 'WorkNest',
  },
  generalItems: [
    { label: 'Dashboard', icon: FaHome, path: '/dashboard', sublabels: [] },

    {
      label: 'Projects',
      icon: RiAdminFill,
      path: '/dashboard/project-management',
      sublabels: [],
    },

    // { label: "Users", icon: FaUsers, path: "/dashboard/user-page", sublabels: [] },

    // {
    //   label: "Help",
    //   icon: FaHandsHelping,
    //   path: "/dashboard/help",
    //   sublabels: [],
    // },
    {
      label: 'Logout',
      icon: FaSignOutAlt,
      path: '/dashboard/logout',
      sublabels: [],
    },
  ],
};
