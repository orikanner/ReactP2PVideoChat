import React, { useState } from 'react';
import { SignInForm, SignUpForm } from './AuthForms';
import { useAuth } from '../context/AuthContext';  

function AuthBox() {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { login, register } = useAuth();  // Assuming 'register' is your sign-up function

  const toggleAuthMode = () => {
    setIsSigningUp(!isSigningUp);
  };

  return (
    <div style={{ width: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', textAlign: 'center' }}>
      {isSigningUp ? 
        <SignUpForm onSignUp={register} onToggle={toggleAuthMode} /> : 
        <SignInForm onSignIn={login} onToggle={toggleAuthMode} />
      }
    </div>
  );
}

export default AuthBox;
