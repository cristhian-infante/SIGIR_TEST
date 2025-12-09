"use client"

import * as React from "react"
import {
  Bot, LayoutGrid, List, Trash2, Package,
  ChartColumnStacked

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
import { Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import AppLogo from './app-logo';
import { type NavItem } from '@/types';
//Menú

const mainNavItems: NavItem[] = [
    {
        title: 'Panel de control',
        href: dashboard().url,
        icon: LayoutGrid,
    }   
];
const Menu: NavItem[] =[
    {
        title: 'Categorias',
        href: "category.index().url",
        icon: ChartColumnStacked,
    },
    // {
    //     title: 'Marcas',
    //     href: brands.index().url,
    //     icon: ChartColumnStacked,
    // },
    // {
    //     title: 'Productos',
    //     href: product.index().url,
    //     icon: Package,
    // },
    // {
    //   title: 'Papelera',
    //   href: category.trashed().url,
    //   icon: Trash2, // Asegúrate de importar el icono
    // } 
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
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={mainNavItems} groupLabel="Dashboard" />
        <NavMain items={Menu} groupLabel="Menú" />
        <NavMain items={MenuDesplegable} groupLabel="Menu Desplegable" />
       
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
