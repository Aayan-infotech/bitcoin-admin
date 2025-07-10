import React from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { Link, NavLink } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { SiShopware } from "react-icons/si";
import { links } from "../data/dummy";

const Sidebar = () => {
  console.log(links);
  const { currentColor, setActiveMenu, activeMenu, screenSize } =
    useStateContext();

  const handleCloseSidebar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = `flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2 bg-[${currentColor}]`;
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:text-black m-2";

  return (
    <div className="ml-3 h-screen overflow-hidden  pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link
              to="/"
              onClick={handleCloseSidebar}
              className="flex items-center gap-3 ml-3 mt-4 text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
            >
              <SiShopware className="text-2xl" />
              <span>Bit Wallet</span>
            </Link>

            {/* Tooltip Alternative: Button with hover effect */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-gray-200 mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 bg-gray-700 text-white text-xs rounded px-2 py-1 transition">
                Close Menu
              </span>
            </div>
          </div>

          <div className="mt-10">
            {links[0].links.map((link) => (
              <div key={link.name}>
                {!link.children ? (
                  <NavLink
                    to={`/${link.path}`}
                    onClick={handleCloseSidebar}
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                    style={({ isActive }) =>
                      isActive ? { backgroundColor: currentColor } : {}
                    }
                  >
                    {link.icon}
                    <span className="capitalize">{link.name}</span>
                  </NavLink>
                ) : (
                  <div className="group">
                    <div className={normalLink}>
                      {link.icon}
                      <span className="capitalize">{link.name}</span>
                    </div>
                    {/* Sub-links shown with margin */}
                    <div
                      className="
                                opacity-0  max-h-0 overflow-hidden group-hover:max-h-[400px]
                                group-hover:opacity-100 group-hover:scale-y-100 
                                group-hover:pointer-events-auto pointer-events-none 
                                transition-all duration-300 ease-out 
                                bg-white dark:bg-gray-800 border-transparent
                                rounded-sm shadow-lg z-10 border
                              "
                    >
                      {link.children.map((sublink) => (
                        <NavLink
                          to={`/${sublink.path}`}
                          key={sublink.name}
                          onClick={handleCloseSidebar}
                          className={({ isActive }) =>
                            isActive ? activeLink : normalLink
                          }
                          style={({ isActive }) =>
                            isActive ? { backgroundColor: currentColor } : {}
                          }
                        >
                          <span className="capitalize">{sublink.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
