import { ComponentFixture, TestBed } from '@angular/core/testing';

/**
 * Returns true if a Native Element has a specified css class.
 *
 * @param element
 *    the Native Element
 * @param className
 *    the class name to find
 */
export const hasClass = (element: any, className: string): boolean => {
  const classes = element.getAttribute('class');
  return classes.split(' ').indexOf(className) !== -1;
};

/**
 * Creates an instance of a component and returns test fixture.
 *
 * @param html
 *    the component's template as html
 * @param type
 *    the type of the component to instantiate
 */
export const createTestComponent = <T>(html: string, type: { new(...args: any[]): T }): ComponentFixture<T> => {
  TestBed.overrideComponent(type, {
    set: {template: html}
  });
  const fixture = TestBed.createComponent(type);

  fixture.detectChanges();
  return fixture as ComponentFixture<T>;
};
