import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useLocation, Navigate } from 'react-router-dom';
import { GET_PAGE } from '../components/Page/PageQuery';
import { NoUuid, Loading, ErrorMessage, NoContent } from '../components/Page/StatusMessages';
import ParagraphRenderer from '../components/Page/ParagraphRenderer';
import { fetchPageUuidByPath } from '../utils/pageUtils';

const Page = ({ pageUuid: propPageUuid }) => {
  const location = useLocation();
  const [pageUuid, setPageUuid] = useState(propPageUuid);
  const [fetchingUuid, setFetchingUuid] = useState(!propPageUuid);
  const [fetchError, setFetchError] = useState(null);
  const [pageType, setPageType] = useState(null);
  const [redirectData, setRedirectData] = useState(null);

  useEffect(() => {
    // Reset state when path changes
    setFetchError(null);
    setFetchingUuid(true);
    setPageType(null);
    setRedirectData(null);
    
    if (!propPageUuid) {
      fetchPageUuidByPath(location.pathname)
        .then(data => {
          setPageUuid(data.uuid);
          setPageType(data.type);
          
          // Handle commerce product redirects
          if (data.type === 'commerce_product') {
            setRedirectData({
              pathname: `/product/${data.product_id}`,
              state: { productUuid: data.uuid }
            });
          }
          
          setFetchingUuid(false);
        })
        .catch(error => {
          setFetchError(error.message);
          setFetchingUuid(false);
        });
    } else {
      setPageUuid(propPageUuid);
      setFetchingUuid(false);
    }
  }, [propPageUuid, location.pathname]);

  const { loading, error, data } = useQuery(GET_PAGE, {
    variables: { id: pageUuid },
    skip: !pageUuid || pageType === 'commerce_product'
  });

  // Handle different states
  if (fetchingUuid) return <Loading message="Locating page..." />;
  if (fetchError) return <ErrorMessage message={fetchError} />;
  if (!pageUuid) return <NoUuid />;
  
  // Handle commerce product redirects
  if (redirectData) {
    return <Navigate to={redirectData.pathname} state={redirectData.state} replace />;
  }
  
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;
  
  const page = data?.nodePage;
  if (!page) return <NoContent />;

  return (
    <div className="page">
      {/* <h1 className="page-title">{page.title}</h1> */}
      <ParagraphRenderer paragraphs={page.paragraphs} />
    </div>
  );
};

export default Page; 