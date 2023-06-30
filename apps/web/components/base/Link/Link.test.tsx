import { render } from '@testing-library/react';

import Link from './Link';

describe('Link', () => {
  test('default', () => {
    render(<Link href="/foo">Default</Link>);
  });

  test('noColor', () => {
    render(<Link href="/foo" variant="noColor">No Color</Link>);
  });

  test('hoverOnly', () => {
    render(<Link href="/foo" variant="hoverOnly">Hover Only</Link>);
  });

  test('clean', () => {
    render(<Link href="/foo" variant="clean">Clean</Link>);
  });
});
