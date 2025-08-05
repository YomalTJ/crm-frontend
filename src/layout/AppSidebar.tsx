"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  CalenderIcon,
  ChevronDownIcon,
  HorizontaLDots,
  PieChartIcon,
} from "../icons/index";
import { getCookie } from "@/utils/cookies";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  allowedRoles?: string[];
};

const getUserRole = () => {
  if (typeof window === 'undefined') return null;

  // Try to get admin token first
  const adminToken = getCookie('accessToken');
  if (adminToken) {
    try {
      const payloadBase64 = adminToken.split('.')[1];
      // Add padding if needed and replace URL-safe characters
      const paddedPayload = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(paddedPayload));
      console.log('Decoded admin token:', payload);
      return payload.role || 'user'; // Default to 'user' if role not specified
    } catch (e) {
      console.error("Error decoding admin token", e);
    }
  }

  // If no admin token, try staff token
  const staffToken = getCookie('staffAccessToken');
  if (staffToken) {
    try {
      const payloadBase64 = staffToken.split('.')[1];
      // Add padding if needed and replace URL-safe characters
      const paddedPayload = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(paddedPayload));
      console.log('Decoded staff token:', payload);
      // Handle both role formats (string or object)
      if (typeof payload.role === 'string') {
        return payload.role;
      } else if (payload.role?.name) {
        return payload.role.name;
      }
      return 'staff'; // Default role if not specified
    } catch (e) {
      console.error("Error decoding staff token", e);
    }
  }

  return null;
};

const nonAdminNavItems: NavItem[] = [
  {
    icon: <CalenderIcon />,
    name: "Beneficiary Management",
    path: "/dashboard/gnd-user",
    allowedRoles: ['GND User', 'staff']
  },
  {
    icon: <CalenderIcon />,
    name: "API Status",
    path: "/dashboard/api-status",
    allowedRoles: ['*'] // All roles
  },
  {
    icon: <CalenderIcon />,
    name: "Get Household Details",
    path: "/dashboard/household-details",
    allowedRoles: ['GND User', 'staff']
  },
];

const adminNavItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Reports",
    allowedRoles: ['admin', 'user'], // Both admin and user (from token)
    subItems: [
      { name: "Beneficiaries Reports", path: "/dashboard/reports/beneficiaries-count-reports" },
      { name: "Way of Graduation Reports", path: "/dashboard/reports/way-of-graduationt-reports" },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch('/api/auth/role');
        const data = await res.json();
        console.log('Fetched user role:', data.role);
        setUserRole(data.role);
      } catch (error) {
        console.error('Failed to fetch user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const role = getUserRole();
    console.log('Current cookies:', document.cookie);
    console.log('Detected user role:', role);
    setUserRole(role);
  }, []);

  // Filter nav items based on user role
  const getFilteredNavItems = (items: NavItem[]) => {
    if (!userRole) return [];

    return items.filter(item => {
      if (!item.allowedRoles) return true;

      // Special case: admin role is 'user' in token but we treat as 'admin'
      if (userRole === 'user') {
        return item.allowedRoles.includes('admin') || item.allowedRoles.includes('*');
      }

      return item.allowedRoles.includes('*') || item.allowedRoles.includes(userRole);
    });
  };

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {getFilteredNavItems(navItems).map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={` ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? nonAdminNavItems : adminNavItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  console.log('Filtered non-admin items:', getFilteredNavItems(nonAdminNavItems));
  console.log('Filtered admin items:', getFilteredNavItems(adminNavItems));

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/samurdi_logo.jpg"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/samurdi_logo.jpg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/samurdi_logo.jpg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {/* Main Menu - only show if not admin */}
            {userRole !== 'user' && getFilteredNavItems(nonAdminNavItems).length > 0 && (
              <div>
                <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                  }`}>
                  {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots />}
                </h2>
                {renderMenuItems(nonAdminNavItems, "main")}
              </div>
            )}

            {/* Reports - only show if admin */}
            {userRole === 'user' && getFilteredNavItems(adminNavItems).length > 0 && (
              <div>
                <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                  }`}>
                  {isExpanded || isHovered || isMobileOpen ? "Reports" : <HorizontaLDots />}
                </h2>
                {renderMenuItems(adminNavItems, "others")}
              </div>
            )}

            {getFilteredNavItems(nonAdminNavItems).length === 0 &&
              getFilteredNavItems(adminNavItems).length === 0 && (
                <div className="p-4 text-sm text-gray-500">
                  No menu items available for your role
                </div>
              )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
