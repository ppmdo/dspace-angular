import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

export function getMockStore<T>(): Store<T> {
  return jasmine.createSpyObj('store', [
    'select',
    'dispatch',
    'lift',
    'next',
    'error',
    'complete',
    'addReducer',
    'removeReducer'
  ]);
}
