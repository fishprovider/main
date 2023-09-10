import Giscus from '@giscus/react';

function GiscusComments() {
  return (
    <Giscus
      id="discussion"
      repo="fishprovider/discus"
      repoId="R_kgDOIDoNAg"
      category="Strategies"
      categoryId="DIC_kwDOIDoNAs4CRmjw"
      mapping="title"
      theme="preferred_color_scheme"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      lang="en"
      loading="lazy"
    />
  );
}

export default GiscusComments;
