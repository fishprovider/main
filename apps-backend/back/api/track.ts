import axios from 'axios';

// public
const track = async ({ data }: { data: any }) => {
  const { identity, event, properties } = data;
  await axios.post('https://heapanalytics.com/api/track', {
    app_id: '1356875370',
    identity: identity || 'admin@fishprovider.com',
    event: event || 'Custom Event',
    properties: properties || {},
  });
  return {};
};

export default track;
