import { motion } from "framer-motion";

function SuccessStories() {
  return (
    <section className="success-section">
      <div className="section-header">
        <span>SUCCESS STORIES</span>
        <h2>Student Achievements</h2>
      </div>

      <div className="success-grid">

        <motion.div
          className="success-card"
          whileHover={{ y: -10 }}
        >
          <div className="avatar">A</div>
          <h3>Student Name</h3>
          <p>Placed at Company</p>
        </motion.div>

        <motion.div
          className="success-card"
          whileHover={{ y: -10 }}
        >
          <div className="avatar">B</div>
          <h3>Student Name</h3>
          <p>Placed at Company</p>
        </motion.div>

        <motion.div
          className="success-card"
          whileHover={{ y: -10 }}
        >
          <div className="avatar">C</div>
          <h3>Student Name</h3>
          <p>Placed at Company</p>
        </motion.div>

      </div>
    </section>
  );
}

export default SuccessStories;