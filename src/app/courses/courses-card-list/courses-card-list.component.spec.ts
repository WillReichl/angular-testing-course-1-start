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
      });
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
    // console.log(component);
  });

  it('should display the course list', () => {
    pending();
  });

  it('should display the first course', () => {
    pending();
  });
});
