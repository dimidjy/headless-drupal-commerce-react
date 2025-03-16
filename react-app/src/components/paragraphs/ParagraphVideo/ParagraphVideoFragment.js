import { gql } from '@apollo/client';

export const PARAGRAPH_VIDEO_FRAGMENT = gql`
  fragment ParagraphVideoFragment on ParagraphVideo {
    id
    video {
      ... on MediaRemoteVideo {
        id
        name
        mediaOembedVideo
      }
      ... on MediaVideo {
        id
        name
        mediaVideoFile {
          url
          name
        }
      }
    }
  }
`; 