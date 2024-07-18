"use client"

import { useState } from "react";

// Las tabs comienzan desde 0, 1, ..., n.

const useActiveTab = (initialTab: number) => {
  const [activeTab, setActiveTab] = useState<number>(initialTab);

  const updateActiveTab = (newTab: number) => {
    setActiveTab(newTab);
  }

  return {
    activeTab,
    updateActiveTab
  };
}

export default useActiveTab;