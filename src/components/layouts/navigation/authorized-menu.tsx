import cn from 'classnames';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Avatar from '@/components/common/avatar';
import Link from '@/components/ui/link';
import { siteSettings } from '@/settings/site.settings';
import { useTranslation } from 'next-i18next';
import { useMeQuery } from '@/data/user';

export default function AuthorizedMenu() {
  const { t } = useTranslation('common');
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  // Again, we're using framer-motion for the transition effect
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center focus:outline-none">
        <Avatar src={siteSettings?.avatar?.placeholder} alt="avatar" />
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
        <Menu.Items
          as="ul"
          className="absolute mt-1 w-48 rounded bg-white shadow-md end-0 origin-top-end focus:outline-none"
        >
          <Menu.Item key={user?.id}>
            <li
              className="flex w-full flex-col space-y-1 rounded-t
             bg-[#007ee6] px-4 py-3 text-sm text-white"
            >
              <span className="font-semibold capitalize">{user?.name}</span>
              <span className="text-xs">{user?.email}</span>
            </li>
          </Menu.Item>

          {siteSettings.authorizedLinks.map(({ href, labelTransKey }) => (
            <Menu.Item key={`${href}${labelTransKey}`}>
              {({ active }) => (
                <li className="cursor-pointer border-b border-gray-100 last:border-0">
                  <Link
                    href={href}
                    className={cn(
                      'block px-4 py-3 text-sm font-semibold capitalize transition duration-200 hover:text-accent',
                      active ? 'text-accent' : 'text-heading'
                    )}
                  >
                    {t(labelTransKey)}
                  </Link>
                </li>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
