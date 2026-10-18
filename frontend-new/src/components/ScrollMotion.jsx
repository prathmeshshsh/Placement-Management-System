import { useEffect } from "react";

const TARGETS = [
  ".dashboard-header", ".dashboard-hero", ".welcome-card", ".kpi-card", ".stat-card",
  ".glass-panel", ".chart-card", ".chart-panel", ".analytics-card", ".quick-card",
  ".student-table", ".table-container", ".profile-card", ".profile-section", ".job-card",
  ".form-section", ".activity-item", ".timeline-card", ".feature-card", ".hero-content",
  "main > section", ".dashboard-content > section"
].join(",");

export default function ScrollMotion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let sequence = 0;
    const observer = !reduced && "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("pms-revealed");
            observer.unobserve(entry.target);
          }
        }), { threshold: 0.12, rootMargin: "0px 0px -42px 0px" })
      : null;
    const scan = () => document.querySelectorAll(TARGETS).forEach((node) => {
      if (node.dataset.pmsMotion) return;
      node.dataset.pmsMotion = "1";
      node.style.setProperty("--pms-reveal-delay", `${(sequence++ % 5) * 65}ms`);
      if (observer) observer.observe(node);
      else node.classList.add("pms-revealed");
    });
    scan();
    const mutation = new MutationObserver(scan);
    mutation.observe(document.getElementById("root") || document.body, { childList: true, subtree: true });
    return () => { observer?.disconnect(); mutation.disconnect(); };
  }, []);
  return null;
}
