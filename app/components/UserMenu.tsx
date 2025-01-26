'use client'

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function UserMenu({ username }: { username: string }) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        router.push('/')
      }
    } catch (error) {
      console.error('退出登录失败:', error)
    }
  }

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center text-sm rounded-full hover:opacity-80 focus:outline-none">
        <UserCircleIcon className="h-8 w-8 text-gray-600" />
        <span className="ml-2 text-gray-700">{username}</span>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleLogout}
                className={classNames(
                  active ? 'bg-gray-100' : '',
                  'flex w-full px-4 py-2 text-sm text-gray-700'
                )}
              >
                退出登录
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
