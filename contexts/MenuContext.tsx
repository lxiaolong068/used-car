import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface MenuItem {
  permission_id: number;
  parent_id: number | null;
  permission_name: string;
  permission_key: string;
  permission_type: 'menu' | 'button' | 'api';
  path: string | null;
  component: string | null;
  icon: string | null;
  sort_order: number;
  status: number;
  create_time: string;
  children?: MenuItem[];
}

interface MenuContextProps {
  menuItems: MenuItem[];
  loading: boolean;
  error: Error | null;
  refreshMenuItems: () => Promise<void>;
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { data: session, status } = useSession();

  const fetchMenuItems = useCallback(async () => {
    if (status !== 'authenticated' || !session) {
      console.log('Skipping fetchMenuItems - not authenticated');
      return;
    }

    try {
      setMenuLoading(true);
      console.log('Fetching menu items...');
      const response = await fetch('/api/permissions/menus', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch menus');
      }
      
      console.log('Menu items:', data);
      setMenuItems(data);
      setError(null);
    } catch (error:any) {
      console.error('Error fetching menu items:', error);
      setError(error);
      setMenuItems([]);
    } finally {
      setMenuLoading(false);
    }
  }, [session, status]);

  useEffect(() => {
    if (status === 'authenticated' && !menuItems.length) {
      fetchMenuItems();
    }
  }, [status, fetchMenuItems, menuItems.length]);

  const value = {
    menuItems,
    loading: status === 'loading' || menuLoading,
    error,
    refreshMenuItems: fetchMenuItems
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu(): MenuContextProps {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
} 