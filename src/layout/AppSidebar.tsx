"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BoltIcon,
  ChevronDownIcon,
  DollarLineIcon,
  EyeIcon,
  GroupIcon,
  HorizontaLDots,
  ListIcon,
  PieChartIcon,
  PlusIcon,
  TableIcon,
  UserCircleIcon,
  ShootingStarIcon,
  BoxCubeIcon,
  FileIcon,
  FolderIcon,
  TaskIcon,
  UserIcon
} from "../icons/index";
import { getCookie } from "@/utils/cookies";
import { useLanguage } from "@/context/LanguageContext"; // Import the language context

type SubSubItem = {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
  translationKey: string;
};

type SubItem = {
  name: string;
  path?: string;
  pro?: boolean;
  new?: boolean;
  translationKey: string;
  subSubItems?: SubSubItem[];
  icon: React.ReactNode;
};

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  translationKey: string;
  subItems?: SubItem[];
  allowedRoles?: string[];
  isDashboard?: boolean; // New flag to identify dashboard item
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

// Function to get dashboard path based on user role
const getDashboardPath = (userRole: string | null): string => {
  if (!userRole) return '/dashboard';

  const rolePathMapping: Record<string, string> = {
    'National Level User': '/dashboard/national-level',
    'District Level User': '/dashboard/district-level',
    'Divisional Level User': '/dashboard/divisional-level',
    'Bank/Zone Level User': '/dashboard/bank-zone-level',
    'GN Level User': '/dashboard/gn-level',
  };

  return rolePathMapping[userRole] || '/dashboard';
};

// Define navigation items with translation keys instead of hardcoded text
const navItems: (NavItem & { translationKey: string })[] = [
  {
    icon: <PieChartIcon />, // Dashboard can stay PieChartIcon
    name: "Dashboard",
    translationKey: "sidebar.dashboard",
    path: "", // Will be set dynamically based on user role
    isDashboard: true,
    allowedRoles: [
      "National Level User",
      "District Level User",
      "Divisional Level User",
      "Bank/Zone Level User",
      "GN Level User",
    ],
  },
  {
    icon: <BoltIcon />,
    name: "Check API Status",
    translationKey: "sidebar.apiStatus",
    path: "/dashboard/api-status",
    allowedRoles: ["GN Level User"],
  },
  {
    icon: <FolderIcon />, // Household Details
    name: "Fetch Household Details",
    translationKey: "sidebar.householdDetails",
    path: "/dashboard/household-details",
    allowedRoles: ["GN Level User"],
  },
  {
    icon: <GroupIcon />, // Beneficiary Management
    name: "Beneficiary Management",
    translationKey: "sidebar.beneficiaryManagement",
    allowedRoles: ["GN Level User"],
    subItems: [
      {
        icon: <PlusIcon />,
        name: "Add Beneficiaries",
        translationKey: "sidebar.addBeneficiaries",
        path: "/dashboard/gn-level/form",
      },
      {
        icon: <EyeIcon />,
        name: "View Beneficiary Details",
        translationKey: "sidebar.viewBeneficiaries",
        path: "/dashboard/gn-level/view-benficiaries",
      },
    ],
  },
  {
    icon: <TableIcon />, // Reports
    name: "Reports",
    translationKey: "sidebar.reports",
    allowedRoles: [
      "National Level User",
      "District Level User",
      "Divisional Level User",
      "Bank/Zone Level User",
      "GN Level User",
    ],
    subItems: [
      {
        icon: <ListIcon />,
        name: "Count Reports",
        translationKey: "sidebar.countReports",
        subSubItems: [
          { name: "Beneficiaries Count", translationKey: "sidebar.beneficiariesCount", path: "/dashboard/reports/count/beneficiaries" },
          { name: "Way of Graduation Count", translationKey: "sidebar.wayOfGraduationCount", path: "/dashboard/reports/count/way-of-graduation" },
          { name: "Area types Count", translationKey: "sidebar.areaTypes", path: "/dashboard/reports/count/area-types" },
          { name: "Grant Utilization Count", translationKey: "sidebar.grantUtilization", path: "/dashboard/reports/count/grant-utilization" },
        ],
      },
      {
        icon: <FileIcon />,
        name: "Detail Reports",
        translationKey: "sidebar.detailReports",
        subSubItems: [
          { name: "Project Details", translationKey: "sidebar.projectDetails", path: "/dashboard/reports/detail/project-detail" },
          { name: "Owner Demographics", translationKey: "sidebar.ownerDemographics", path: "/dashboard/reports/detail/owner-demographics" },
          { name: "Family Age Groups", translationKey: "sidebar.familyAgeGroups", path: "/dashboard/reports/detail/family-age-groups" },
          { name: "Owner Details", translationKey: "sidebar.ownerDetails", path: "/dashboard/reports/detail/owner-details" },
          { name: "Empowerment Program Refusing Reasons", translationKey: "sidebar.refusalReasons", path: "/dashboard/reports/detail/refusal-reasons" },
        ],
      },
    ],
  },
  {
    icon: <DollarLineIcon />, // Grant Utilization
    name: "Grant Utilization",
    translationKey: "sidebar.grantUtilization",
    path: "/dashboard/grant-utilization",
    allowedRoles: [
      "National Level User",
      "District Level User",
      "Divisional Level User",
      "Bank/Zone Level User",
      "GN Level User",
    ],
    subItems: [
      {
        icon: <UserCircleIcon />,
        name: "View All Beneficiaries",
        translationKey: "sidebar.viewAllBeneficiaries",
        path: "/dashboard/grant-utilization",
      },
    ],
  },
  {
    icon: <BoxCubeIcon />, // Business Opportunities
    name: "Business Opportunities Management",
    translationKey: "sidebar.businessOpportunityManagement",
    allowedRoles: ["National Level User"],
    subItems: [
      {
        icon: <PlusIcon />,
        name: "Add Business Opportunities",
        translationKey: "sidebar.addBusinessOpportunity",
        path: "/dashboard/national-level/business-opportunity/create",
      },
      {
        icon: <EyeIcon />,
        name: "View Business opportunities",
        translationKey: "sidebar.viewBusinessOpportunity",
        path: "/dashboard/national-level/business-opportunity/view",
      },
    ],
  },
  {
    icon: <ShootingStarIcon />, // Business Empowerment Plan
    name: "Business Empowerment Plan",
    translationKey: "sidebar.businessEmpowers",
    allowedRoles: ["GN Level User"],
    subItems: [
      {
        icon: <EyeIcon />,
        name: "View Business Empowerment Plan",
        translationKey: "sidebar.viewBusinessEmpowerment",
        path: "/dashboard/gn-level/business-empowerment/view",
      },
    ],
  },
  {
    icon: <TaskIcon />, // Beneficiary Training
    name: "Beneficiary Training",
    translationKey: "sidebar.beneficiaryTraining",
    allowedRoles: ["GN Level User"],
    subItems: [
      {
        icon: <EyeIcon />,
        name: "View Beneficiary Training",
        translationKey: "sidebar.viewBeneficiaryTraining",
        path: "/dashboard/gn-level/beneficiary-training/view",
      },
    ],
  },
  {
    icon: <UserIcon />, // Beneficiaries Profiles
    name: "Beneficiaries Profiles",
    translationKey: "sidebar.beneficiariesProfiles",
    path: "/dashboard/national-level/beneficiaries-profiles",
    allowedRoles: ["National Level User"],
  },
];


const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, closeMobileSidebar } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [openSubSubMenu, setOpenSubSubMenu] = useState<{ parentIndex: number; subIndex: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<number, number>>({});
  const [subSubMenuHeight, setSubSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const subSubMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { t } = useLanguage(); // Get the translation function

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

  const getFilteredNavItems = (items: typeof navItems) => {
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

  const handleNavigationClick = () => {
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      closeMobileSidebar();
    }
  };

  // Handle dashboard navigation with role-based redirection
  const handleDashboardClick = () => {
    const dashboardPath = getDashboardPath(userRole);
    router.push(dashboardPath);
    handleNavigationClick();
  };

  // Check if dashboard is active (any of the dashboard paths)
  const isDashboardActive = () => {
    const dashboardPaths = [
      '/dashboard/national-level',
      '/dashboard/district-level',
      '/dashboard/divisional-level',
      '/dashboard/bank-zone-level',
      '/dashboard/gn-level'
    ];

    return dashboardPaths.some(path => pathname.startsWith(path));
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
  }, [openSubmenu, userRole]);

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

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {getFilteredNavItems(items).map((nav, index) => (
        <li key={nav.translationKey}>
          {nav.subItems ? (
            <div>
              <button
                onClick={() => {
                  handleSubmenuToggle(index);
                }}
                className={`menu-item group w-full flex items-center ${openSubmenu === index || isSubMenuActive(nav)
                  ? "menu-item-active"
                  : "menu-item-inactive"
                  } cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                  }`}
              >
                <span className={`flex-shrink-0 ${openSubmenu === index || isSubMenuActive(nav)
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text flex-1 text-left ml-3">{t(nav.translationKey)}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`flex-shrink-0 w-5 h-5 transition-transform duration-200 ${openSubmenu === index ? "rotate-180 text-brand-500" : ""
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
                      <li key={subItem.translationKey}>
                        {subItem.subSubItems ? (
                          <div>
                            <button
                              onClick={() => handleSubSubMenuToggle(index, subIndex)}
                              className={`menu-dropdown-item w-full text-left flex items-center justify-between ${(openSubSubMenu?.parentIndex === index && openSubSubMenu?.subIndex === subIndex) ||
                                isSubSubMenuActive(subItem)
                                ? "menu-dropdown-item-active"
                                : "menu-dropdown-item-inactive"
                                }`}
                            >
                              <span className="text-left">{t(subItem.translationKey)}</span>
                              <ChevronDownIcon
                                className={`flex-shrink-0 w-4 h-4 transition-transform duration-200 ${(openSubSubMenu?.parentIndex === index && openSubSubMenu?.subIndex === subIndex)
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
                                  <li key={subSubItem.translationKey}>
                                    <Link
                                      href={subSubItem.path}
                                      onClick={handleNavigationClick}
                                      className={`block py-2 px-3 text-sm rounded-md transition-colors text-left ${isActive(subSubItem.path)
                                        ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400"
                                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        }`}
                                    >
                                      {t(subSubItem.translationKey)}
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
                              onClick={handleNavigationClick}
                              className={`menu-dropdown-item block text-left ${isActive(subItem.path)
                                ? "menu-dropdown-item-active"
                                : "menu-dropdown-item-inactive"
                                }`}
                            >
                              {t(subItem.translationKey)}
                            </Link>
                          )
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : nav.isDashboard ? (
            // Special handling for dashboard item
            <button
              onClick={handleDashboardClick}
              className={`menu-item group flex items-center w-full ${isDashboardActive() ? "menu-item-active" : "menu-item-inactive"
                }`}
            >
              <span className={`flex-shrink-0 ${isDashboardActive() ? "menu-item-icon-active" : "menu-item-icon-inactive"
                }`}>
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text flex-1 text-left ml-3">{t(nav.translationKey)}</span>
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                onClick={handleNavigationClick}
                className={`menu-item group flex items-center ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span className={`flex-shrink-0 ${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"
                  }`}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text flex-1 text-left ml-3">{t(nav.translationKey)}</span>
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
              className="hidden md:dark:block"
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
                  {isExpanded || isHovered || isMobileOpen ? t("sidebar.menu") : <HorizontaLDots />}
                </h2>
                {renderMenuItems(navItems)}
              </div>
            ) : (
              <div className="p-4 text-sm text-gray-500">
                {t("sidebar.noMenuItems")}
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;