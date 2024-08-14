'use client'

import { Avatar } from '@/components/avatar'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/dropdown'
import { Navbar, NavbarSection, NavbarSpacer } from '@/components/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/sidebar'
import { SidebarLayout } from '@/components/sidebar-layout'
import { SignedIn, UserButton } from '@clerk/nextjs'

import { ChevronDownIcon, Cog8ToothIcon, PlusIcon } from '@heroicons/react/16/solid'
import {
  Cog6ToothIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  Square2StackIcon,
  TicketIcon,
} from '@heroicons/react/20/solid'
import { usePathname } from 'next/navigation'
import { Toaster } from 'react-hot-toast'

export function ApplicationLayout({ events, children }) {
  let pathname = usePathname()

  return (
    <>
      <Toaster />
      <SidebarLayout
        navbar={
          <Navbar>
            <NavbarSpacer />
            <NavbarSection>
              <UserButton
                showName
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'rounded-full border border-gray-300',
                    userButtonText: 'text-sm font-medium text-white-700',
                    userButtonDropdown: 'bg-white border border-gray-300 shadow-lg',
                  },
                }}
                className="text-white-700 text-sm font-medium"
              />
            </NavbarSection>
          </Navbar>
        }
        sidebar={
          <Sidebar>
            <SidebarHeader>
              <Dropdown>
                <DropdownButton as={SidebarItem}>
                  <Avatar src="/teams/catalyst.svg" />
                  <SidebarLabel>Catalyst</SidebarLabel>
                  <ChevronDownIcon />
                </DropdownButton>
                <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
                  <DropdownItem href="/settings">
                    <Cog8ToothIcon />
                    <DropdownLabel>Settings</DropdownLabel>
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem href="#">
                    <Avatar slot="icon" src="/teams/catalyst.svg" />
                    <DropdownLabel>Catalyst</DropdownLabel>
                  </DropdownItem>
                  <DropdownItem href="#">
                    <Avatar slot="icon" initials="BE" className="bg-purple-500 text-white" />
                    <DropdownLabel>Big Events</DropdownLabel>
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem href="#">
                    <PlusIcon />
                    <DropdownLabel>New team&hellip;</DropdownLabel>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </SidebarHeader>

            <SidebarBody>
              <SidebarSection>
                <SidebarItem href="/" current={pathname === '/' || pathname.startsWith('/todos')}>
                  <HomeIcon />
                  <SidebarLabel>Home</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/todos" current={pathname === '/todos'}>
                  <Square2StackIcon />
                  <SidebarLabel>My Todos</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/orders" current={pathname.startsWith('/orders')}>
                  <TicketIcon />
                  <SidebarLabel>Orders</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/settings" current={pathname.startsWith('/settings')}>
                  <Cog6ToothIcon />
                  <SidebarLabel>Settings</SidebarLabel>
                </SidebarItem>
              </SidebarSection>

              <SidebarSpacer />

              <SidebarSection>
                <SidebarItem href="#">
                  <QuestionMarkCircleIcon />
                  <SidebarLabel>Support</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="#">
                  <SparklesIcon />
                  <SidebarLabel>Changelog</SidebarLabel>
                </SidebarItem>
              </SidebarSection>
            </SidebarBody>

            <SignedIn>
              <SidebarFooter className="rounded-lg bg-[#18181B] max-lg:hidden">
                <UserButton
                  showName
                  appearance={{
                    elements: {
                      userButtonAvatarBox: 'rounded-full border border-gray-300',
                      userButtonText: 'text-sm font-medium text-white-700',
                      userButtonDropdown: 'bg-white border border-gray-300 shadow-lg',
                    },
                  }}
                />
              </SidebarFooter>
            </SignedIn>
          </Sidebar>
        }
      >
        {children}
      </SidebarLayout>
    </>
  )
}
