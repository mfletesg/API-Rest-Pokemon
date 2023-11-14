import {createHash} from 'crypto';

export async function encriptPassword(password: string): Promise<string> {
  try {
    const hash = createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
  } catch (error) {
    throw new Error('Error al encriptar la contraseña');
  }
}
