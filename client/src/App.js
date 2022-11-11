/* eslint-disable no-unused-vars */
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from './Components/provider/AuthProvider';
import HomepageScreen from './Components/screen/HomepageScreen';
import AuthenticationScreen from './Components/screen/AuthenticationScreen';
import WhiteBoxReducerProvider from './Components/provider/WhiteBoxReducerProvider';
import LoadingScreen from './Components/screen/LoadingScreen';
import { AppContext, AppProvider } from './Components/provider/AppProvider';

export default function App() {

  return (
    <AuthProvider>
      <WhiteBoxReducerProvider>
        <AppProvider>
          <Router>
            <Routes>
              <Route exact path="/" element={<AuthenticationScreen />} />
              <Route exact path="/load" element={<LoadingScreen />} />
              <Route exact path="/home" element={<HomepageScreen />} />
            </Routes>
          </Router>
          </AppProvider>
      </WhiteBoxReducerProvider>
    </AuthProvider>
  );
}
