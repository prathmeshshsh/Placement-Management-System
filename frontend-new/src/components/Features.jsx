import { motion } from "framer-motion";

const features = [
  {
    title: "Student Management",
    desc: "Manage student profiles, academic records and placement eligibility."
  },
  {
    title: "Company Management",
    desc: "Track recruiters, job postings and hiring drives."
  },
  {
    title: "Application Tracking",
    desc: "Monitor every student application in real time."
  },
  {
    title: "Resume Repository",
    desc: "Centralized storage for resumes and documents."
  },
  {
    title: "Placement Analytics",
    desc: "Visual insights and performance metrics."
  },
  {
    title: "Interview Scheduling",
    desc: "Manage interview rounds and recruitment workflow."
  }
];

function Features() {
  return (
    <section className="features-section">
      <div className="section-header">
        <span>FEATURES</span>
        <h2>Everything Needed For Placements</h2>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="feature-card"
            whileHover={{
              y: -10,
              scale: 1.02,
            }}
          >
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Features;