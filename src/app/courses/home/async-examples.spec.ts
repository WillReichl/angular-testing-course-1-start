import { fakeAsync, flush, flushMicrotasks, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

fdescribe('Async Testing Examples', () => {
  it('Asynchronous Test example with Jasmine done()', (done: DoneFn) => {
    let test = false;

    setTimeout(() => {
      console.log('running assertions');
      test = true;
      expect(test).toBeTruthy();
      done();
    }, 1000);
  });

  it('Asynchronous Test example - setTimeout()', fakeAsync(() => {
    let test = false;

    setTimeout(() => {
      console.log('running assertions setTimeout');
      test = true;
      expect(test).toBeTruthy();
    }, 1000);

    // within fakeAsync zone, we manually control a simulated passage of time
    // tick(1000);
    // if we did "tick(500)" this would not work, since async operation would not complete for another 500ms

    // another option, use "flush" to ensure all async operations are completed
    flush();

    // Note, this also allows us to move assertions outside of the callback
    expect(test).toBeTruthy();
  }));

  it('Asynchronous test example - plain promise', fakeAsync(() => {
    let test = false;

    // setTimeout(() => {
    //   console.log('setTimeout() first callback triggered.');
    // });

    // setTimeout(() => {
    //   console.log('setTimeout() second callback triggered.');
    // });

    // Promises always executed before setTimeout.
    // Promise is considered a "Micro Task". This is a separate queue in the browser. More lightweight.
    // setTimeout is considered a "Macro Task". Between each of these in queue, screen may be updated.
    Promise.resolve()
      .then(() => {
        console.log('Promise first then() evaluated successfully');
        return Promise.resolve();
      })
      .then(() => {
        console.log('Promise second then() evaluated successfully');
        test = true;
      });

    flushMicrotasks();

    console.log('running test assertions');

    expect(test).toBeTruthy();
  }));

  it('Asynchronous test example - Promises + setTimeout()', fakeAsync(() => {
    let counter = 0;

    Promise.resolve().then(() => {
      counter += 10;
      setTimeout(() => {
        counter += 1;
      }, 1000);
    });

    expect(counter).toBe(0);

    flushMicrotasks(); // only empty Microtask queue

    // at this intermediate state, Promise is complete, but not setTimeout

    expect(counter).toBe(10);

    tick(1000);

    expect(counter).toBe(11);
  }));

  it('Synchronous test example - Synchronous Observables', () => {
    let test = false;

    console.log('Creating Observable');

    const test$ = of(test);

    test$.subscribe(() => {
      test = true;
    });
    console.log('Running test assertions');
    expect(test).toBe(true);
  });

  it('Asynchronous test example - Asynchronous Observables', fakeAsync(() => {
    let test = false;

    console.log('Creating Observable');

    const test$ = of(test).pipe(delay(1000));

    test$.subscribe(() => {
      test = true;
    });

    tick(1000);

    console.log('Running test assertions');
    expect(test).toBe(true);
  }));
});
