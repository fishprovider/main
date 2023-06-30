// import Persona from 'persona';

import Stack from '~ui/core/Stack';

function KYC() {
  return (
    <Stack id="fishprovider-kyc" h={800}>
      {/* <Persona.Inquiry
        templateId="itmpl_tvcDY2jMLabQg5oVntheXuc8"
        environmentId="env_7aW4obgFu1WfDV9en4VsvMKw"
        // inquiryId
        // sessionToken
        onLoad={() => {
          // @ts-ignore skip html
          document.getElementById('fishprovider-kyc')?.firstChild.style.height = '100%';
        }}
        onComplete={({ inquiryId, status, fields }) => {
          console.log(`Sending finished inquiry ${inquiryId} to backend`, status, fields);
        }}
        onCancel={({ inquiryId, sessionToken }) => {
          console.log(`Sending cancelled inquiry ${inquiryId} to backend`, sessionToken);
        }}
        onEvent={(name, metadata) => {
          console.log(`Received event ${name} with metadata`, metadata);
        }}
        onError={(error) => {
          console.log('Received error', error);
        }}
      /> */}
    </Stack>
  );
}

export default KYC;
