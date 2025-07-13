import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import MainPage from './MainPage';
import Summary from './Summary';
import './App.css';
import ProfilePage from './profile';
import Bookings from './booking';
import { useEffect } from 'react';
import { loginUser, signupUser } from './api';

// This component will contain all your login/signup logic and has access to useNavigate
function AuthFlows({
  showForgotPassword, setShowForgotPassword,
  showSignUp, setShowSignUp,
  showCreateAccount, setShowCreateAccount,
  showResetPassword, setShowResetPassword,
  showSuccessMessage, setShowSuccessMessage,
  successMessageText, setSuccessMessageText,
  loginUsername, setLoginUsername,
  loginPassword, setLoginPassword,
  forgotEmail, setForgotEmail,
  newPassword, setNewPassword,
  confirmPassword, setConfirmPassword,
  passwordMismatchError, setPasswordMismatchError,
  signupUsername, setSignupUsername,
  signupPassword, setSignupPassword,
  accountType, setAccountType,
  setLoggedInUser,
  resetAllFlowsAndForms,
  loginError, setLoginError,           // ✅ Added for login error handling
  signupError, setSignupError,
  forgotError, setForgotError        // ✅ Added for signup error handling
}) {
  const navigate = useNavigate();
 // CORRECT: AuthFlows is rendered inside Routes, which is inside BrowserRouter

  // State for password visibility
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);


  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!loginUsername || !loginPassword) {
      console.log("Please enter both username and password to log in.");
      return;
    }

    try {
      const userData = await loginUser(loginUsername, loginPassword);

      setLoggedInUser(userData.username);
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("loggedInUser", userData.username);
      localStorage.setItem("userCoins", userData.coins.toString());
      localStorage.setItem("myBookings", JSON.stringify(userData.bookings || []));
      localStorage.setItem("userEmail", userData.email); // ✅ Move inside the try block

      navigate('/home');
    } catch (err) {
      setLoginError("INVALID USERNAME OR PASSWORD");
    }
  };

  const handleForgotPasswordClick = () => {
    resetAllFlowsAndForms();
    setShowForgotPassword(true);
  };

  const handleSignUpClick = (e) => {
    e.preventDefault();
    resetAllFlowsAndForms();
    setSignupError("");
    setLoginError(""); // ✅ Clear login error when switching to sign-up
    setShowSignUp(true);
  };

  const handleForgotEmailChange = (e) => {
    setForgotEmail(e.target.value);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setForgotError(""); // Clear previous error

    if (!forgotEmail) {
      alert("Please enter your email.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: forgotEmail })
      });

      const data = await response.json();

      if (!response.ok) {
        setForgotError(data.error || "ACCOUNT DOES NOT EXIST");
        return;
      }

      // Email exists — allow reset
      console.log(`Proceeding with email: ${forgotEmail} for password reset`);
      setShowResetPassword(true);

    } catch (err) {
      setForgotError("Server error. Please try again later.");
    }
  };




  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    setPasswordMismatchError(false);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMismatchError(false);
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordMismatchError(true);
      return;
    }
    setPasswordMismatchError(false);

    try {
      const response = await fetch("http://localhost:5000/api/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: forgotEmail,         // email entered during forgot step
          newPassword: newPassword    // new password to update
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setForgotError(data.error || "Password reset failed");
        return;
      }

      setSuccessMessageText("YOU SUCCESSFULLY CHANGED THE PASSWORD");
      setShowResetPassword(false);
      setShowSuccessMessage(true);

    } catch (err) {
      setForgotError("Server error. Please try again later.");
    }
  };


  const handleCreateAccountSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail || !accountType || !signupUsername || !signupPassword) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await signupUser(signupUsername, forgotEmail, signupPassword, accountType);
      setSuccessMessageText("YOU SUCCESSFULLY CREATED THE ACCOUNT");
      setShowSignUp(false);
      setShowSuccessMessage(true);
    } catch (err) {
      setSignupError("ACCOUNT EXISTS");
    }
  };



  return (
  <>
    {/* Welcome Message Header - Renders only with AuthFlows component */}
    <header className="welcome-message">
      <h1>Welcome to the Universal Ticket Booking System!</h1>
      <p>Your one-stop platform for booking movie tickets, concert tickets, and railway tickets.</p>
      <p>Seamlessly manage your bookings, profile, and more.</p>
    </header>

    <div className="auth-container">
      {!showForgotPassword && !showSignUp && !showResetPassword && !showSuccessMessage ? (
        // Login Form
        <>
        {loginError && <p className="centered-error">{loginError}</p>}
          <h2>Login</h2>
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="loginUsernameInput">Username:</label>
              <input
                type="text"
                id="loginUsernameInput"
                name="loginUsernameInput"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="loginPasswordInput">Password:</label>
              <div className="password-input-wrapper">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  id="loginPasswordInput"
                  name="loginPasswordInput"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password-button"
                  onClick={() => setShowLoginPassword((prev) => !prev)}
                >
                  {showLoginPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <button type="submit" className="sign-in-button">Sign In</button>
          </form>
          <p className="link-option" onClick={handleForgotPasswordClick}>Forgot password?</p>
          <p className="signup-text">
            Don't have an account? <a href="#" onClick={handleSignUpClick}>Sign Up here!</a>
          </p>
        </>
      ) : showSuccessMessage ? (
        // Success Message
        <>
          <p className="success-message">{successMessageText}</p>
          <button className="sign-in-button" onClick={resetAllFlowsAndForms}>LOGIN</button>
        </>
      ) : showSignUp ? (
        // Unified Sign-Up Form
        <>
          {signupError && <p className="centered-error">{signupError}</p>}
          <h2>Sign Up</h2>
          <form onSubmit={handleCreateAccountSubmit}>
            <div className="form-group">
              <label htmlFor="emailInput">Email Address:</label>
              <input
                type="email"
                id="emailInput"
                name="emailInput"
                value={forgotEmail}
                onChange={handleForgotEmailChange}
                required
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="accountTypeSelect">Account Type:</label>
              <select
                id="accountTypeSelect"
                name="accountTypeSelect"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="select-input"
                required
              >
                <option value="" disabled>Select Type</option>
                <option value="user">User</option>
                <option value="vendor">Vendor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="signupUsernameInput">Username:</label>
              <input
                type="text"
                id="signupUsernameInput"
                name="signupUsernameInput"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="signupPasswordInput">Password:</label>
              <div className="password-input-wrapper">
                <input
                  type={showSignupPassword ? "text" : "password"}
                  id="signupPasswordInput"
                  name="signupPasswordInput"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password-button"
                  onClick={() => setShowSignupPassword((prev) => !prev)}
                >
                  {showSignupPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <button type="submit" className="sign-in-button">Create Account</button>
          </form>
          <p className="link-option" onClick={resetAllFlowsAndForms}>Back to Login</p>
        </>
      ) : showResetPassword ? (
        // Reset Password Form
        <>
          <h2>Reset Password</h2>
          {passwordMismatchError && <p className="error-message">PASSWORDS DO NOT MATCH</p>}
          <form onSubmit={handleResetPasswordSubmit}>
            <div className="form-group">
              <label htmlFor="newPasswordInput">New Password:</label>
              <div className="password-input-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPasswordInput"
                  name="newPasswordInput"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password-button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPasswordInput">Confirm Password:</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPasswordInput"
                  name="confirmPasswordInput"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password-button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <button type="submit" className="sign-in-button">Set New Password</button>
          </form>
          <p className="link-option" onClick={resetAllFlowsAndForms}>Back to Login</p>
        </>
      ) : (
        // Forgot Password Email Step
        <>
          {forgotError && (
            <p style={{
              color: 'red',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '10px'
            }}>
              {forgotError}
            </p>
          )}
          <h2>Forgot Password</h2>
          <form onSubmit={handleEmailSubmit}>
            <div className="form-group">
              <label htmlFor="emailInput">Email Address:</label>
              <input
                type="email"
                id="emailInput"
                name="emailInput"
                value={forgotEmail}
                onChange={handleForgotEmailChange}
                required
                autoComplete="off"
              />
            </div>
            <button type="submit" className="sign-in-button">Submit</button>
          </form>
          <p className="link-option" onClick={resetAllFlowsAndForms}>Back to Login</p>
        </>
      )}
    </div>
  </>
);

}


// A new component to hold all the state and global handlers that need `useNavigate`
// This component will be rendered inside BrowserRouter
function AppContent() {
  // All state variables are now managed in this top-level component that is inside BrowserRouter
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [forgotEmail, setForgotEmail] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatchError, setPasswordMismatchError] = useState(false);

  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [accountType, setAccountType] = useState('');

  const [successMessageText, setSuccessMessageText] = useState('');
  const [loggedInUser, setLoggedInUser] = useState('');
// State to track logged in user
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [forgotError, setForgotError] = useState("");
  const navigate = useNavigate();

// ✅ Logout user on every page refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) {
      navigate('/');
    }
  }, []);

 // CORRECT: This AppContent is now inside BrowserRouter
  
  // Helper to reset ALL relevant form-related states
  const resetFormStates = () => {
    setLoginUsername('');
    setLoginPassword('');
    setForgotEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordMismatchError(false);
    setSignupUsername('');
    setSignupPassword('');
    setAccountType('');
    setSuccessMessageText('');
    setLoggedInUser(''); // Clear logged in user on 
    localStorage.removeItem("loggedInUser"); // ✅ Clear on logout
    localStorage.removeItem("myBookings"); // 🧼 Clear on logout
  };

  // Helper to reset ALL flow control states and form states
  const resetAllFlowsAndForms = () => {
    setShowForgotPassword(false);
    setShowSignUp(false);
    setShowResetPassword(false);
    setShowSuccessMessage(false);
    setSignupError(""); // ✅ Clear sign-up error
    setLoginError("");
    resetFormStates();
    navigate('/'); // Redirect to login page after reset/logout
  };

  const handleLogout = () => { // Logout handler
    resetAllFlowsAndForms();
  };


  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={
          <AuthFlows
            showForgotPassword={showForgotPassword} setShowForgotPassword={setShowForgotPassword}
            showSignUp={showSignUp} setShowSignUp={setShowSignUp}
            showResetPassword={showResetPassword} setShowResetPassword={setShowResetPassword}
            showSuccessMessage={showSuccessMessage} setShowSuccessMessage={setShowSuccessMessage}
            successMessageText={successMessageText} setSuccessMessageText={setSuccessMessageText}
            loginUsername={loginUsername} setLoginUsername={setLoginUsername}
            loginPassword={loginPassword} setLoginPassword={setLoginPassword}
            forgotEmail={forgotEmail} setForgotEmail={setForgotEmail}
            newPassword={newPassword} setNewPassword={setNewPassword}
            confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
            passwordMismatchError={passwordMismatchError} setPasswordMismatchError={setPasswordMismatchError}
            signupUsername={signupUsername} setSignupUsername={setSignupUsername}
            signupPassword={signupPassword} setSignupPassword={setSignupPassword}
            accountType={accountType} setAccountType={setAccountType}
            setLoggedInUser={setLoggedInUser}
            resetAllFlowsAndForms={resetAllFlowsAndForms}
            loginError={loginError} setLoginError={setLoginError}            // ✅ Added
            signupError={signupError} setSignupError={setSignupError}  
            forgotError={forgotError} setForgotError={setForgotError}      // ✅ Added
          />
        } />
        <Route path="/home" element={
          <MainPage loggedInUser={loggedInUser} handleLogout={handleLogout} />
        } />
        <Route path="/summary" element={<Summary />} />
        <Route path="/profile" element={
          <ProfilePage
            loggedInUser={loggedInUser}
            handleLogout={handleLogout}
            loginPassword={loginPassword}
            setLoggedInUser={setLoggedInUser} // This `loginPassword` state is from AppContent, consider if you need a separate password state in ProfilePage for updating password.
          />
        } />
        <Route path="/bookings" element={<Bookings />} />
      </Routes>
    </div>
  );
}

// The root App component just provides the BrowserRouter
function App() {
  return (
    <BrowserRouter>
      <AppContent /> {/* Render the AppContent component inside BrowserRouter */}
    </BrowserRouter>
  );
}

export default App;