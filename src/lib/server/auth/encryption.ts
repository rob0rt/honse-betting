import { ENCRYPTION_KEY } from '$env/static/private';

export const ENCRYPTION_KEY_BYTES = 32;
export const IV_BYTES = 12;
export const ALGORITHM = 'AES-GCM';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function loadKey(key: Uint8Array<ArrayBuffer>, keyUsages: KeyUsage[]): Promise<CryptoKey> {
	return crypto.subtle.importKey('raw', key, ALGORITHM, false, keyUsages);
}

class Encryption {
	private key: CryptoKey | undefined;

	constructor(private readonly encryptionKey: Uint8Array<ArrayBuffer>) {
		if (encryptionKey.length !== ENCRYPTION_KEY_BYTES) {
			throw new Error(`Encryption key must be ${ENCRYPTION_KEY_BYTES} bytes`);
		}
	}

	/**
	 * Encrypts the given data
	 */
	async encrypt(data: string): Promise<string> {
		if (!this.key) {
			this.key = await loadKey(this.encryptionKey, ['encrypt', 'decrypt']);
		}

		const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
		const encrypted = await crypto.subtle.encrypt(
			{
				name: ALGORITHM,
				iv
			},
			this.key,
			encoder.encode(data)
		);

		// combine IV and encrypted data into a single array of bytes
		const cipherBytes = [...iv, ...new Uint8Array(encrypted)];

		// convert concatenated result to base64 string
		return btoa(String.fromCharCode(...cipherBytes));
	}

	/**
	 * Decrypts the given data
	 */
	async decrypt(data: string): Promise<string> {
		if (!this.key) {
			this.key = await loadKey(this.encryptionKey, ['encrypt', 'decrypt']);
		}

		// convert base64 back to bytes
		const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));

		// extract IV from the head
		const iv = bytes.slice(0, IV_BYTES);
		const cipher = bytes.slice(IV_BYTES);

		const decrypted = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, this.key, cipher);
		return decoder.decode(decrypted);
	}
}

export const AES = new Encryption(Buffer.from(ENCRYPTION_KEY));
