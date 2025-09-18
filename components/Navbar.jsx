"use client";
import { ShoppingCart, Search ,ChevronDown} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState,useRef } from "react";
import { useSelector } from "react-redux";
import { UserButton, useClerk, useUser } from "@clerk/nextjs";
import axios from "axios";

const Navbar = () => {
  const router = useRouter();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const [search, setSearch] = useState("");
  const cartCount = useSelector((state) => state.cart.total);
  const [openDashboard, setOpenDashboard] = useState(false);
  const dashboardRef = useRef(null);
  //close dashboard when click outside
  useEffect(() => {
  function handleClickOutside(event) {
    if (dashboardRef.current && !dashboardRef.current.contains(event.target)) {
      setOpenDashboard(false);
    }
  }
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);



  //check seller

  const [isSeller, setIsSeller] = useState(false);
   useEffect(() => {
    const checkSeller = async () => {
      try {
        const {data} = await axios.get("/api/store/is-seller");
        setIsSeller(data.isSeller);
      } catch (err) {
        console.error(err);
      }
    };
    checkSeller();
  }, []);

  //check admin

  const [isAdmin, setIsAdmin] = useState(false);
   useEffect(() => {
    const checkAdmin = async () => {
      try {
        const {data} = await axios.get("/api/admin/is-admin");
        setIsAdmin(data.isAdmin);
      } catch (err) {
        console.error(err);
      }
    };
    checkAdmin();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?search=${search}`);
  };

  return (
    <nav className="relative bg-white">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4  transition-all">
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
    <div ref={dashboardRef} className="relative">
      <button
        onClick={() => setOpenDashboard((prev) => !prev)}
        className="text-xs border px-4 py-1.5 rounded-full flex items-center gap-1"
      >
        Dashboard
        <ChevronDown size={14} />
      </button>

      {openDashboard && (
        <div className="absolute right-0 mt-2 w-50  bg-white shadow-lg rounded-lg border z-50">
          <ul className="text-sm text-slate-700 center-text items-center">
            {isSeller && (
              <li
                onClick={() => {
                  router.push("/store");
                  setOpenDashboard(false);
                }}
                className="px-4 py-2 hover:bg-slate-200 cursor-pointer rounded-t-lg"
              >
                Seller Dashboard
              </li>
            )}
            {isAdmin && (
              <li
                onClick={() => {
                  router.push("/admin");
                  setOpenDashboard(false);
                }}
                className="px-4 py-2 hover:bg-slate-200 cursor-pointer rounded-b-lg"
              >
                Admin Dashboard
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )}

            {!user ? (
              <button
                onClick={openSignIn}
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
    <div ref={dashboardRef} className="relative">
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
              <li
                onClick={() => {
                  router.push("/store");
                  setOpenDashboard(false);
                }}
                className="px-4 py-2 hover:bg-slate-200 cursor-pointer rounded-t-lg"
              >
                Seller Dashboard
              </li>
            )}
            {isAdmin && (
              <li
                onClick={() => {
                  router.push("/admin");
                  setOpenDashboard(false);
                }}
                className="px-4 py-2 hover:bg-slate-200 cursor-pointer rounded-b-lg"
              >
                Admin Dashboard
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
