import Header from "./components/Header";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
function App() {
  const skills = [
    "Python",
    "Machine Learning",
    "React",
    "JavaScript",
    "SQL"
  ];

  return (
    <div>
      <Header name="Jeel Pipaliya" />

      <About
        description="I am a B.Tech AIML student interested in Artificial Intelligence, Machine Learning and Web Development."
      />

      <Skills skillList={skills} />

      <Projects />

      <Footer email="jeelpipaliya07@gmail.com" />
    </div>
  );
}

export default App;