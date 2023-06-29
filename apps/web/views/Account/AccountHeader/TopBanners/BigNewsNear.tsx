import React from 'react';

import Alert from '~ui/core/Alert';

interface Props {
  onClose: () => void,
}

function BigNewsNear({ onClose }: Props) {
  return (
    <Alert
      title="Big News Coming!"
      color="red"
      p="md"
      radius="md"
      variant="outline"
      withCloseButton
      onClose={onClose}
    >
      Big News is coming soon! Cut trading volume by 50% or close all orders for safety purposes!
    </Alert>
  );
}

export default BigNewsNear;
