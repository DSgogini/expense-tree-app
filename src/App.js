import "./App.css";
import HeaderComponent from "./Components/HeaderComponent.js";
import HomeComponent from "./Components/HomeComponent.js";
import MyComponentFooter from "./Components/MyComponentFooter";

function App() {
  return (
    <div className="App">
      <HeaderComponent />
      <HomeComponent />
      <MyComponentFooter />
    </div>
  );
}

export default App;
