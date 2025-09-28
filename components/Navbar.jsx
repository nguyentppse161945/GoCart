"use client";
import { ShoppingCart, Search, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { UserButton, useAuth, useClerk, useUser } from "@clerk/nextjs";
import axios from "axios";

const Navbar = () => {
  const { getToken, isLoaded } = useAuth();

    const handleLogin = () => {
    if (!isSignedIn) {
      openSignIn();
    }
  };

  const router = useRouter();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const [search, setSearch] = useState("");
  const cartCount = useSelector((state) => state.cart.total);
  const [openDashboard, setOpenDashboard] = useState(false);

  // two refs: one for desktop wrapper, one for mobile wrapper
  const dashboardRefDesktop = useRef(null);
  const dashboardRefMobile = useRef(null);

  // close dashboard when click outside (check BOTH refs)
  useEffect(() => {
    function handleClickOutside(event) {
      const desktopContains =
        dashboardRefDesktop.current &&
        dashboardRefDesktop.current.contains(event.target);
      const mobileContains =
        dashboardRefMobile.current &&
        dashboardRefMobile.current.contains(event.target);

      // if the click target is inside neither wrapper, close menu
      if (!desktopContains && !mobileContains) {
        setOpenDashboard(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isSeller, setIsSeller] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return; // no user loaded → skip

    const checkRoles = async () => {
      const token = await getToken();
      if (!token) return; // no token → skip

      try {
        // run both checks in parallel
        const [sellerRes, adminRes] = await Promise.allSettled([
          axios.get("/api/store/is-seller", {
            headers: { Authorization: `Bearer ${token}` },
            validateStatus: () => true, // prevent throwing
          }),
          axios.get("/api/admin/is-admin", {
            headers: { Authorization: `Bearer ${token}` },
            validateStatus: () => true,
          }),
        ]);

        // seller
        if (
          sellerRes.status === "fulfilled" &&
          sellerRes.value.status === 200
        ) {
          setIsSeller(sellerRes.value.data.isSeller || false);
        } else {
          setIsSeller(false);
        }

        // admin
        if (adminRes.status === "fulfilled" && adminRes.value.status === 200) {
          setIsAdmin(adminRes.value.data.isAdmin || false);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Role check error:", err);
        setIsSeller(false);
        setIsAdmin(false);
      }
    };

    checkRoles();
  }, [isLoaded, user, getToken]);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?search=${search}`);
  };

  return (
    <nav className="relative bg-white">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">
          <Link
            href="/"
            className="relative text-4xl font-semibold text-slate-700"
          >
            <span className="text-green-600">go</span>cart
            <span className="text-green-600 text-5xl leading-0">.</span>
            <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
              plus
            </p>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
            <Link href="/">Home</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/">About</Link>
            <Link href="/">Contact</Link>

            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full"
            >
              <Search size={18} className="text-slate-600" />
              <input
                className="w-full bg-transparent outline-none placeholder-slate-600"
                type="text"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
            </form>

            <Link
              href="/cart"
              className="relative flex items-center gap-2 text-slate-600"
            >
              <ShoppingCart size={18} />
              Cart
              <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">
                {cartCount}
              </button>
            </Link>

            {(isSeller || isAdmin) && (
              // desktop ref
              <div ref={dashboardRefDesktop} className="relative">
                <button
                  onClick={() => setOpenDashboard((prev) => !prev)}
                  className="text-xs border px-4 py-1.5 rounded-full flex items-center gap-1"
                >
                  Dashboard
                  <ChevronDown size={14} />
                </button>

                {openDashboard && (
                  <div className="absolute right-0 mt-2 w-50 bg-white shadow-lg rounded-lg border z-[9999]">
                    <ul className="text-sm text-slate-700">
                      {isSeller && (
                        <li>
                          <Link
                            href="/store"
                            className="block w-full px-4 py-2 hover:bg-slate-200 rounded-t-lg"
                            onClick={() => setOpenDashboard(false)}
                          >
                            Seller Dashboard
                          </Link>
                        </li>
                      )}
                      {isAdmin && (
                        <li>
                          <Link
                            href="/admin"
                            className="block w-full px-4 py-2 hover:bg-slate-200 rounded-b-lg"
                            onClick={() => setOpenDashboard(false)}
                          >
                            Admin Dashboard
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {!user ? (
              <button
                onClick={handleLogin}
                className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
              >
                Login
              </button>
            ) : (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    labelIcon={<ShoppingCart size={16} />}
                    label="My Orders"
                    onClick={() => router.push("/orders")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            )}
          </div>

          {/* Mobile User Button  */}
          <div className="sm:hidden flex items-center gap-3 ">
            {(isSeller || isAdmin) && (
              // mobile ref
              <div ref={dashboardRefMobile} className="relative">
                <button
                  onClick={() => setOpenDashboard((prev) => !prev)}
                  className="text-xs border px-4 py-1.5 rounded-full flex items-center gap-1"
                >
                  Dashboard
                  <ChevronDown size={14} />
                </button>

                {openDashboard && (
                  <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg border z-25">
                    <ul className="text-sm text-slate-700">
                      {isSeller && (
                        <li>
                          <Link
                            href="/store"
                            className="block w-full px-4 py-2 hover:bg-slate-200 rounded-t-lg"
                            onClick={() => setOpenDashboard(false)}
                          >
                            Seller Dashboard
                          </Link>
                        </li>
                      )}
                      {isAdmin && (
                        <li>
                          <Link
                            href="/admin"
                            className="block w-full px-4 py-2 hover:bg-slate-200 rounded-b-lg"
                            onClick={() => setOpenDashboard(false)}
                          >
                            Admin Dashboard
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div>
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Action
                      labelIcon={<ShoppingCart size={16} />}
                      label="Cart"
                      onClick={() => router.push("/cart")}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            ) : (
              <button
                onClick={openSignIn}
                className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
      <hr className="border-gray-300" />
    </nav>
  );
};

export default Navbar;
