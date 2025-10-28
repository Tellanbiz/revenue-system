"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
}

interface TabNavigationProps {
  tabs: TabItem[];
  basePath?: string;
}

export default function TabNavigation({ tabs, basePath = "" }: TabNavigationProps) {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-200 px-2 pt-4">
      <div className="flex space-x-6 overflow-x-auto">
        {tabs.map((tab) => {
          const href = tab.href || `${basePath}/${tab.id}`;
          const isActive = pathname === href || (tab.id === 'pending' && pathname === basePath);

          return (
            <Link
              key={tab.id}
              href={href}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
