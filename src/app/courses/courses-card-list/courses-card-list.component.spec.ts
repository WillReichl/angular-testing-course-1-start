import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursesCardListComponent } from './courses-card-list.component';
import { CoursesModule } from '../courses.module';
import { COURSES } from '../../../../server/db-data';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { sortCoursesBySeqNo } from '../home/sort-course-by-seq';
import { Course } from '../model/course';
import { setupCourses } from '../common/setup-test-data';

describe('CoursesCardListComponent', () => {
  let component: CoursesCardListComponent; // each test gets a fresh component
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let el: DebugElement;

  // async here is not a JS language feature, specific to Angular testing
  // Basically we wait until all async operations in this block complete before starting each test.
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoursesModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
    // console.log(component);
  });

  it('should display the course list', () => {
    component.courses = setupCourses();

    // component change detection events must be manually fired!
    fixture.detectChanges();

    // query the DOM to see if courses are displayed
    const cards = el.queryAll(By.css('.course-card'));

    expect(cards).toBeTruthy('Could not find cards');
    expect(cards.length).toBe(12, 'Unexpected number of courses'); // test fails without change detection!

    // Note that this is a purely synchronous test. No "set timeout" or HTTP requests, etc.
    // To account for those, we would need a construct like we use in beforeEach.
    // Section 4 covers async testing. This is more straightforward and readable when possible.
  });

  it('should display the first course', () => {
    component.courses = setupCourses();

    fixture.detectChanges();
    const course = component.courses[0];

    // first-child is a "pseudo selector" to get first element in list
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes#Tree-structural_pseudo-classes
    const card = el.query(By.css('.course-card:first-child')),
      title = el.query(By.css('mat-card-title')),
      image = el.query(By.css('img'));

    expect(card).toBeTruthy('Could not find course card');

    // Ensure that card is being displayed correctly
    expect(title.nativeElement.textContent).toBe(course.titles.description, 'Incorrect course card title');
    expect(image.nativeElement.src).toBe(course.iconUrl, 'Incorrect course card image');
  });
});
