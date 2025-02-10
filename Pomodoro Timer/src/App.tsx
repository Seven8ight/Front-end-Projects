import Quote from "./Components/Quote";
import Tasks from "./Components/Tasks";
import Timer from "./Components/Timer";

const App = (): React.ReactNode => {
  return (
    <>
      <Tasks />
      <div id="divider"></div>
      <Timer />
      <Quote />
    </>
  );
};

export default App;
