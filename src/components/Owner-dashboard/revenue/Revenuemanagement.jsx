import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import Sidebar from "../Sidebar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Revenuemanagement = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [clientCount, setClientCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [clerkCount, setClerkCount] = useState(0);
  const [monthlySales, setMonthlySales] = useState([]);
  const [clientProjects, setClientProjects] = useState({ clients: [], counts: [] });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetch("http://localhost/login-backend/Owner-management/getCounts.php")
      .then((response) => response.json())
      .then((data) => {
        setClientCount(data.clients);
        setProjectCount(data.projects);
      })
      .catch((error) => console.error("Error fetching counts:", error));

    const fetchUsers = async () => {
      try {
        const employeeRes = await fetch(
          "http://localhost/login-backend/Owner-management/view_employees.php"
        );
        const employeeData = await employeeRes.json();
        setEmployeeCount(employeeData.length);

        const clerkRes = await fetch(
          "http://localhost/login-backend/Owner-management/view_clerks.php"
        );
        const clerkData = await clerkRes.json();
        setClerkCount(clerkData.length);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    const fetchMonthlySales = async () => {
      try {
        const response = await fetch(
          `http://localhost/login-backend/Owner-management/getMonthlySales.php?year=${selectedYear}`
        );
        const data = await response.json();
        if (data.success) {
          setMonthlySales(data.sales);
        } else {
          console.error("Failed to fetch monthly sales:", data.message);
        }
      } catch (error) {
        console.error("Error fetching monthly sales:", error);
      }
    };

    const fetchClientProjects = async () => {
      try {
        const response = await fetch(
          "http://localhost/login-backend/Owner-management/getClientProjects.php"
        );
        const data = await response.json();
        if (data.success) {
          setClientProjects({ clients: data.clients, counts: data.counts });
        } else {
          console.error("Failed to fetch client projects:", data.message);
        }
      } catch (error) {
        console.error("Error fetching client projects:", error);
      }
    };

    fetchUsers();
    fetchMonthlySales();
    fetchClientProjects();
  }, [selectedYear]);

  // Gradient backgrounds
  const gradient1 = (context) => {
    const { chart } = context;
    const ctx = chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
    gradient.addColorStop(0, "rgba(75, 192, 192, 1)");
    gradient.addColorStop(1, "rgba(75, 192, 192, 0.1)");
    return gradient;
  };

  const gradient2 = (context) => {
    const { chart } = context;
    const ctx = chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
    gradient.addColorStop(0, "rgba(153, 102, 255, 1)");
    gradient.addColorStop(1, "rgba(153, 102, 255, 0.1)");
    return gradient;
  };

  // Monthly Sales Graph
  const barData1 = {
    labels: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    datasets: [
      {
        label: `Sales (in ₹) - ${selectedYear}`,
        data: monthlySales.length ? monthlySales : Array(12).fill(0),
        backgroundColor: (context) => gradient1(context),
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

  // Companies Projects Graph
  const barData2 = {
    labels: clientProjects.clients.length ? clientProjects.clients : ["No Data"],
    datasets: [
      {
        label: "Project Count",
        data: clientProjects.counts.length ? clientProjects.counts : [0],
        backgroundColor: (context) => gradient2(context),
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 2,
      },
    ],
  };

  const barOptions1 = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#333", font: { size: 14 } },
      },
      title: {
        display: true,
        text: "Monthly Sales",
        color: "#333",
        font: { size: 18 },
      },
      tooltip: {
        callbacks: {
          label: (context) => "₹" + context.raw.toLocaleString(), // Exact rupees with commas
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#333" } },
      y: {
        grid: { color: "rgba(200, 200, 200, 0.5)" },
        ticks: {
          color: "#333",
          callback: (value) => "₹" + value.toLocaleString(), // Exact rupees with commas
        },
      },
    },
  };

  const barOptions2 = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#333", font: { size: 14 } },
      },
      title: {
        display: true,
        text: "Top 5 Client Projects",
        color: "#333",
        font: { size: 18 },
      },
      tooltip: {
        callbacks: {
          label: (context) => context.raw + " Projects",
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#333" } },
      y: {
        grid: { color: "rgba(200, 200, 200, 0.5)" },
        ticks: { color: "#333" },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <div className="flex">
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <main className="flex-1">
          <header className="bg-white p-4 shadow-md flex items-center justify-between">
            <img
              src="https://www.saisamarthpolytech.com/images/logo.png"
              alt="Sai Samarth Polytech"
              className="h-10 w-auto"
            />
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none lg:hidden"
            >
              <FaBars size={24} />
            </button>
          </header>
          <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-8">
            <p className="text-gray-600">
              Welcome to the Revenue Management Dashboard.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                { title: "Clients", count: clientCount },
                { title: "Projects", count: projectCount },
                { title: "Clerks", count: clerkCount },
                { title: "Employees", count: employeeCount },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-md text-center"
                >
                  <h3 className="text-lg font-semibold text-gray-700">
                    {item.title}
                  </h3>
                  <p className="text-2xl font-bold text-black mt-2">
                    {item.count}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-12">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Monthly Sales</h3>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="p-2 border rounded-lg bg-orange-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {[2023, 2024, 2025].map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <Bar data={barData1} options={barOptions1} />
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Bar data={barData2} options={barOptions2} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Revenuemanagement;