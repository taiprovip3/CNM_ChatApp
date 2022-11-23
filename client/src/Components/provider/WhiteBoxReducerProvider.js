/* eslint-disable no-unused-vars */
import React, { useReducer } from 'react';
import LoginBoxComponent from '../fragment/authentication/LoginBoxComponent';
import LoginOTPBoxComponent from '../fragment/authentication/LoginOTPBoxComponent';
import RegisterBoxComponent from '../fragment/authentication/RegisterBoxComponent';
import RegisterOtpBoxComponent from '../fragment/authentication/RegisterOtpBoxComponent';
import VerifyOtpBoxComponent from '../fragment/authentication/VerifyOtpBoxComponent';
import ForgotPasswordBoxComponent from '../fragment/authentication/ForgotPasswordBoxComponent';
export const WhiteBoxReducerContext = React.createContext();
export default function WhiteBoxReducerProvider({ children }) {

    const loginBoxComponent = () => {
        return <LoginBoxComponent />;
    }
    const loginOTPBoxComponent = () => {
      return <LoginOTPBoxComponent />;
    }
    const registerBoxComponent = () => {
        return <RegisterBoxComponent />;
    }
    const registerOtpBoxComponent = () => {
        return <RegisterOtpBoxComponent />;
    }
    const verifyOtpBoxComponent = () => {
        return <VerifyOtpBoxComponent />;
    }
    const forgotPasswordBoxComponent = () => {
        return <ForgotPasswordBoxComponent />;
    }

    const factoryReducer = (state, action) => {
        switch(action){
          case "SHOW_LOGIN_BOX_COMPONENT":
            return <LoginBoxComponent />;
          case "SHOW_LOGIN_OTP_BOX_COMPONENT":
            return <LoginOTPBoxComponent />;
          case "SHOW_REGISTER_BOX_COMPONENT":
            return <RegisterBoxComponent />;
          case "SHOW_REGISTER_OTP_BOX_COMPONENT":
            return <RegisterOtpBoxComponent />;
          case "SHOW_VERIFY_OTP_BOX_COMPONENT":
            return <VerifyOtpBoxComponent />;
          case "SHOW_FORGOT_PASSWORD_BOX_COMPONENT":
            return <ForgotPasswordBoxComponent />;
          default:
            return state;
        }
    };
        const [myState, dispatch] = useReducer(factoryReducer, loginBoxComponent());

        return (
        <WhiteBoxReducerContext.Provider value={{ myState, dispatch }}>
            {children}
        </WhiteBoxReducerContext.Provider>
        );
}
