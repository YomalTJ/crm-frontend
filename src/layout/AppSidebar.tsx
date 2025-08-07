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
} from "../icons/index";
import { getCookie } from "@/utils/cookies";

type SubSubItem = {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
};

type SubItem = {
  name: string;
  path?: string;
  pro?: boolean;
  new?: boolean;
  subSubItems?: SubSubItem[];
};

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: SubItem[];
  allowedRoles?: string[];
};

const getUserRole = () => {
  if (typeof window === 'undefined') return null;

  const staffToken = getCookie('staffAccessToken');
  if (staffToken) {
    try {
      const payloadBase64 = staffToken.split('.')[1];
      const paddedPayload = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(paddedPayload));
      return payload.roleName || 'staff';
    } catch (e) {
      console.error("Error decoding staff token", e);
    }
  }

  return null;
};

const navItems: NavItem[] = [
  {
    icon: <CalenderIcon />,
    name: "Check API Status",
    path: "/dashboard/api-status",
    allowedRoles: ['GN Level User']
  },
  {
    icon: <CalenderIcon />,
    name: "Fetch Household Details",
    path: "/dashboard/household-details",
    allowedRoles: ['GN Level User']
  },
  {
    icon: <CalenderIcon />,
    name: "Beneficiary Management",
    allowedRoles: ['GN Level User'],
    subItems: [{ name: "Add Benificiaries", path: "/dashboard/gn-level/form" }, { name: "View Benificiary Details", path: "/dashboard/gn-level/view-benficiaries" }]
  },
  {
    icon: <CalenderIcon />,
    name: "Reports",
    allowedRoles: ['National Level User', 'District Level User', 'Divisional Level User', 'Bank/Zone Level User', 'GN Level User'],
    subItems: [
      {
        name: "Count Reports",
        subSubItems: [
          { name: "Beneficiaries Count", path: "/dashboard/reports/count/beneficiaries" },
          { name: "Way of Graduation Count", path: "/dashboard/reports/count/way-of-graduation" },
        ]
      },
      {
        name: "Detail Reports",
        subSubItems: [
          { name: "Project Details", path: "/dashboard/reports/detail/project-detail" },
        ]
      }
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [openSubSubMenu, setOpenSubSubMenu] = useState<{ parentIndex: number; subIndex: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<number, number>>({});
  const [subSubMenuHeight, setSubSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const subSubMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch('/api/auth/role');
        const data = await res.json();
        setUserRole(data.role);
      } catch (error) {
        console.error('Failed to fetch user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);
  }, []);

  const getFilteredNavItems = (items: NavItem[]) => {
    if (!userRole) return [];

    return items.filter(item => {
      if (!item.allowedRoles) return true;
      return item.allowedRoles.includes('*') || item.allowedRoles.includes(userRole);
    });
  };

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  // Check if any sub-sub item is active
  const isSubSubMenuActive = (subItem: SubItem) => {
    return subItem.subSubItems?.some(subSubItem => isActive(subSubItem.path)) || false;
  };

  // Check if any sub item (including nested ones) is active
  const isSubMenuActive = (navItem: NavItem) => {
    return navItem.subItems?.some(subItem =>
      (subItem.path && isActive(subItem.path)) || isSubSubMenuActive(subItem)
    ) || false;
  };

  useEffect(() => {
    let mainMenuMatched = false;
    let subSubMenuMatched = false;

    navItems.forEach((nav, navIndex) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem, subIndex) => {
          // Check if direct sub item is active
          if (subItem.path && isActive(subItem.path)) {
            setOpenSubmenu(navIndex);
            mainMenuMatched = true;
          }

          // Check if any sub-sub item is active
          if (subItem.subSubItems) {
            subItem.subSubItems.forEach((subSubItem) => {
              if (isActive(subSubItem.path)) {
                setOpenSubmenu(navIndex);
                setOpenSubSubMenu({ parentIndex: navIndex, subIndex });
                mainMenuMatched = true;
                subSubMenuMatched = true;
              }
            });
          }
        });
      }
    });

    if (!mainMenuMatched) {
      setOpenSubmenu(null);
    }
    if (!subSubMenuMatched) {
      setOpenSubSubMenu(null);
    }
  }, [pathname, isActive]);

  // Calculate subSubMenu heights
  useEffect(() => {
    // Recalculate all subSubMenu heights when they change
    Object.keys(subSubMenuRefs.current).forEach(key => {
      if (subSubMenuRefs.current[key]) {
        setSubSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subSubMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    });
  }, [openSubSubMenu]);

  // Calculate subMenu heights (updated to account for nested content)
  useEffect(() => {
    if (openSubmenu !== null && subMenuRefs.current[openSubmenu]) {
      // Use setTimeout to ensure DOM is fully updated
      setTimeout(() => {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [openSubmenu]: subMenuRefs.current[openSubmenu]?.scrollHeight || 0,
        }));
      }, 0);
    }
  }, [openSubmenu, openSubSubMenu, subSubMenuHeight]);

  // Initial height calculation after render
  useEffect(() => {
    // Initial height calculation for all visible submenus
    if (openSubmenu !== null) {
      requestAnimationFrame(() => {
        if (subMenuRefs.current[openSubmenu]) {
          setSubMenuHeight((prevHeights) => ({
            ...prevHeights,
            [openSubmenu]: subMenuRefs.current[openSubmenu]?.scrollHeight || 0,
          }));
        }
      });
    }
  }, [openSubmenu, navItems, userRole]);

  const handleSubmenuToggle = (index: number) => {
    if (openSubmenu === index) {
      setOpenSubmenu(null);
      setOpenSubSubMenu(null);
    } else {
      setOpenSubmenu(index);
      setOpenSubSubMenu(null);
    }
  };

  const handleSubSubMenuToggle = (parentIndex: number, subIndex: number) => {
    const current = openSubSubMenu;
    if (current && current.parentIndex === parentIndex && current.subIndex === subIndex) {
      setOpenSubSubMenu(null);
    } else {
      setOpenSubSubMenu({ parentIndex, subIndex });
    }

    // Recalculate parent submenu height after sub-submenu state changes
    setTimeout(() => {
      if (subMenuRefs.current[parentIndex]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [parentIndex]: subMenuRefs.current[parentIndex]?.scrollHeight || 0,
        }));
      }
    }, 300); // Wait for animation to complete
  };

  const renderMenuItems = (navItems: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {getFilteredNavItems(navItems).map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <div>
              <button
                onClick={() => handleSubmenuToggle(index)}
                className={`menu-item group w-full ${openSubmenu === index || isSubMenuActive(nav)
                  ? "menu-item-active"
                  : "menu-item-inactive"
                  } cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                  }`}
              >
                <span className={`${openSubmenu === index || isSubMenuActive(nav)
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu === index ? "rotate-180 text-brand-500" : ""
                      }`}
                  />
                )}
              </button>

              {(isExpanded || isHovered || isMobileOpen) && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[index] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height: openSubmenu === index ? `${subMenuHeight[index]}px` : "0px",
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {nav.subItems.map((subItem, subIndex) => (
                      <li key={subItem.name}>
                        {subItem.subSubItems ? (
                          <div>
                            <button
                              onClick={() => handleSubSubMenuToggle(index, subIndex)}
                              className={`menu-dropdown-item w-full text-left ${(openSubSubMenu?.parentIndex === index && openSubSubMenu?.subIndex === subIndex) ||
                                isSubSubMenuActive(subItem)
                                ? "menu-dropdown-item-active"
                                : "menu-dropdown-item-inactive"
                                } flex items-center justify-between`}
                            >
                              <span>{subItem.name}</span>
                              <ChevronDownIcon
                                className={`w-4 h-4 transition-transform duration-200 ${(openSubSubMenu?.parentIndex === index && openSubSubMenu?.subIndex === subIndex)
                                  ? "rotate-180 text-brand-500"
                                  : ""
                                  }`}
                              />
                            </button>

                            <div
                              ref={(el) => {
                                const key = `${index}-${subIndex}`;
                                subSubMenuRefs.current[key] = el;
                              }}
                              className="overflow-hidden transition-all duration-300"
                              style={{
                                height: (openSubSubMenu?.parentIndex === index && openSubSubMenu?.subIndex === subIndex)
                                  ? `${subSubMenuHeight[`${index}-${subIndex}`]}px`
                                  : "0px",
                              }}
                            >
                              <ul className="mt-1 space-y-1 ml-4 border-l border-gray-200 dark:border-gray-700 pl-4">
                                {subItem.subSubItems.map((subSubItem) => (
                                  <li key={subSubItem.name}>
                                    <Link
                                      href={subSubItem.path}
                                      className={`block py-2 px-3 text-sm rounded-md transition-colors ${isActive(subSubItem.path)
                                        ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400"
                                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        }`}
                                    >
                                      {subSubItem.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ) : (
                          subItem.path && (
                            <Link
                              href={subItem.path}
                              className={`menu-dropdown-item ${isActive(subItem.path)
                                ? "menu-dropdown-item-active"
                                : "menu-dropdown-item-inactive"
                                }`}
                            >
                              {subItem.name}
                            </Link>
                          )
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span className={`${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"
                  }`}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
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
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {getFilteredNavItems(navItems).length > 0 ? (
              <div>
                <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                  }`}>
                  {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots />}
                </h2>
                {renderMenuItems(navItems)}
              </div>
            ) : (
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