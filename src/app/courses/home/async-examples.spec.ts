import { fakeAsync, flush, tick } from '@angular/core/testing';

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
});
