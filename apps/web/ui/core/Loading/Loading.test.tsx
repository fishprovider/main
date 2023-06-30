import { render } from '@testing-library/react';

import Loading from './Loading';

describe('Loading', () => {
  test('default', () => {
    render(<Loading />);
  });

  test('inline', () => {
    render(<Loading inline />);
  });
});
