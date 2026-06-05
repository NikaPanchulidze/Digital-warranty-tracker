import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Package,
  Bell,
  Settings,
  Search,
  Menu,
  X,
  LogOut,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/app/components/ui";
import { useAuth } from "@/features/auth/auth-context";
import { api } from "@/shared/api/backendApi";
import type { Notification } from "@/shared/types/domain";

export function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsMenuRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user, signOut } = useAuth();
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => (await api.get<Notification[]>("/notifications")).data,
    enabled: Boolean(user),
  });
  const unreadNotifications = notifications.filter((notification) => !notification.is_read).length;
  const latestUnreadNotifications = notifications.filter((notification) => !notification.is_read).slice(0, 3);
  const displayName = String(user?.user_metadata?.full_name || user?.email || "User");

  async function markNotificationRead(notification: Notification) {
    if (!notification.is_read) {
      await api.patch(`/notifications/${notification.id}/read`);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  }

  const navigation = [
    { name: "Dashboard", to: "/", icon: LayoutDashboard },
    { name: "Products", to: "/products", icon: Package },
    { name: "Notifications", to: "/notifications", icon: Bell },
    { name: "Settings", to: "/settings", icon: Settings },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }

      if (
        notificationsMenuRef.current &&
        !notificationsMenuRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (location.pathname !== "/products") {
      return;
    }

    const params = new URLSearchParams(location.search);
    setGlobalSearch(params.get("search") ?? "");
  }, [location.pathname, location.search]);

  useEffect(() => {
    mainContentRef.current?.scrollTo({ top: 0, left: 0 });
    window.scrollTo({ top: 0, left: 0 });
  }, [location.pathname]);

  useLayoutEffect(() => {
    mainContentRef.current?.scrollTo({ top: 0, left: 0 });
    window.scrollTo({ top: 0, left: 0 });
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    document.documentElement.style.overflow = isMobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  function handleGlobalSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = globalSearch.trim();
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#F8FAFC] flex flex-col pt-16 font-sans text-gray-900 md:flex-row md:pt-0">
      {/* Mobile Header */}
      <div className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 font-bold text-xl text-blue-600"
        >
          <Package className="w-6 h-6" />
          <span>Tracker</span>
        </button>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 text-gray-500"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-[70] w-[min(82vw,320px)] bg-white border-l border-gray-200 transform transition-transform duration-200 ease-in-out md:right-auto md:left-0 md:z-40 md:w-[260px] md:translate-x-0 md:static md:h-screen md:border-l-0 md:border-r flex flex-col",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5 md:hidden">
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate("/");
            }}
            className="flex items-center gap-2 font-bold text-xl text-blue-600"
          >
            <Package className="w-6 h-6" />
            <span>Tracker</span>
          </button>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-gray-500"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="h-16 flex items-center px-6 border-b border-gray-100 hidden md:flex">
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate("/");
            }}
            className="flex items-center gap-2 font-bold text-xl text-blue-600 tracking-tight"
          >
            <Package className="w-6 h-6" />
            <span>WarrantyTracker</span>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-hidden">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={async () => {
              await signOut();
              navigate("/login");
            }}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-[60] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex h-full min-w-0 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0 hidden md:flex">
          <form className="flex-1 max-w-xl" onSubmit={handleGlobalSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, manuals, receipts..."
                value={globalSearch}
                onChange={(event) => setGlobalSearch(event.target.value)}
                className="w-full rounded-lg border-2 border-transparent bg-gray-50 py-2 pl-10 pr-4 text-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-0"
              />
            </div>
          </form>

          <div className="flex items-center gap-4 ml-4">
            <div className="relative" ref={notificationsMenuRef}>
              <button
                type="button"
                onClick={() => setIsNotificationsOpen((current) => !current)}
                className={cn(
                  "relative p-2 transition-colors rounded-full hover:bg-gray-50",
                  location.pathname === "/notifications" || isNotificationsOpen
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-400 hover:text-gray-600",
                )}
                aria-label={unreadNotifications ? `Open notifications, ${unreadNotifications} unread` : "Open notifications"}
                aria-expanded={isNotificationsOpen}
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg z-50">
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Notifications</p>
                      <p className="text-xs text-gray-500">
                        {unreadNotifications ? `${unreadNotifications} unread` : "You're all caught up"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        navigate("/notifications");
                      }}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      View all
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {latestUnreadNotifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={async () => {
                          await markNotificationRead(notification);
                          setIsNotificationsOpen(false);
                          navigate(notification.product_id ? `/products/${notification.product_id}` : "/notifications");
                        }}
                        className={cn(
                          "block w-full border-b border-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-50",
                          !notification.is_read && "bg-blue-50/40",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <span className={cn("mt-1 h-2 w-2 rounded-full", notification.is_read ? "bg-gray-300" : "bg-blue-600")} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">{notification.message}</p>
                          </div>
                        </div>
                      </button>
                    ))}

                    {!latestUnreadNotifications.length && (
                      <div className="px-4 py-8 text-center">
                        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                          <Bell className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">No notifications yet</p>
                        <p className="mt-1 text-xs text-gray-500">Run a warranty check to create reminders.</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-100 bg-white p-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        navigate("/notifications");
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Open notification center <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded-full pr-3 transition-colors"
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2563EB&color=fff`}
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <span className="max-w-44 truncate text-sm font-medium text-gray-700 hidden lg:block">
                  {displayName}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      Signed in
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <NavLink
                    to="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Settings
                  </NavLink>
                  <button
                    onClick={async () => {
                      setIsProfileOpen(false);
                      await signOut();
                      navigate("/login");
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main
          ref={mainContentRef}
          className={cn(
            "flex-1 p-4 md:p-8",
            isMobileMenuOpen ? "overflow-hidden" : "overflow-y-auto",
          )}
        >
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
