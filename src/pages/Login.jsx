// import { useRef, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { api } from "../lib/api";
// import { setToken } from "../lib/auth";
// import AdminBrandLogo from "../components/AdminBrandLogo";
// import { useAuth } from "../context/AuthContext";
// import "../app.css"

// export default function Login() {
//   const { sendOtp } = useAuth();
//   const [datas, setDatas] = useState("")
//   const navigate = useNavigate();
//   const location = useLocation();
//   const from = location.state?.from?.pathname || "/";

//   const [email, setEmail] = useState("");
//   // const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);


//   const inputsRef = useRef([]);


//   async function onSubmit(e) {


//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       // const data = await api.login(email);
//       const res = await fetch("http://localhost:3000/admin/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           email,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.message || "Login failed");
//       }

//       if (data.success) {
//         setLoading(false)
//         setSuccess(true)
//         setDatas(data.otp)
//       }

//       // setToken(data.token);
//       // navigate(from, { replace: true });
//     } catch (err) {
//       setError(err?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   }





//   const handleChange = (value, index) => {
//     if (!/^\d?$/.test(value)) return;

//     const updatedOtp = [...otp];
//     updatedOtp[index] = value;
//     setOtp(updatedOtp);

//     if (value && index < 5) {
//       inputsRef.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputsRef.current[index - 1]?.focus();
//     }
//   };

//   const handleVerifyOtp = async () => {
//     try {
//       setError("");

//       const finalOtp = otp.join("");

//       if (finalOtp.length !== 6) {
//         return setError("Please enter complete OTP");
//       }

//       setLoading(true);
//       console.log(datas)
//       console.log(finalOtp)
//       const res = await fetch("http://localhost:3000/admin/otp/verify", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           otp_id: datas,
//           otp: finalOtp,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "OTP verification failed");
//       }

//       if(data.success){

//       }
//       console.log(data);

//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="loginUiShell">
//       {
//         success ?
//           <div className="otpWrapper">
//             <h1 className="otpTitle">Verify OTP</h1>

//             <p className="otpSubtitle">
//               Enter the 6-digit code sent to your email
//             </p>

//             <div className="otpInputs">
//               {otp.map((digit, index) => (
//                 <input
//                   key={index}
//                   ref={(el) => (inputsRef.current[index] = el)}
//                   maxLength="1"
//                   value={digit}
//                   className="otpInput"
//                   onChange={(e) => handleChange(e.target.value, index)}
//                   onKeyDown={(e) => handleKeyDown(e, index)}
//                 />
//               ))}
//             </div>

//             {/* {error && (
//               <p
//                 style={{
//                   color: "red",
//                   textAlign: "center",
//                   marginBottom: "14px",
//                 }}
//               >
//                 {error}
//               </p>
//             )} */}

//             <button
//               className="otpBtn"
//               onClick={handleVerifyOtp}
//               disabled={loading}
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>

//             <button
//               className="resendBtn"
//               // onClick={handleResendOtp}
//             >
//               Resend OTP
//             </button>
//           </div>
//           :
//           <div className="loginUiCardWrap">
//             <div className="card loginCard loginUiCard">
//               <div className="loginBrand loginUiBrand">
//                 <AdminBrandLogo variant="login" />
//               </div>
//               <h1 className="title loginUiTitle">Log In</h1>
//               <p className="subtitle loginUiSubtitle">Welcome back! Please login to your account.</p>

//               <form onSubmit={onSubmit}>
//                 <div className="field">
//                   <div className="label loginUiLabel">Email Address</div>
//                   <input
//                     className="input loginUiInput"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     autoComplete="username"
//                     type="email"
//                     required
//                   />
//                 </div>

//                 {/* <div className="field">
//               <div className="label loginUiLabel">Password</div>
//               <input
//                 className="input loginUiInput"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 autoComplete="current-password"
//                 type="password"
//                 required
//               />
//             </div> */}

//                 {/* <label className="loginUiRemember">
//               <input type="checkbox" />
//               <span>Remember Me</span>
//             </label> */}

//                 <button className="btn loginUiBtn" disabled={loading} type="submit">
//                   {loading ? "Signing in..." : "Log In"}
//                 </button>

//                 {/* <button type="button" className="loginUiForgotBtn">
//               Lost your password?
//             </button> */}

//                 {error ? <div className="error loginUiError">{error}</div> : null}
//               </form>
//             </div>
//           </div>
//       }


//       <div className="loginUiVisual" aria-hidden="true">
//         <div className="loginUiVisualOverlay" />
//       </div>
//     </div>
//   );
// }




import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminBrandLogo from "../components/AdminBrandLogo";
import { useAuth } from "../context/AuthContext";
import "../app.css";

export default function Login() {

  const { sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [otp_id, setOtpId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const inputsRef = useRef([]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await sendOtp(email);
      if (data.success) {
        setSuccess(true);
        setOtpId(data.otp);
      }
    } catch (err) {
      setError(
        err?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setError("");
      const finalOtp = otp.join("");
      if (finalOtp.length !== 6) {
        return setError(
          "Please enter complete OTP"
        );
      }
      setLoading(true);
      const data = await verifyOtp(
        otp_id,
        finalOtp
      );

      if (data.success) {
        navigate(from, {
          replace: true,
        });
      }
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
        "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await sendOtp(email);
      if (data.success) {
        setOtpId(data.otp_id);
        setOtp([
          "",
          "",
          "",
          "",
          "",
          "",
        ]);
      }
    } catch (err) {
      setError(
        err.message ||
        "Failed to resend OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginUiShell">
      {
        success ? (

          <div className="otpWrapper">

            <h1 className="otpTitle">
              Verify OTP
            </h1>

            <p className="otpSubtitle">
              Enter the 6-digit code sent to your email
            </p>

            <div className="otpInputs">

              {
                otp.map((digit, index) => (

                  <input
                    key={index}
                    ref={(el) =>
                      (inputsRef.current[index] = el)
                    }
                    maxLength="1"
                    value={digit}
                    className="otpInput"
                    onChange={(e) =>
                      handleChange(
                        e.target.value,
                        index
                      )
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(e, index)
                    }
                  />
                ))
              }
            </div>

            {
              error && (
                <div className="error loginUiError">
                  {error}
                </div>
              )
            }

            <button
              className="otpBtn"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {
                loading
                  ? "Verifying..."
                  : "Verify OTP"
              }
            </button>

            <button
              className="resendBtn"
              onClick={handleResendOtp}
              disabled={loading}
            >
              Resend OTP
            </button>

          </div>

        ) : (

          <div className="loginUiCardWrap">

            <div className="card loginCard loginUiCard">

              <div className="loginBrand loginUiBrand">
                <AdminBrandLogo variant="login" />
              </div>

              <h1 className="title loginUiTitle">
                Log In
              </h1>

              <p className="subtitle loginUiSubtitle">
                Welcome back! Please login to your account.
              </p>

              <form onSubmit={onSubmit}>

                <div className="field">

                  <div className="label loginUiLabel">
                    Email Address
                  </div>

                  <input
                    className="input loginUiInput"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    autoComplete="username"
                    type="email"
                    required
                  />
                </div>

                <button
                  className="btn loginUiBtn"
                  disabled={loading}
                  type="submit"
                >
                  {
                    loading
                      ? "Sending OTP..."
                      : "Log In"
                  }
                </button>

                {
                  error && (
                    <div className="error loginUiError">
                      {error}
                    </div>
                  )
                }

              </form>
            </div>
          </div>
        )
      }

      <div
        className="loginUiVisual"
        aria-hidden="true"
      >
        <div className="loginUiVisualOverlay" />
      </div>

    </div>
  );
}