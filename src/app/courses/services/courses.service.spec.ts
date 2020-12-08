import { TestBed } from '@angular/core/testing';
import { CoursesService } from './courses.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  COURSES,
  findLessonsForCourse,
  LESSONS,
} from '../../../../server/db-data';
import { Course } from '../model/course';
import { HttpErrorResponse } from '@angular/common/http';

describe('CoursesService', () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should retrieve all courses', () => {
    // this subscribe will wait until our mock HTTP service returns values
    coursesService.findAllCourses().subscribe((courses) => {
      expect(courses).toBeTruthy('No courses returned');
      expect(courses.length).toBe(12, 'Incorrect number of courses');
      const course = courses.find((c) => c.id === 12);
      expect(course.titles.description).toBe('Angular Testing Course');
    });

    const request = httpTestingController.expectOne('/api/courses');
    expect(request.request.method).toEqual('GET');

    // this causes the actual action to take place
    request.flush({ payload: Object.values(COURSES) });
  });

  it('should find course by id', () => {
    // this subscribe will wait until our mock HTTP service returns values
    coursesService.findCourseById(12).subscribe((course) => {
      expect(course).toBeTruthy('No course returned');
      expect(course.id).toBe(12);
      expect(course.titles.description).toBe('Angular Testing Course');
    });

    const request = httpTestingController.expectOne('/api/courses/12');
    expect(request.request.method).toEqual('GET');

    // this causes the actual action to take place
    request.flush(COURSES[12]);
  });

  it('should save the course data', () => {
    const changes: Partial<Course> = {
      titles: { description: 'Testing Course' },
    };
    coursesService.saveCourse(12, changes).subscribe((course) => {
      expect(course.id).toBe(12);
    });

    const request = httpTestingController.expectOne('/api/courses/12');
    expect(request.request.method).toEqual('PUT');
    expect(request.request.body.titles.description).toEqual(
      changes.titles.description
    );

    request.flush({
      ...COURSES[12],
      ...changes,
    });
  });

  it('should give an error if save course fails', () => {
    const changes: Partial<Course> = {
      titles: { description: 'Testing Course' },
    };
    coursesService.saveCourse(12, changes).subscribe(
      () => {
        fail('the save course operation should have failed');
      },
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
        // error body can be access via error.error if needed for test
      }
    );

    const request = httpTestingController.expectOne('/api/courses/12');
    expect(request.request.method).toEqual('PUT');

    request.flush('Save course failed', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  });

  it('should find a list of lessons', () => {
    coursesService.findLessons(12).subscribe((lessons) => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(3);
    });

    const request = httpTestingController.expectOne((req) => {
      return req.url === '/api/lessons';
    });
    expect(request.request.method).toEqual('GET');
    expect(request.request.params.get('courseId')).toEqual('12'); // body only contains strings
    expect(request.request.params.get('filter')).toEqual('');
    expect(request.request.params.get('sortOrder')).toEqual('asc');
    expect(request.request.params.get('pageNumber')).toEqual('0');
    expect(request.request.params.get('pageSize')).toEqual('3');

    request.flush({
      payload: findLessonsForCourse(12).slice(0, 3),
    });
  });

  afterEach(() => {
    httpTestingController.verify(); // ensures no other http client calls inadvertently being made
  });
});
