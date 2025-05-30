import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [pageTitle, setPageTitle] = useState("Dashboard");

  // Create refs for dropdown containers
  const searchRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Update page title based on current route
  useEffect(() => {
    // Map routes to their display titles
    const routeTitles = {
      "/dashboard": "Dashboard",
      "/pemasukan": "Pemasukan",
      "/pengeluaran": "Pengeluaran",
      "/kategori": "Pengelolaan Kategori",
      "/kategori/kelola": "Pengelolaan Kategori",
      "/pengaturan": "Pengaturan",
      "/profile": "Profile",
      "/help": "Help",
      "/login": "Login",
    };

    // Set page title based on current path or default to 'Dashboard'
    setPageTitle(routeTitles[location.pathname] || "Dashboard");
  }, [location.pathname]);

  const user = JSON.parse(localStorage.getItem("user"));

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      // Close search if clicked outside the search container
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }

      // Close profile menu if clicked outside the profile menu container
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search functionality
  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    // Close other menus when search is clicked
    setShowProfileMenu(false);
  };

  // Handle profile menu functionality
  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
    // Close other menus when profile is clicked
    setShowSearch(false);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchQuery = e.target.search.value.toLowerCase();
    const currentPath = location.pathname;

    // Get data based on current page
    let searchResults = {};

    if (currentPath === "/pemasukan") {
      // Search income data
      const incomeData = JSON.parse(localStorage.getItem("incomeData")) || {};
      searchResults = Object.entries(incomeData).reduce(
        (results, [month, items]) => {
          const matchingItems = items.filter(
            (item) =>
              item.name.toLowerCase().includes(searchQuery) ||
              item.category.toLowerCase().includes(searchQuery) ||
              item.productName?.toLowerCase().includes(searchQuery) ||
              item.nominal.toLowerCase().includes(searchQuery) ||
              item.totalAmount?.toLowerCase().includes(searchQuery)
          );

          if (matchingItems.length > 0) {
            results[month] = matchingItems;
          }
          return results;
        },
        {}
      );
    } else if (currentPath === "/pengeluaran") {
      // Search expense data
      const expenseData = JSON.parse(localStorage.getItem("expenseData")) || {};
      searchResults = Object.entries(expenseData).reduce(
        (results, [month, items]) => {
          const matchingItems = items.filter(
            (item) =>
              item.name.toLowerCase().includes(searchQuery) ||
              item.category.toLowerCase().includes(searchQuery) ||
              item.nominal.toLowerCase().includes(searchQuery) ||
              item.type.toLowerCase().includes(searchQuery)
          );

          if (matchingItems.length > 0) {
            results[month] = matchingItems;
          }
          return results;
        },
        {}
      );
    }

    // Store search results in localStorage
    localStorage.setItem("searchResults", JSON.stringify(searchResults));

    // Refresh the current page to show search results
    window.location.reload();
    setShowSearch(false);
  };

  const isDashboard =
    location.pathname === "/dashboard" || location.pathname === "/profile";

  const handleLogout = () => {
    setShowLogoutModal(true);
    setShowProfileMenu(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="bg-white shadow-sm px-4 py-2 flex items-center justify-between relative font-['Poppins']">
        {/* Left side - Menu toggle and Page title */}
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            <MenuIcon />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 ml-2">
            {pageTitle}
          </h1>
        </div>

        {/* Right side - Search and profile */}
        <div className="flex items-center space-x-4">
          {/* Search bar - Only show if not on dashboard */}
          {!isDashboard && (
            <>
              <div className="relative hidden md:block" ref={searchRef}>
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    name="search"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
                  />
                  <button
                    type="button"
                    onClick={handleSearchClick}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    <SearchIcon fontSize="small" />
                  </button>
                </form>
              </div>

              {/* Mobile search button */}
              <div ref={searchRef}>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 md:hidden"
                  onClick={handleSearchClick}
                >
                  <SearchIcon fontSize="small" />
                </button>
              </div>
            </>
          )}

          {/* User profile button */}
          <div className="relative" ref={profileMenuRef}>
            <button
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={handleProfileClick}
            >
              <AccountCircleIcon fontSize="small" />
            </button>

            {/* Profile dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="p-4 border-b">
                  <p className="font-medium">
                    {user.username ?? user.email?.split("@")[0]}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-1 text-ellipsis">
                    {user.email}
                  </p>
                </div>
                <div>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile search overlay - Only show if not on dashboard */}
        {!isDashboard && showSearch && (
          <div
            className="absolute left-0 top-full w-full bg-white shadow-md p-4 md:hidden z-10"
            ref={searchRef}
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                autoFocus
              />
              <SearchIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                fontSize="small"
              />
            </form>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 font-['Poppins']">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Konfirmasi Keluar
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin keluar dari aplikasi?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;