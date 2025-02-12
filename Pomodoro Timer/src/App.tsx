import Quote from "./Components/Quote";
import Settings from "./Components/Settings";
import Tasks from "./Components/Tasks";
import { Provider } from "./Components/Context/Provider";
import Timer from "./Components/Timer";

const App = (): React.ReactNode => {
  return (
    <>
      <Provider>
        <header id="header">
          <h1>Pomodoro Timer</h1>
          <Settings />
        </header>
        <Tasks />
        <div id="divider"></div>
        <Timer />
        <Quote />
      </Provider>
    </>
  );
};

export default App;
