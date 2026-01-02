"use client"

import * as React from "react"
import {
  Bot, LayoutGrid, ChartBarStacked, Package,
  Car, PackageCheck, Locate
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, usePage } from '@inertiajs/react'; // Añade usePage
import { dashboard } from '@/routes';
import AppLogo from './app-logo';
import { type NavItem } from '@/types';
import category from "@/routes/category"

//Menú
const mainNavItems: NavItem[] = [
  {
    title: 'Panel de control',
    href: dashboard().url,
    icon: LayoutGrid,
  }
];

const Inventario: NavItem[] = [
  {
    title: 'Repuestos',
    href: "#",
    icon: PackageCheck,
  },
  {
    title: 'Vehículos',
    href: "#",
    icon: Car,
  },
  {
    title: 'Proveedores',
    href: "#",
    icon: Package,
  },
  {
    title: 'Categorias',
    href: category.index().url,
    icon: ChartBarStacked,
  },
  {
    title: 'Ubicaciones',
    href: "#",
    icon: Locate,
  }
]

const MenuDesplegable: NavItem[] = [
  {
    title: "Models",
    href: "#",
    icon: Bot,
    items: [
      {
        title: "Genesis",
        href: "#",
      },
      {
        title: "Explorer",
        href: "#",
      },
      {
        title: "Quantum",
        href: "#",
      },
    ],
  }
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Usa usePage para obtener la URL actual de Inertia
  const { url } = usePage();
  const currentPath = url;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={dashboard().url} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Pasa currentPath a TODOS los NavMain */}
        <NavMain items={mainNavItems} groupLabel="Dashboard" currentPath={currentPath} />
        <NavMain items={Inventario} groupLabel="Inventario" currentPath={currentPath} />
        <NavMain items={MenuDesplegable} groupLabel="Menu Desplegable" currentPath={currentPath} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}