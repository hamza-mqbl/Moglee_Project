import { useEffect, useState } from "react"
import { updateUserInformation } from "../redux/actions/user"
import { useDispatch, useSelector } from "react-redux"
import config from "../server"
import axios from "axios"

export default function ProfileComponent() {
  const { user, error, successMessage } = useSelector((state) => state.user)
  const [name, setName] = useState(user && user.name)
  const [email, setEmail] = useState(user && user.email)
  const [password, setPassword] = useState("")
  const [avatar, setAvatar] = useState(null)
  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar?.url || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [formTouched, setFormTouched] = useState(false)

  const dispatch = useDispatch()

  const calculatePasswordStrength = (pass) => {
    if (!pass) return 0

    let strength = 0
    // Length check
    if (pass.length > 6) strength += 25
    // Contains number
    if (/\d/.test(pass)) strength += 25
    // Contains lowercase
    if (/[a-z]/.test(pass)) strength += 25
    // Contains uppercase or special char
    if (/[A-Z]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) strength += 25

    return strength
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await dispatch(updateUserInformation(email, name, password))
      setFormTouched(false)
      // toast.success("Profile updated successfully!")
    } catch (err) {
      console.error("Update failed:", err)
      // toast.error("Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImage = async (e) => {
    if (!e.target.files.length) return

    const file = e.target.files[0]
    setAvatar(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewAvatar(reader.result)
    }
    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append("avatar", file)

    setIsUploading(true)

    try {
      const response = await axios.put(`${config.server}api/user/update-avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
      // toast.success("Avatar updated successfully!")
    } catch (error) {
      console.error("Avatar upload error:", error)
      // toast.error("Failed to update avatar")
    } finally {
      setIsUploading(false)
    }
  }

  useEffect(() => {
    if (error) {
      // toast.error(error)
      dispatch({ type: "clearErrors" })
    }
    if (successMessage) {
      // toast.success(successMessage)
      dispatch({ type: "clearMessages" })
    }
  }, [error, successMessage, dispatch])

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password))
  }, [password])

  useEffect(() => {
    // Check if any field has changed from original values
    if (name !== user?.name || email !== user?.email || password.length > 0) {
      setFormTouched(true)
    } else {
      setFormTouched(false)
    }
  }, [name, email, password, user])

  const getStrengthColor = () => {
    if (passwordStrength < 50) return "bg-red-500"
    if (passwordStrength < 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStrengthText = () => {
    if (passwordStrength < 50) return "text-red-500"
    if (passwordStrength < 75) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center">Your Profile</h1>
          <p className="text-blue-100 text-center mt-2">Manage your personal information</p>
        </div>

        <div className="p-6 md:p-8">
          {/* Avatar Section with animated border */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div
                className={`w-32 h-32 md:w-40 md:h-40 rounded-full p-1 ${isUploading ? "animate-pulse" : ""} bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500`}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {previewAvatar ? (
                    <img
                      src={previewAvatar || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}

                  {isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <svg
                        className="animate-spin h-10 w-10 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Camera button with ripple effect */}
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full cursor-pointer shadow-lg transform transition-all duration-300 hover:scale-110 active:scale-95 group-hover:rotate-12"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              {isUploading ? "Uploading..." : "Click the camera icon to change your profile picture"}
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent my-6"></div>

          {/* Form with floating labels and animations */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="name"
                  value={name || ""}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Full Name"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email Address"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password to change"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              />

              {/* {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Password strength:</span>
                    <span className={getStrengthText()}>
                      {passwordStrength < 50 ? "Weak" : passwordStrength < 75 ? "Medium" : "Strong"}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStrengthColor()} transition-all duration-500 ease-out`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                </div>
              )} */}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !formTouched}
                className={`
                  relative overflow-hidden px-6 py-3 rounded-lg text-white font-medium
                  ${
                    formTouched && !isSubmitting
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 active:scale-95"
                      : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  }
                  transition-all duration-300 ease-in-out shadow-md hover:shadow-lg
                `}
              >
                {isSubmitting ? (
                  <>
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Save Changes
                    </span>
                    {/* Button ripple effect */}
                    <span className="absolute top-0 left-0 w-full h-full bg-white opacity-30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}