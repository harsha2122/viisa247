import React from 'react';
import { FC } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import { checkIsActive, KTIcon, WithChildren } from '../../../../helpers';
import { useLayout } from '../../../core';

type Props = {
  to: string;
  title: string;
  icon?: React.ReactNode; // Specify icon prop type as React.ReactNode
  fontIcon?: string;
  hasBullet?: boolean;
};

const SidebarMenuItem: FC<Props & WithChildren> = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  hasBullet = false,
}) => {
  const { pathname } = useLocation();
  const isActive = checkIsActive(pathname, to);
  const { config } = useLayout();
  const { app } = config;

  // SVG ke liye dynamic styles
  const iconStyles = {
    fill: isActive ? '#327113' : '#77BA7B',
  };

  return (
    <div className='menu-item'>
 
      <Link className={clsx('menu-link without-sub', { active: isActive })} to={to}>
      {hasBullet && (
        <span className='menu-bullet'>
          <span className='bullet bullet-dot'></span>
        </span>
      )}
        {icon && ( // Check if icon is provided
          <span style={{ marginRight: '15px', color: '#77BA7B' }} className='menu-custom-icon'>
            {React.isValidElement(icon) ? ( // Check if icon is a valid React element
              React.cloneElement(icon as React.ReactElement<any>, { style: iconStyles }) // Cloning icon with dynamic styles
            ) : (
              <span>{icon}</span> // If not a React element, render it as is
            )}
          </span>
        )}
        <span style={{ fontWeight: '500' }} className='menu-title'>
          {title}
        </span>
      </Link>
      {children}
    </div>
  );
};

export { SidebarMenuItem };
