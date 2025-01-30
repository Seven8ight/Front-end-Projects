import Border from "./Components/Border";

const App = (): React.ReactNode => {
  return (
    <>
      <header>
        <h1>Flash Cards</h1>
      </header>
      <Border />
      <section id="footer">
        <p>These are qns featuring the javascript coding language</p>
        <p>
          <i>Designed by Cube</i>
        </p>
      </section>
    </>
  );
};

export default App;
