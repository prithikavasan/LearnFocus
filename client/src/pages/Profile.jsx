import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { Clock, Target, Flame, BarChart3, CheckCircle } from "lucide-react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const MONTH_NAMES = [
  { name: "Jan", days: 31 },
  { name: "Feb", days: 28 },
  { name: "Mar", days: 31 },
  { name: "Apr", days: 30 },
  { name: "May", days: 31 },
  { name: "Jun", days: 30 },
  { name: "Jul", days: 31 },
  { name: "Aug", days: 31 },
  { name: "Sep", days: 30 },
  { name: "Oct", days: 31 },
  { name: "Nov", days: 30 },
  { name: "Dec", days: 31 },
];

function Profile() {
  const { user } = useContext(AuthContext);
  const [progressData, setProgressData] = useState([]);
  const [streaks, setStreaks] = useState(user?.streak || 0);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await API.get("/users/me/progress");
        setProgressData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProgress();
  }, []);

  const getDayColor = (count) => {
    if (count === 0) return "bg-gray-200";
    if (count < 2) return "bg-green-400";
    if (count < 4) return "bg-green-500";
    return "bg-green-600";
  };

  const buildContributionGrid = () => {
    const grid = {};
    MONTH_NAMES.forEach((month) => {
      grid[month.name] = Array(month.days).fill(0);
    });

    progressData.forEach((day) => {
      const date = new Date(day.date);
      const month = MONTH_NAMES[date.getMonth()].name;
      const dayIndex = date.getDate() - 1;
      grid[month][dayIndex] = day.completedPomodoros || 0;
    });

    return grid;
  };

  const contributionGrid = buildContributionGrid();

  // Line chart for focus minutes
  const lineChartData = {
    labels: progressData.map((d) => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: "Minutes Focused",
        data: progressData.map((d) => d.minutes),
        borderColor: "#4f46e5",
        backgroundColor: "#6366f1",
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#374151" } },
      title: { display: true, text: "Focus Progress Over Time", color: "#374151" },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: "#374151" } },
      x: { ticks: { color: "#374151" } },
    },
  };

  // Doughnut chart for Pomodoro completion vs target
  const totalPomodoros = progressData.reduce((acc, day) => acc + (day.completedPomodoros || 0), 0);
  const dailyTarget = user?.pomodoroTarget || 4;
  const doughnutData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [totalPomodoros, Math.max(0, dailyTarget * progressData.length - totalPomodoros)],
        backgroundColor: ["#10B981", "#D1D5DB"],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom", labels: { color: "#374151" } },
      title: { display: true, text: "Pomodoro Completion", color: "#374151" },
    },
    cutout: "70%",
  };

  // Example stats for cards
  const totalMinutes = progressData.reduce((acc, day) => acc + (day.minutes || 0), 0);
  const avgFocus = progressData.length > 0 ? Math.round(totalMinutes / progressData.length) : 0;
  const weeklyFocus = avgFocus * 7;

  return (
    <div className="min-h-screen bg-white p-8 text-gray-800">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header / Student Info */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <p className="text-gray-500">{user?.email}</p>
            <p className="text-gray-600 mt-2">Learning Goal: {user?.learningGoal || "Not set"}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-gray-100 p-6 rounded-xl flex flex-col items-center">
            <Target className="text-purple-600 mb-2" />
            <p className="text-gray-500 text-sm">Current Goal</p>
            <p className="font-bold text-gray-800">{user?.learningGoal || "Not set"}</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-xl flex flex-col items-center">
            <BarChart3 className="text-green-600 mb-2" />
            <p className="text-gray-500 text-sm">Today's Progress</p>
            <p className="font-bold text-gray-800">{user?.todayFocusMinutes || 0} mins</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-xl flex flex-col items-center">
            <Flame className="text-orange-500 mb-2" />
            <p className="text-gray-500 text-sm">Streak</p>
            <p className="font-bold text-gray-800">{streaks} days</p>
            <p className="text-gray-400 text-xs mt-1">Max Streak: {user?.maxStreak || 0}</p>
            <p className="text-gray-400 text-xs">Total Active Days: {user?.totalActiveDays || 0}</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-xl flex flex-col items-center">
            <CheckCircle className="text-blue-500 mb-2" />
            <p className="text-gray-500 text-sm">Average Daily Focus</p>
            <p className="font-bold text-gray-800">{avgFocus} mins</p>
          </div>
        </div>

        {/* Circular / Doughnut Chart */}
        <div className="bg-gray-50 p-6 rounded-xl flex justify-center items-center">
          <div className="w-64 h-64">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Contribution Grid */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Activity Heatmap</h2>
          <div className="flex flex-wrap gap-8">
            {MONTH_NAMES.map((month) => (
              <div key={month.name}>
                <p className="text-gray-500 text-xs text-center mb-1">{month.name}</p>
                <div className="grid grid-cols-7 gap-1">
                  {contributionGrid[month.name].map((count, idx) => (
                    <div
                      key={idx}
                      className={`w-4 h-4 rounded-sm ${getDayColor(count)}`}
                      title={`${count} Pomodoros`}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Focus Progress Over Time</h2>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>
    </div>
  );
}

export default Profile;
