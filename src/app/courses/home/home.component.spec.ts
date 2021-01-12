import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
} from '@angular/core/testing';
import { CoursesModule } from '../courses.module';
import { DebugElement } from '@angular/core';

import { HomeComponent } from './home.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CoursesService } from '../services/courses.service';
import { HttpClient } from '@angular/common/http';
import { COURSES } from '../../../../server/db-data';
import { setupCourses } from '../common/setup-test-data';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { click } from '../common/test-utils';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  const beginnerCourses = setupCourses().filter(
    (c) => c.category === 'BEGINNER'
  );

  const advancedCourses = setupCourses().filter(
    (c) => c.category === 'ADVANCED'
  );

  beforeEach(async(() => {
    // define mock service
    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', [
      'findAllCourses', // only method called by our home component
    ]);

    TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [{ provide: CoursesService, useValue: coursesServiceSpy }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      });
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display only beginner courses', () => {
    // must return observable of courses, not array of courses, hence rxjs "of"
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
  });

  it('should display only advanced courses', () => {
    // must return observable of courses, not array of courses, hence rxjs "of"
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
  });

  it('should display both tabs', () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(2, 'Unexpected number of tabs found');
  });

  // Done callback allows us to notify Jasmine when asynchronous tests complete
  it('should display advanced courses when tab clicked', fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    // console.log(setupCourses());

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    // Simulate user click using custom function that makes use of DebugElement
    click(tabs[1]);

    // Must detect changes again? Nope, test still fails - must fix w/ async testing
    fixture.detectChanges();

    flush();

    const cardTitles = el.queryAll(
      By.css('.mat-tab-body-active .mat-card-title')
    );
    console.log(cardTitles);

    expect(cardTitles.length).toBeGreaterThan(
      0,
      'Could not find course card titles'
    );
    expect(cardTitles[0].nativeElement.textContent).toContain(
      'Angular Security Course',
      'Could not find expected course title'
    );
  }));
});
