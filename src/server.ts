import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import { getContext } from '@netlify/angular-runtime/context';

const angularAppEngine = new AngularAppEngine();

/**
 * Este es el manejador de peticiones que Netlify busca.
 * Sin esto, el "Manifiesto" no se activa.
 */
export async function reqHandler(req: Request) {
  const context = getContext();
  return await angularAppEngine.handle(req, context);
}