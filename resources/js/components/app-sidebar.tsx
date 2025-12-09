"use client"

import * as React from "react"
import {
  Bot, LayoutGrid, ChartBarStacked , Package,
  Car ,PackageCheck, Locate

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
        title: 'Repuestos',
        href: "category.index().url",
        icon: PackageCheck ,
    },
    {
        title: 'Vehículos',
        href: "brands.index().url",
        icon: Car ,
    },
    {
        title: 'Proveedores',
        href: "product.index().url",
        icon: Package,
    },
    {
      title: 'Categorias',
      href: "category.trashed().url",
      icon: ChartBarStacked , 
    }, 
    {
      title: 'Ubicaciones',
      href: "category.trashed().url",
      icon: Locate  , 
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
