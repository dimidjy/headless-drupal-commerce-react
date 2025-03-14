import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_HOME_PAGE } from '../components/HomePage/HomePageQuery';
import { NoUuid, Loading, ErrorMessage, NoContent } from '../components/HomePage/StatusMessages';
import ParagraphRenderer from '../components/HomePage/ParagraphRenderer';

const HomePage = ({ homepageUuid }) => {
  const { loading, error, data } = useQuery(GET_HOME_PAGE, {
    variables: { id: homepageUuid },
    skip: !homepageUuid,
  });

  // Handle different states
  if (!homepageUuid) return <NoUuid />;
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;
  
  const page = data?.nodePage;
  if (!page) return <NoContent />;

  return (
    <div className="home-page">
      <div className="container">
        <h1 className="page-title">{page.title}</h1>
        <ParagraphRenderer paragraphs={page.paragraphs} />
      </div>
    </div>
  );
};

export default HomePage; 