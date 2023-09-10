import { NotificationProps, showNotification } from '@mantine/notifications';
import _ from 'lodash';

// TODO: improve this
const parseParam = (param: string | NotificationProps) => (
  _.isString(param) ? { message: param } : param
);

const toastInfo = (param: string | NotificationProps) => {
  showNotification(parseParam(param));
};

const toastSuccess = (param: string | NotificationProps) => {
  showNotification({
    ...parseParam(param),
    color: 'green',
  });
};

const toastWarn = (param: string | NotificationProps) => {
  showNotification({
    ...parseParam(param),
    color: 'orange',
  });
};

const toastError = (param: string | NotificationProps) => {
  showNotification({
    ...parseParam(param),
    color: 'red',
  });
};

export {
  toastError,
  toastInfo,
  toastSuccess,
  toastWarn,
};
