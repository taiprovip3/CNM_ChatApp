import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from './Components/provider/AuthProvider';
import HomepageScreen from './Components/screen/HomepageScreen';
import AuthenticationScreen from './Components/screen/AuthenticationScreen';
import WhiteBoxReducerProvider from './Components/provider/WhiteBoxReducerProvider';
export default function App() {
  return (
    <AuthProvider>
      <WhiteBoxReducerProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<HomepageScreen />} />
          <Route exact path="/auth" element={<AuthenticationScreen />} />
        </Routes>
      </Router>
      </WhiteBoxReducerProvider>
    </AuthProvider>
  );
}
