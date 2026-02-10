import { Link } from "react-router-dom";
import {
  FaBrain,
  FaFire,
  FaChartLine,
  FaTrophy,
  FaClock,
} from "react-icons/fa";
import { MdSchool } from "react-icons/md";

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-green-50 text-gray-800">

      {/* ---------- HEADER ---------- */}
      <header className="flex justify-between items-center px-10 py-4 bg-white shadow">
        <div className="flex items-center gap-2">
          <FaBrain className="text-green-600 text-3xl" />
          <h1 className="text-2xl font-bold text-green-700">
            LearnFocus
          </h1>
        </div>

        <nav className="space-x-6">
          <Link to="/login" className="text-gray-600 hover:text-green-600">
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="text-center px-6 py-20">
        <h2 className="text-4xl font-bold mb-4">
          Focus Better. Learn Smarter.
        </h2>

        <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-10">
          LearnFocus is a digital study coach that helps you stay disciplined,
          block distractions, and build strong learning habits using focused
          study sessions and smart analytics.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="border border-green-600 text-green-600 px-8 py-3 rounded-full hover:bg-green-100"
          >
            Login
          </Link>
        </div>
      </section>

      {/* ---------- STATS / CARDS ---------- */}
      <section className="px-10 pb-16">
        <div className="grid md:grid-cols-3 gap-8">

          {/* Streak Card */}
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <FaFire className="text-orange-500 text-4xl mx-auto mb-2" />
            <h3 className="font-bold text-xl">Current Streak</h3>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              7 Days
            </p>
            <p className="text-gray-500 mt-1">
              Keep going! Consistency wins.
            </p>
          </div>

          {/* League Card */}
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <FaTrophy className="text-gray-500 text-4xl mx-auto mb-2" />
            <h3 className="font-bold text-xl">Silver League</h3>
            <p className="text-gray-600 mt-2">
              Ranked <span className="font-bold">#12</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Earn XP to reach Gold
            </p>
          </div>

          {/* Focus Time */}
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <FaClock className="text-green-600 text-4xl mx-auto mb-2" />
            <h3 className="font-bold text-xl">Daily Focus Goal</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">
              2 Hours
            </p>
            <p className="text-gray-500 mt-1">
              Today’s target
            </p>
          </div>

        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section className="py-16 px-10 bg-white">
        <h3 className="text-3xl font-bold text-center mb-12">
          What Does LearnFocus Do?
        </h3>

        <div className="grid md:grid-cols-4 gap-8">

          <Feature
            icon={<MdSchool />}
            title="Structured Learning"
            text="Choose DSA, Web Development, Aptitude, or custom skills with a guided learning path."
          />

          <Feature
            icon={<FaClock />}
            title="Focus Sessions"
            text="Distraction-free study mode with timers, fullscreen enforcement, and monitoring."
          />

          <Feature
            icon={<FaChartLine />}
            title="Analytics"
            text="Daily focus graphs, productivity hours, and performance insights."
          />

          <Feature
            icon={<FaTrophy />}
            title="Gamification"
            text="Build streaks, earn badges, and stay motivated long-term."
          />

        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="py-16 text-center bg-green-600 text-white">
        <h3 className="text-3xl font-bold mb-4">
          Your Focused Learning Journey Starts Here
        </h3>
        <Link
          to="/register"
          className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-100"
        >
          Create Free Account
        </Link>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="bg-gray-900 text-white text-center py-4">
        <p>© 2026 LearnFocus — Your Digital Study Coach</p>
      </footer>
    </div>
  );
}

/* ---------- Feature Card Component ---------- */
function Feature({ icon, title, text }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow text-center">
      <div className="text-green-600 text-3xl mb-3 mx-auto">
        {icon}
      </div>
      <h4 className="font-bold mb-2">{title}</h4>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}

export default Home;
