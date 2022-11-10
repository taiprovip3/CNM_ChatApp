import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from './Components/provider/AuthProvider';
import HomepageScreen from './Components/screen/HomepageScreen';
import AuthenticationScreen from './Components/screen/AuthenticationScreen';
import WhiteBoxReducerProvider from './Components/provider/WhiteBoxReducerProvider';
import LoadingScreen from './Components/screen/LoadingScreen';
import { AppProvider } from './Components/provider/AppProvider';
export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
      <WhiteBoxReducerProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<HomepageScreen />} />
          <Route exact path="/load" element={<LoadingScreen />} />
          <Route exact path="/auth" element={<AuthenticationScreen />} />
        </Routes>
      </Router>
      </WhiteBoxReducerProvider>
      </AppProvider>
    </AuthProvider>
  );
}
