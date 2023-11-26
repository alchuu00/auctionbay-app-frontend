import React from "react";
import axios from "axios";
import ToastWarning from "@/app/components/ToastWarning";
import { useRouter } from "next/router";
import * as API from "@/src/api/api";

export const DefaultResetPassword = () => {
  const [newPassword, setNewPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = React.useState<
    string | null
  >();
  const [resetPasswordError, setResetPasswordError] = React.useState<
    string | null
  >();

  const router = useRouter();
  const { query } = router;
  const token = query.token;
  const email = query.email;

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = { token, email, password: newPassword };
      await API.resetUserPassword(data, email);
      setResetPasswordSuccess("Password reset successful");
      setLoading(false);
      setTimeout(() => {
        router.push("/");
      }, 4000);
      setResetPasswordError("");
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        setResetPasswordError(error.message);
      }
      setResetPasswordSuccess(null);
    }
  };

  return (
    <React.Fragment>
      <div>
        <title>Reset your password</title>
      </div>
      <div>
        {email && token ? (
          <div className="auth-wrapper">
            {resetPasswordSuccess ? (
              <ToastWarning errorMessage={resetPasswordSuccess} />
            ) : null}
            {resetPasswordError ? (
              <ToastWarning errorMessage={resetPasswordError} />
            ) : null}
            <form onSubmit={resetPassword} className="reset-password">
              <h1>Reset Password</h1>
              <p>Please enter your new password</p>
              <div>
                <label htmlFor="password">Password*</label>
                <input
                  name="password"
                  type="password"
                  id="password"
                  placeholder="enter new pasword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <button name="reset-pwd-button" className="reset-pwd">
                {!loading ? "Reset" : "Processing..."}
              </button>
            </form>
          </div>
        ) : (
          <p>The page you`re trying to get to isn`t available</p>
        )}
      </div>
    </React.Fragment>
  );
};
