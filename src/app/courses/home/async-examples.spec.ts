import { fakeAsync, flush, flushMicrotasks, tick } from '@angular/core/testing';

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
});
