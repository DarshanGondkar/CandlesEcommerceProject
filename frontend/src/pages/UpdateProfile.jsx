import React, { useEffect, useState } from "react";
import Footer2 from "./Footer2";
import DashboardHeader3 from "./DashboardHeader3";
import {
  getMyProfile,
  updateMyProfile,
  changePassword,
} from "../services/authService";
import { showError, showInfo } from "../utils/toast";

export default function UpdateProfile() {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    newsletter: false,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
const [passwordsVisible, setPasswordsVisible] = useState({
  currentPassword: false,
  newPassword: false,
  confirmPassword: false,
});

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // ADD THIS

  // 🔹 Change password
const [showSuccess, setShowSuccess] = useState(false);
const [showProfileSuccess, setShowProfileSuccess] = useState(false);

const handleProfileUpdate = async (e) => {
  e.preventDefault();
  try {
    await updateMyProfile(profileData);
    setShowProfileSuccess(true);  // ✅ Profile popup
    setTimeout(() => setShowProfileSuccess(false), 3000);
  } catch {
    setMessage("❌ Failed to update profile");
  }
};
  // 🔹 Fetch logged-in user
  // 🔹 Fetch logged-in user
  useEffect(() => {
    getMyProfile()
      .then((res) => {
        setUser(res.data);
        setProfileData(res.data);
        setLoading(false); // ADD THIS
      })
      .catch(() => {
        setMessage("Failed to load profile");
        setLoading(false); // ADD THIS
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary/60">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-6 rounded-xl max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-2">Profile Not Found</h2>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }


  // 🔹 Update profile
  
const handlePasswordChange = async (e) => {
  e.preventDefault();

  if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
    return showInfo("All password fields are required");
  }

  if (passwords.newPassword.length < 6) {
    return showInfo("New password must be at least 6 characters");
  }

  if (passwords.newPassword !== passwords.confirmPassword) {
    return showError("Passwords do not match");
  }

  if (passwords.currentPassword === passwords.newPassword) {
    return showInfo("New password cannot be same as current password");
  }

  try {
    await changePassword({
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    });

    setShowSuccess(true);
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setTimeout(() => setShowSuccess(false), 3000);
  } catch {
    showError("Current password is incorrect");
  }
};

const isProfileValid =
  profileData.firstName?.trim() &&
  profileData.lastName?.trim() &&
  profileData.mobile?.length === 10;

  return (
    <div className="bg-background dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
      <div className="relative flex min-h-screen flex-col">
        <DashboardHeader3 />

        <main className="flex-1 px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-12">

    {showSuccess && (
      <div className="fixed inset-0 bg-background/50 flex items-center justify-center z-50 p-4">
        <div className="bg-green-500 text-text p-8 rounded-2xl text-center max-w-sm mx-auto animate-fadeIn">
          <span className="material-symbols-outlined text-6xl mb-4 block mx-auto">check_circle</span>
          <h3 className="text-2xl font-bold mb-2">Password Updated!</h3>
          <p>Your new password has been saved successfully.</p>
        </div>
      </div>
    )}

 {/* 🔥 PROFILE SUCCESS POPUP - NEW */}
  {showProfileSuccess && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-green-500 text-text p-8 rounded-2xl text-center max-w-sm mx-auto animate-fadeIn">
        <span className="material-symbols-outlined text-6xl mb-4 block mx-auto">person</span>
        <h3 className="text-2xl font-bold mb-2">Profile Updated!</h3>
        <p>Your information has been saved successfully.</p>
      </div>
    </div>
  )}
            {/* MESSAGE /}
            {message && (
              <div className="bg-primary/20 text-primary p-4 rounded-lg text-center">
                {message}

                
              </div>
              
            )}*/}

            {/* PERSONAL INFO */}
            <section className="bg-background/5 border border-border/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-text">
                Personal Information
              </h2>

              <form
                onSubmit={handleProfileUpdate}
                className="mt-8 grid gap-6 sm:grid-cols-2"
              >
                {["firstName", "lastName", "email", "mobile"].map((field) => (
                  <div key={field} className={field === "email" ? "sm:col-span-2" : ""}>
                    <label className="block text-sm text-text/80 capitalize">
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                <input
  type={field === "mobile" ? "tel" : "text"}
  inputMode={field === "mobile" ? "numeric" : undefined}
  maxLength={field === "mobile" ? 10 : undefined}
  value={profileData[field] || ""}
  disabled={field === "email"}
  onChange={(e) => {
    if (field === "mobile") {
      const numbersOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
      setProfileData({
        ...profileData,
        mobile: numbersOnly,
      });
    } else {
      setProfileData({
        ...profileData,
        [field]: e.target.value,
      });
    }
  }}
  className="mt-2 w-full rounded-lg bg-background/5 px-4 py-3 text-text ring-1 ring-black/10 focus:ring-primary"
/>
                  </div>
                ))}

                <div className="sm:col-span-2 flex justify-end">
                <button
  type="submit"
  disabled={!isProfileValid}
  className="bg-primary px-6 py-3 rounded-lg text-text font-semibold 
             hover:bg-primary/90 
             disabled:opacity-50 
             disabled:cursor-not-allowed"
>
  Update Profile
</button>
                </div>
              </form>
            </section>

            {/* PASSWORD */}
           {/* PASSWORD */}
<section className="bg-whitbackgrounde/5 border border-border/10 rounded-xl p-8">
  <h2 className="text-2xl font-bold text-text">Change Password</h2>

  <form onSubmit={handlePasswordChange} className="mt-6 space-y-6">
    {[
      ["currentPassword", "Current Password"],
      ["newPassword", "New Password"],
      ["confirmPassword", "Confirm New Password"],
    ].map(([key, label]) => (
      <div key={key} className="relative">
        <label className="block text-sm text-text/80 mb-2">{label}</label>
        <div className="relative">
          <input
            type={passwordsVisible[key] ? "text" : "password"}
            value={passwords[key]}
            onChange={(e) =>
              setPasswords({ ...passwords, [key]: e.target.value })
            }
            className="w-full rounded-lg bg-background/5 px-4 py-3 pr-12 text-text ring-1 ring-black/10 focus:ring-primary"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text/60 hover:text-text p-1"
            onClick={() =>
              setPasswordsVisible(prev => ({
                ...prev,
                [key]: !prev[key]
              }))
            }
          >
            {passwordsVisible[key] ? (
              <span className="material-symbols-outlined text-sm">visibility_off</span>
            ) : (
              <span className="material-symbols-outlined text-sm">visibility</span>
            )}
          </button>
        </div>
      </div>
    ))}

    <div className="flex justify-end">
      <button 
        type="submit" 
        disabled={!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword}
        className="bg-primary px-6 py-3 rounded-lg text-text font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Update Password
      </button>
    </div>
  </form>
</section>

          </div>
        </main>

        <Footer2 />
      </div>
    </div>
  );
}
