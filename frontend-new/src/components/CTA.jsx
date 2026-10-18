import { motion } from "framer-motion";

function CTA() {
  return (
    <section className="cta-section">

      <motion.div
        className="cta-card"
        whileHover={{
          scale: 1.02
        }}
      >
        <h2>
          Ready To Begin Your
          Placement Journey?
        </h2>

        <p>
          Connect students, recruiters and
          opportunities through one platform.
        </p>

        <button className="cta-btn">
          Get Started
        </button>
      </motion.div>

    </section>
  );
}

export default CTA;