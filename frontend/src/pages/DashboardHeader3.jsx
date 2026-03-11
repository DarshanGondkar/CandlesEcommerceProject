import React from 'react';
//import { useNavigate } from 'react-router-dom';
       import { Link } from "react-router-dom";

export default function DashboardHeader3() {
   // const navigate = useNavigate();

    return (

<header className="flex items-center p-2 bg-dark shadow-lg">
  <Link
    to="/UserDashboard"
    className="flex items-center gap-2 px-2 py-1 rounded-lg bg-primary text-gray-200 text-lg font-medium hover:bg-gray-200 hover:text-white transition-all duration-200 active:scale-95"
  >
    <span className="text-2xl">←</span>
    <span>back</span>
  </Link>
</header>

    );
}