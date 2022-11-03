import React, { useReducer } from 'react';
import LoginBoxComponent from '../fragment/homepage/LoginBoxComponent';
import LoginOTPBoxComponent from '../fragment/homepage/LoginOTPBoxComponent';
import RegisterBoxComponent from '../fragment/homepage/RegisterBoxComponent';
import RegisterOtpBoxComponent from '../fragment/homepage/RegisterOtpBoxComponent';
import VerifyOtpBoxComponent from '../fragment/homepage/VerifyOtpBoxComponent';
import ForgotPasswordBoxComponent from '../fragment/homepage/ForgotPasswordBoxComponent';
import ResetPasswordOTPBoxComponent from '../fragment/homepage/ResetPasswordOTPBoxComponent';

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
    const resetPasswordOTPBoxComponent = () => {
      return <ResetPasswordOTPBoxComponent />;
  }

    const factoryReducer = (state, action) => {
        switch(action){
          case "SHOW_LOGIN_BOX_COMPONENT":
            return loginBoxComponent();
          case "SHOW_LOGIN_OTP_BOX_COMPONENT":
            return loginOTPBoxComponent();
          case "SHOW_REGISTER_BOX_COMPONENT":
            return registerBoxComponent();
          case "SHOW_REGISTER_OTP_BOX_COMPONENT":
            return registerOtpBoxComponent();
          case "SHOW_VERIFY_OTP_BOX_COMPONENT":
            return verifyOtpBoxComponent();
          case "SHOW_FORGOT_PASSWORD_BOX_COMPONENT":
            return forgotPasswordBoxComponent();
          case "SHOW_RESET_PASSWORD_OTP_BOX_COMPONENT":
            return resetPasswordOTPBoxComponent();
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
