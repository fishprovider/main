import fs from 'fs';
import type { OAuth2Client } from 'google-auth-library';
import { gmail_v1, google } from 'googleapis';
import { createInterface } from 'readline';

const env = {
  projectId: process.env.GMAIL_PROJECT_ID,
  clientId: process.env.GMAIL_CLIENT_ID,
  secret: process.env.GMAIL_SECRET,

  useFileToken: process.env.GMAIL_USE_FILE_TOKEN,

  accessToken: process.env.GMAIL_ACCESS_TOKEN || null,
  refreshToken: process.env.GMAIL_REFRESH_TOKEN || null,
  scope: process.env.GMAIL_SCOPE || '',
  tokenType: process.env.GMAIL_TOKEN_TYPE || null,
  expiryDate: process.env.GMAIL_EXPIRY_DATE,
};

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
// To update scopes, delete token.json
const TOKEN_PATH = './token.json';

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(
  oAuth2Client: OAuth2Client,
  scopes: string[],
  callback: (oAuth2Client: OAuth2Client) => void,
) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes.join(' '),
  });
  Logger.info('Authorize this app by visiting this url:', authUrl);
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err || !token) {
        Logger.error('Error retrieving access token', err);
        return;
      }
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (errWrite) => {
        if (errWrite) {
          Logger.error('Failed to write', errWrite);
          return;
        }
        Logger.info('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(
  scopes: string[],
  callback: (oAuth2Client: OAuth2Client) => void,
) {
  const oAuth2Client = new google.auth.OAuth2(
    env.clientId,
    env.secret,
    'urn:ietf:wg:oauth:2.0:oob',
  );

  // Check if we have previously stored a token.
  if (env.useFileToken) {
    fs.readFile(TOKEN_PATH, 'utf8', (err, token) => {
      if (err) {
        Logger.error('Failed to authorize', err);
        getNewToken(oAuth2Client, scopes, callback);
        return;
      }
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  } else {
    const token = {
      access_token: env.accessToken,
      refresh_token: env.refreshToken,
      scope: env.scope,
      token_type: env.tokenType,
      expiry_date: env.expiryDate ? +env.expiryDate : null,
    };
    oAuth2Client.setCredentials(token);
    callback(oAuth2Client);
  }
}

const createGmailClient = async (scopes = ['https://www.googleapis.com/auth/gmail.readonly']) => {
  const auth = await new Promise<OAuth2Client>((resolve) => {
    authorize(scopes, resolve);
  });
  const gmailClient = google.gmail({
    version: 'v1',
    auth,
  });
  return gmailClient;
};

const getLabels = async (gmailClient: gmail_v1.Gmail) => {
  const res = await gmailClient.users.labels.list({
    userId: 'me',
  });
  const { labels } = res.data;
  return {
    labels,
  };
};

const getMessages = async (gmailClient: gmail_v1.Gmail, labelIds: string[]) => {
  const res = await gmailClient.users.messages.list({
    userId: 'me',
    labelIds,
  });
  const { messages, resultSizeEstimate } = res.data;
  return {
    messages,
    resultSizeEstimate,
  };
};

const getMessage = async (gmailClient: gmail_v1.Gmail, messageId: string) => {
  const res = await gmailClient.users.messages.get({
    userId: 'me',
    id: messageId,
    // maxResults: 500,
  });
  const { payload } = res.data;
  if (!payload) {
    return {
      body: '',
      parts: [],
    };
  }
  if (payload.parts) {
    return { parts: payload.parts.map((part) => Buffer.from(part.body?.data || '', 'base64').toString()) };
  }
  return { body: Buffer.from(payload.body?.data || '', 'base64').toString() };
};

const removeLabels = async (gmailClient: gmail_v1.Gmail, messageId: string, labelIds:string[]) => {
  const res = await gmailClient.users.messages.modify({
    userId: 'me',
    id: messageId,
    requestBody: {
      removeLabelIds: labelIds,
    },
  });
  return res.data;
};

export {
  createGmailClient,
  getLabels,
  getMessage,
  getMessages,
  removeLabels,
};
