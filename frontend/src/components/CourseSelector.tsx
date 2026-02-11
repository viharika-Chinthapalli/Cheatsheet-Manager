/**
 * Component for selecting a course.
 */

import { Course } from '../types';

interface CourseSelectorProps {
  courses: Course[];
  selectedCourseName: string | null;
  onCourseChange: (courseName: string) => void;
}

/**
 * CourseSelector component displays a dropdown to select a course.
 *
 * Args:
 *   courses: Array of available courses.
 *   selectedCourseName: Currently selected course name.
 *   onCourseChange: Callback when course selection changes.
 */
export function CourseSelector({
  courses,
  selectedCourseName,
  onCourseChange,
}: CourseSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCourseChange(e.target.value);
  };

  return (
    <div className="selector">
      <label htmlFor="course-select" className="selector-label">
        Select Course:
      </label>
      <select
        id="course-select"
        value={selectedCourseName || ''}
        onChange={handleChange}
        className="selector-select"
      >
        <option value="">-- Choose a course --</option>
        {courses.map((course) => (
          <option key={course.name} value={course.name}>
            {course.name}
          </option>
        ))}
      </select>
    </div>
  );
}


