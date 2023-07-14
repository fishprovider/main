import Group from '~ui/core/Group';

import ReviewProductReview from './ReviewProductReview';
import ReviewProvenExpert from './ReviewProvenExpert';
import ReviewTrustPilot from './ReviewTrustPilot';

function Reviews() {
  return (
    <Group align="flex-start" spacing="xl">
      <ReviewTrustPilot />
      <ReviewProductReview />
      <ReviewProvenExpert />
    </Group>
  );
}

export default Reviews;
