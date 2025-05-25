import { siteSettings } from '@/settings/site.settings';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { Fragment, ReactNode } from 'react'
import SidebarItem from '../navigation/sidebar-item';
import MobileNavigation from '../navigation/mobile-navigation';
import Navbar from './navigation/top-nav-bar';

const PosLayout = ({children}:{children:ReactNode}) => {
    const { t } = useTranslation();
      const { locale } = useRouter();
      const dir = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';

    const SidebarItemMap = () => (
        <Fragment>
          {siteSettings.sidebarLinks.pos.map(({ href, label, icon }) => (
            <SidebarItem href={href} label={t(label)} icon={icon} key={href} />
          ))}
        </Fragment>
      );
  return (
    <div
    className='flex h-screen flex-col bg-gray-100 transition-colors duration-150'
    dir={dir}
    >
       <Navbar/>
        <MobileNavigation>
            <SidebarItemMap/>
        </MobileNavigation>
        <div className='w-full flex justify-center h-[calc(100vh-72px)]'>
            {children}
        </div>
    </div>
  )
}

export default PosLayout