import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Features from "../components/Features";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <Stats />

        <Features />

        <section className="glass-panel">
          <h2>Terms & Conditions</h2>

          <ul
            style={{
              marginTop: "20px",
              paddingLeft: "20px",
              color: "#555555",
              lineHeight: "1.8",
            }}
          >
            <li>
              Students must maintain accurate
              academic and personal information.
            </li>

            <li>
              Placement eligibility is subject to
              institute guidelines and company
              criteria.
            </li>

            <li>
              Companies are responsible for
              updating recruitment status and
              selection results.
            </li>

            <li>
              Any misuse of the system may result
              in account suspension.
            </li>

            <li>
              Placement records are maintained for
              academic and reporting purposes.
            </li>
          </ul>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;