import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_HOME_PAGE } from '../components/HomePage/HomePageQuery';
import { NoUuid, Loading, ErrorMessage, NoContent } from '../components/HomePage/StatusMessages';
import ParagraphRenderer from '../components/HomePage/ParagraphRenderer';
import { debugGraphQLOperation, debugGraphQLResponse, debugGraphQLError } from '../utils/debugGraphQL';

const HomePage = ({ homepageUuid }) => {
  // Debug log when component mounts or UUID changes
  useEffect(() => {
    console.log('=== HomePage Component Debug ===');
    console.log('Homepage UUID:', homepageUuid);
    
    // Debug the GraphQL operation that will be executed
    if (homepageUuid) {
      debugGraphQLOperation(GET_HOME_PAGE, { id: homepageUuid });
    }
  }, [homepageUuid]);

  const { loading, error, data } = useQuery(GET_HOME_PAGE, {
    variables: { id: homepageUuid },
    skip: !homepageUuid,
    onError: (error) => {
      // Use our debug utility for errors
      debugGraphQLError(error, GET_HOME_PAGE, { id: homepageUuid });
    }
  });

  // Debug log when data changes
  useEffect(() => {
    if (data) {
      // Use our debug utility for responses
      debugGraphQLResponse(data, GET_HOME_PAGE);
    }
  }, [data]);

  // Handle different states
  if (!homepageUuid) return <NoUuid />;
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;
  
  const page = data?.nodePage;
  if (!page) return <NoContent />;

  return (
    <div className="home-page">
      {/* <h1 className="page-title">{page.title}</h1> */}
      <ParagraphRenderer paragraphs={page.paragraphs} />
    </div>
  );
};

export default HomePage; 