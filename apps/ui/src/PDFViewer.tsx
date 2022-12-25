import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './reducers';
import { Spinner } from './ui/Spinner';

export const PDFViewer: React.FC = () => {
  const preview = useSelector((state:RootState) => state.templateSlice.preview);

  const [oldPreview, setPreview] = useState<string | null>(preview.url)
  

  useEffect(()=>{
    if(!preview.isLoading){
    setTimeout(()=>{
      setPreview(preview.url)
    },0)
  }
  },[preview.url])


  if(!oldPreview){
    return <Spinner />;
  }

  return (
    <>
  

    <iframe title="pdf-viewer" style={{ width: '100%', height: '100%' }} src={oldPreview || ''} />

    </>
    

  );
};
