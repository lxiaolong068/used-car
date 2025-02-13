'use client';

import { useState, useEffect } from 'react';

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

export function useMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/permissions/menus');
        if (!response.ok) {
          throw new Error('Failed to fetch menus');
        }
        const data = await response.json();
        setMenuItems(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载菜单失败');
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  return { menuItems, loading, error };
} 