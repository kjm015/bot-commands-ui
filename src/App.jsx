import springLogo from './assets/spring.png'
import './App.css'
import CommandsDataChart from "./components/CommandsDataChart.jsx";

function App() {

    return (
        <>
            <div>
                <a href="https://start.spring.io/" target="_blank">
                    <img src={springLogo} className="logo spring" alt="Spring logo"/>
                </a>
            </div>
            <h1>Spring Discord Bot Data Visualizer</h1>
            <h2>
                Commands Usage Chart
            </h2>

            <div className="command-portal">
                <CommandsDataChart/>
            </div>
        </>
    )
}

export default App
