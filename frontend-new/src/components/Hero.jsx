
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function PlacementNetwork() {
  const nodes = [
    [540, 120],
    [680, 190],
    [820, 100],
    [920, 210],
    [500, 280],
    [740, 340],
    [850, 300],
    [610, 410],
    [390, 400],
    [720, 510],
    [880, 450],
    [460, 540],
    [960, 550],
  ];

  return (
    <div className="placement-network" aria-hidden="true">
      <svg
        className="placement-network-svg"
        viewBox="0 0 1000 650"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="network-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08" />
          </linearGradient>

          <radialGradient id="network-node">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className="network-lines">
          <path d="M540 120 L680 190 L820 100 L920 210" />
          <path d="M540 120 L500 280 L680 190 L740 340" />
          <path d="M680 190 L850 300 L920 210" />
          <path d="M500 280 L610 410 L740 340 L850 300" />
          <path d="M610 410 L720 510 L880 450 L850 300" />
          <path d="M740 340 L880 450 L960 550" />
          <path d="M500 280 L390 400 L610 410" />
          <path d="M390 400 L460 540 L720 510" />
          <path d="M820 100 L850 300" />
          <path d="M920 210 L960 550" />
          <path d="M680 190 L610 410" />
          <path d="M540 120 L390 400" />
          <path d="M460 540 L610 410 L880 450" />
        </g>

        <g className="network-signals">
          <path d="M540 120 L680 190 L820 100" />
          <path d="M500 280 L610 410 L740 340" />
          <path d="M610 410 L720 510 L880 450" />
          <path d="M680 190 L850 300 L920 210" />
        </g>

        <g className="network-nodes">
          {nodes.map(([cx, cy], index) => (
            <g
              key={`${cx}-${cy}`}
              className={`network-node node-${index % 4}`}
            >
              <circle cx={cx} cy={cy} r="17" fill="url(#network-node)" />
              <circle
                cx={cx}
                cy={cy}
                r={index % 3 === 0 ? 4 : 2.5}
                fill="#ffffff"
              />
              <circle
                cx={cx}
                cy={cy}
                r="8"
                stroke="#ffffff"
                strokeOpacity="0.45"
                strokeWidth="0.8"
              />
            </g>
          ))}
        </g>

        <g className="network-labels">
          <g transform="translate(510 78)">
            <rect width="96" height="25" rx="3" />
            <text x="12" y="16">STUDENTS</text>
          </g>

          <g transform="translate(695 151)">
            <rect width="105" height="25" rx="3" />
            <text x="12" y="16">RECRUITERS</text>
          </g>

          <g transform="translate(755 380)">
            <rect width="105" height="25" rx="3" />
            <text x="12" y="16">INTERVIEWS</text>
          </g>

          <g transform="translate(735 542)">
            <rect width="77" height="25" rx="3" />
            <text x="12" y="16">OFFERS</text>
          </g>
        </g>
      </svg>
    </div>
  );
}

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <PlacementNetwork />

      <div className="hero-container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >

          <h1 className="hero-title">
            Campus Placements
            <br />
            Made Intelligent
          </h1>

          <div className="hero-buttons">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="primary-btn"
              onClick={() => navigate("/dashboard")}
            >
              Explore Platform
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="secondary-btn"
              onClick={() => navigate("/placements")}
            >
              View Statistics
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
