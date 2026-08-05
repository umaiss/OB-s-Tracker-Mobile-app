import * as Keychain from 'react-native-keychain';

const SERVICE_NAME = 'obtrack_auth_tokens';

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export async function saveTokens(tokens: TokenPair): Promise<void> {
  await Keychain.setGenericPassword(
    'auth_tokens',
    JSON.stringify(tokens),
    { service: SERVICE_NAME },
  );
}

export async function getTokens(): Promise<TokenPair | null> {
  const result = await Keychain.getGenericPassword({ service: SERVICE_NAME });

  if (!result) {
    return null;
  }

  return JSON.parse(result.password) as TokenPair;
}

export async function clearTokens(): Promise<void> {
  await Keychain.resetGenericPassword({ service: SERVICE_NAME });
}