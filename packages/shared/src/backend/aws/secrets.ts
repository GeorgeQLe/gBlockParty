import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

let client: SecretsManagerClient | null = null;

function getClient(): SecretsManagerClient {
  if (!client) {
    client = new SecretsManagerClient({
      region: process.env.AWS_REGION ?? "us-east-1",
    });
  }
  return client;
}

const cache = new Map<string, { value: string; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function getSecret(secretId: string): Promise<string> {
  const sm = getClient();
  const response = await sm.send(
    new GetSecretValueCommand({ SecretId: secretId }),
  );
  if (!response.SecretString) {
    throw new Error(`Secret ${secretId} has no string value`);
  }
  return response.SecretString;
}

export async function getCachedSecret(secretId: string): Promise<string> {
  const cached = cache.get(secretId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const value = await getSecret(secretId);
  cache.set(secretId, { value, expiresAt: Date.now() + CACHE_TTL_MS });
  return value;
}
