import { useState, useRef } from "react";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "Ponyo",
    role: "Business Owner",
    email: "ponyo@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=68",
  });

  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const user = JSON.parse(localStorage.getItem("user"));

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({
          ...prev,
          avatar: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Blue wave background */}
        <div className="relative h-32 bg-blue-600">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-600"></div>
        </div>

        {/* Profile image container */}
        <div className="relative -mt-16 flex justify-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Upload button */}
            <button
              onClick={handleImageClick}
              className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 border-2 border-white hover:bg-blue-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept=".jpg,.jpeg,.png"
              className="hidden"
            />
          </div>
        </div>

        {/* Profile content */}
        <div className="pt-4 pb-6 px-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {user.username ?? user.email?.split("@")[0]}
          </h2>
          <p className="text-sm text-gray-500 mb-4">{profile.role}</p>

          {/* Email */}
          <div className="text-blue-600 text-sm font-medium">{user.email}</div>
        </div>
      </div>
    </div>
  );
}
