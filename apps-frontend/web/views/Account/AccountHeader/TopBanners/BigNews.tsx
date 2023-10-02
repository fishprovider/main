import _ from 'lodash';
import moment from 'moment';
import React from 'react';

import { watchNewsController } from '~services/news/watchNews.controller';
import Alert from '~ui/core/Alert';
import List from '~ui/core/List';

interface Props {
  onClose: () => void,
}

function BigNews({ onClose }: Props) {
  const news = watchNewsController((state) => _.filter(
    state,
    ({ impact, datetime }) => ['high', 'medium'].includes(impact)
      && moment(datetime) > moment().subtract(1, 'hour')
      && moment(datetime) < moment().add(1, 'hour'),
  ));

  const messages = news.map(
    ({
      datetime = '', currency = '', impact = '', title = '',
    }) => {
      let icon = '';
      if (impact === 'high') icon = '🔴';
      if (impact === 'medium') icon = '🟠';
      const datetimeText = new Date(datetime).toLocaleString();
      return `${datetimeText}, ${currency} ${icon}, ${title}`;
    },
  );

  return (
    <Alert
      title="Big News!"
      color="red"
      p="md"
      radius="md"
      variant="outline"
      withCloseButton
      onClose={onClose}
      closeButtonLabel="Close banner Big News"
    >
      <List>
        {messages.map((msg) => (
          <List.Item key={msg}>{msg}</List.Item>
        ))}
      </List>
    </Alert>
  );
}

export default BigNews;
