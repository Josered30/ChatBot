import {CognitoIdentityClient} from '@aws-sdk/client-cognito-identity';
import {fromCognitoIdentityPool} from '@aws-sdk/credential-provider-cognito-identity';
import {LexRuntimeV2Client} from '@aws-sdk/client-lex-runtime-v2';

const region = 'us-east-1';

export const client = new LexRuntimeV2Client({
  region: region,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({region}),
    // Replace IDENTITY_POOL_ID with an appropriate Amazon Cognito Identity Pool ID for, such as 'us-east-1:xxxxxx-xxx-4103-9936-b52exxxxfd6'.
    identityPoolId: 'us-east-1:0beff08b-2cc4-4b5a-ba27-f5183eaa0106',
  }),
});
