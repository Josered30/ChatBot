import {CognitoIdentityClient} from '@aws-sdk/client-cognito-identity';
import {fromCognitoIdentityPool} from '@aws-sdk/credential-provider-cognito-identity';
import {
  LexRuntimeV2Client,
  RecognizeUtteranceCommand,
  RecognizeUtteranceCommandOutput,
} from '@aws-sdk/client-lex-runtime-v2';
import {FormatType} from '../models/enums/formatType';
import {
  BotInteractionData,
  BotInteractionInput,
  BotInteractionOutput,
} from '../models/botInteraction';
import RNFetchBlob from 'rn-fetch-blob';
import {Buffer} from 'buffer';

const region = 'us-east-1';
const api = 'https://polly-test.herokuapp.com/api';

export const lexClient = new LexRuntimeV2Client({
  region: region,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({region}),
    // Replace IDENTITY_POOL_ID with an appropriate Amazon Cognito Identity Pool ID for, such as 'us-east-1:xxxxxx-xxx-4103-9936-b52exxxxfd6'.
    identityPoolId: 'us-east-1:0beff08b-2cc4-4b5a-ba27-f5183eaa0106',
  }),
});

interface BotData {
  botId: string;
  botAliasId: string;
}

function blobToBase64(blob: Blob): Promise<any> {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export async function interactWithBot(
  value: string,
  responseType: FormatType,
  requestType: FormatType,
  sessionId: string,
): Promise<BotInteractionData | null> {
  let botData: BotData = {
    botId: 'DBNSQ56OSU',
    botAliasId: 'TSTALIASID',
  };

  const requestContentType =
    requestType == FormatType.TEXT
      ? 'text/plain; charset=utf-8'
      : 'audio/x-l16; sample-rate=16000; channel-count=1';
  const responseContentType =
    responseType == FormatType.TEXT
      ? 'text/plain; charset=utf-8'
      : 'audio/mpeg';

  let input: any = value;
  if (requestType === FormatType.AUDIO) {
    try {
      const userAudio = await RNFetchBlob.fs.readFile(value, 'base64');
      input = Buffer.from(userAudio.toString(), 'base64');
    } catch (e) {
      console.log(e);
      throw Error('Audio error');
    }
  }

  const command: RecognizeUtteranceCommand = new RecognizeUtteranceCommand({
    inputStream: input,
    requestContentType: requestContentType,
    responseContentType: responseContentType,
    botId: botData?.botId,
    botAliasId: botData?.botAliasId,
    localeId: 'en_US',
    sessionId: sessionId,
  });

  try {
    const result: RecognizeUtteranceCommandOutput = await lexClient.send(
      command,
    );

    // if (requestType === FormatType.AUDIO) {
    //   const inputMessage: BotInteractionInput = {
    //     value: result.inputTranscript,
    //   };
    //   const output: BotInteractionOutput = await fetch(`${api}/lex`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(inputMessage),
    //   }).then(e => e.json());

    //   console.log(output);
    // }

    let url = '';
    if (responseType === FormatType.AUDIO) {
      url = `${RNFetchBlob.fs.dirs.MainBundleDir}/audio_bot.mp3`;
      let audio = await blobToBase64(result.audioStream as Blob);
      audio = audio.split(',')[1];
      await RNFetchBlob.fs.writeFile(url, audio, 'base64');
    }

    const botInteractionInput: BotInteractionInput = {
      value: result.messages,
    };

    const botInteractionOutput: BotInteractionOutput = await fetch(
      `${api}/lex`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(botInteractionInput),
      },
    ).then(e => e.json());

    let textOutput: string[] = [];
    if (botInteractionOutput.textOutput) {
      textOutput = botInteractionOutput.textOutput?.map(e => e.content);
    }

    return {
      textOutput: textOutput,
      audioUrl: url,
    };
  } catch (e) {
    console.log(e);
  }
  return null;
}
