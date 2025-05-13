import Image from 'next/image';
import Link from '@/components/ui/link';
import cn from 'classnames';
import { siteSettings } from '@/settings/site.settings';
import pos from '@/assets/placeholders/pos.png';

const Logo: React.FC<React.AnchorHTMLAttributes<{}>> = ({
  className,
  ...props
}) => {
  return (
    <Link
      href={siteSettings.logo.href}
      className={cn('inline-flex items-center', className)}
      {...props}
    >
      <span
        className="relative overflow-hidden"
        style={{
          width: siteSettings.logo.width,
          height: siteSettings.logo.height,
        }}
      >
        <Image
          src={pos}
          alt={siteSettings.logo.alt}
          layout="fill"
          objectFit="contain"
          loading="eager"
        />
      </span>

      <span 
        className="font-bold text-2xl" 
        style={{ color: '#0071ce' }}
      >
        MMCP
      </span>
    </Link>
  );
};

export default Logo;