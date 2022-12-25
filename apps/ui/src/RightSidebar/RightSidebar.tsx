import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Sidebar } from '../ui/Sidebar';
import Properties from './Properties';
import { RootState } from '../reducers';
import { getSelectedElement } from '../selectors';

const RightSidebar: React.FC = () => {
  const selectedElement = useSelector((state: RootState) => getSelectedElement(state.templateSlice));

  if (!selectedElement) {
    return null;
  }
  return (
    <div style={{ width: '100%', height: '100%', background: 'white' }}>
      <Sidebar>
        <Properties />
      </Sidebar>
    </div>
  );
};

export default RightSidebar;
