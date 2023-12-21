import React from "react";

const Lines = ({ content }) => {
  const formattedContent = content.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
  return formattedContent;
}
 
export default Lines;