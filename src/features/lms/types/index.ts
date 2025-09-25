export interface Course {
  id: number;
  title: string;
  description: string;
  image_url: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  instructor_name: string;
  instructor_avatar: string;
  category: string;
  subcategory?: string;
  duration: string; // "28 hours"
  lectures_count: number;
  students_enrolled: number;
  rating: number;
  rating_count: number;
  is_bestseller: boolean;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  languages: string[];
  last_updated: string;
  status: 'published' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
  // Course content
  sections: CourseSection[];
  requirements: string[];
  what_you_learn: string[];
}

export interface CourseSection {
  id: number;
  title: string;
  lectures_count: number;
  duration: string;
  lectures: Lecture[];
  is_expanded?: boolean;
}

export interface Lecture {
  id: number;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment' | 'download';
  duration?: string;
  is_preview: boolean;
  is_completed?: boolean;
  content_url?: string;
  description?: string;
}

export interface Test {
  id: number;
  title: string;
  description: string;
  course_id: number;
  questions_count: number;
  duration: number; // minutes
  passing_score: number; // percentage
  attempts_allowed: number;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Question {
  id: number;
  test_id: number;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'text' | 'essay';
  options?: string[];
  correct_answer?: string | string[];
  points: number;
  explanation?: string;
}

export interface TestResult {
  id: number;
  test_id: number;
  user_id: number;
  score: number;
  percentage: number;
  correct_answers: number;
  wrong_answers: number;
  total_questions: number;
  time_taken: number; // minutes
  passed: boolean;
  completed_at: string;
  answers: UserAnswer[];
}

export interface UserAnswer {
  question_id: number;
  answer: string | string[];
  is_correct: boolean;
  points_earned: number;
}

export interface Certificate {
  id: number;
  course_id: number;
  user_id: number;
  certificate_url: string;
  issued_at: string;
  verification_code: string;
}

export interface CartItem {
  id: number;
  course_id: number;
  course: Course;
  added_at: string;
}

export interface Enrollment {
  id: number;
  course_id: number;
  user_id: number;
  progress: number; // percentage
  last_accessed: string;
  completed_at?: string;
  certificate_id?: number;
  enrolled_at: string;
}

// Filters & Pagination
export interface CourseFilters {
  category?: string;
  level?: string;
  price?: 'free' | 'paid' | 'all';
  rating?: number;
  duration?: string;
  language?: string;
  search?: string;
  sort_by?: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'rating' | 'popular';
  instructor_id?: number;
}

export interface LMSStats {
  total_courses: number;
  total_students: number;
  total_instructors: number;
  total_revenue: number;
  courses_completed: number;
  certificates_issued: number;
  average_rating: number;
  active_enrollments: number;
}