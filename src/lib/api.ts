// src/lib/api.ts
import { API_CONFIG } from './config';

// ===== TYPE DEFINITIONS =====

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
  user_type: "student" | "lecturer";
}

export interface UserProfile {
  id: number;
  full_name: string;
  student_code?: string;
  lecturer_code?: string;
  email: string;
  department: string;
  user_type: "student" | "lecturer";
  is_admin?: boolean;
  token?: string;
  account?: {
    is_admin: boolean;
    username: string;
  };
}

export interface LoginResponse {
  user: UserProfile;
  token: string;
}

export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  user?: UserProfile;
  token?: string;
  message?: string;
  code?: number;
  result?: T;
}

// LMS Types
export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  teacherId: number;
  status: "UPCOMING" | "OPEN" | "CLOSED";
  startTime?: string;
  endTime?: string;
  createdAt: string;
  updatedAt: string;
  categoryId?: number;
  categoryName?: string;
  img?: string;
  lessons?: Lesson[];
  enrollments?: Enrollment[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  courses?: Course[];
}

export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  description: string;
  orderIndex: number;
  duration?: number;
  createdAt: string;
  updatedAt: string;
  videoPath?: string;
  status: "UPCOMING" | "OPEN" | "CLOSED";
}

export interface Quiz {
  id: number;
  lessonId: number;
  title: string;
  description: string;
  timeLimit?: number;
  maxAttempts?: number;
  passScore?: number;
  createdAt: string;
  updatedAt: string;
  questions?: Question[];
  quizResults?: QuizResult[];
}

export interface Question {
  id: number;
  quizId: number;
  questionText: string;
  questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";
  orderIndex: number;
  points: number;
  createdAt: string;
  updatedAt: string;
  answerOptions?: AnswerOption[];
}

export interface AnswerOption {
  id: number;
  questionId: number;
  answerText: string;
  isCorrect: boolean;
  orderIndex: number;
}

export interface QuizResult {
  id: number;
  quizId: string;
  quizTitle?: string;
  studentId: number;
  studentName?: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken?: number;
  attemptNumber: number;
  isPassed: boolean;
  takenAt: string;
  feedback?: string;
}

export interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  enrolledAt: string;
}

// ===== API CLIENT CLASS =====
class ApiClient {
  private getServiceUrl(service: 'identity_service' | 'lms_service'): string {
    return API_CONFIG[service];
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type");
    let data: unknown;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text };
    }

    if (!response.ok) {
      const errorData = data as { message?: string };
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data as ApiResponse<T>;
  }

  // ===== TOKEN MANAGEMENT =====
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("token", token);
  }

  clearToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // ===== IDENTITY SERVICE METHODS =====
  async login(credentials: LoginRequest): Promise<ApiResponse<UserProfile>> {
    // Use unified login endpoint with user_type
    const response = await fetch(`${this.getServiceUrl('identity_service')}/api/v1/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
        user_type: credentials.user_type
      }),
    });

    const result = await this.handleResponse<UserProfile>(response);
    
    if (result.data?.token) {
      this.setToken(result.data.token);
    }

    return result;
  }

  // Alternative login methods for specific user types
  async loginStudent(username: string, password: string): Promise<ApiResponse<UserProfile>> {
    const response = await fetch(`${this.getServiceUrl('identity_service')}/api/v1/login/student`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password
      }),
    });

    const result = await this.handleResponse<UserProfile>(response);
    
    if (result.data?.token) {
      this.setToken(result.data.token);
    }

    return result;
  }

  async loginLecturer(username: string, password: string): Promise<ApiResponse<UserProfile>> {
    const response = await fetch(`${this.getServiceUrl('identity_service')}/api/v1/login/lecturer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password
      }),
    });

    const result = await this.handleResponse<UserProfile>(response);
    
    if (result.data?.token) {
      this.setToken(result.data.token);
    }

    return result;
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${this.getServiceUrl('identity_service')}/api/v1/logout`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });
    } finally {
      this.clearToken();
    }
  }

  async getMe(): Promise<ApiResponse<UserProfile>> {
    const response = await fetch(`${this.getServiceUrl('identity_service')}/api/v1/me`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<UserProfile>(response);
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await fetch(`${this.getServiceUrl('identity_service')}/api/v1/refresh`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });

    const result = await this.handleResponse<{ token: string }>(response);
    
    if (result.token) {
      this.setToken(result.token);
    }

    return result;
  }

  async getStudentProfile(): Promise<ApiResponse<UserProfile>> {
    const response = await fetch(`${this.getServiceUrl('identity_service')}/api/v1/student/profile`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<UserProfile>(response);
  }

  async updateStudentProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    const response = await fetch(`${this.getServiceUrl('identity_service')}/api/v1/student/profile`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<UserProfile>(response);
  }

  async getLecturerProfile(): Promise<ApiResponse<UserProfile>> {
    const response = await fetch(`${this.getServiceUrl('identity_service')}/api/v1/lecturer/profile`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<UserProfile>(response);
  }

  async updateLecturerProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    const response = await fetch(`${this.getServiceUrl('identity_service')}/api/v1/lecturer/profile`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<UserProfile>(response);
  }

  // Legacy method for backward compatibility
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return this.getMe();
  }

  // ===== LMS SERVICE METHODS =====

  // Categories
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/category`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Category[]>(response);
  }

  async getCategoryById(id: number): Promise<ApiResponse<Category>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/category/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Category>(response);
  }

  async createCategory(data: { name: string; description: string }): Promise<ApiResponse<Category>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/category/createCategory`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Category>(response);
  }

  // Courses
  async getCourses(): Promise<ApiResponse<Course[]>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/course`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Course[]>(response);
  }

  async getCourseById(id: number): Promise<ApiResponse<Course>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/course/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Course>(response);
  }

  async createCourse(formData: FormData): Promise<ApiResponse<Course>> {
    const token = this.getToken();
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/course/createCourse`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type for FormData
      },
      body: formData,
    });
    return this.handleResponse<Course>(response);
  }

  async updateCourse(id: number, data: Partial<Course>): Promise<ApiResponse<Course>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/course/updateCourse/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Course>(response);
  }

  async deleteCourse(id: number): Promise<ApiResponse<string>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/course/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<string>(response);
  }

  // Lessons
  async createLesson(formData: FormData): Promise<ApiResponse<Lesson>> {
    const token = this.getToken();
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/lesson/createLesson`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    return this.handleResponse<Lesson>(response);
  }

  async getLessonById(id: number): Promise<ApiResponse<Lesson>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/lesson/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Lesson>(response);
  }

  async updateLesson(id: number, data: Partial<Lesson>): Promise<ApiResponse<Lesson>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/lesson/updateLesson/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Lesson>(response);
  }

  async deleteLesson(id: number): Promise<ApiResponse<string>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/lesson/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<string>(response);
  }

  // Enrollments
  async enrollCourse(courseId: number): Promise<ApiResponse<Enrollment>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/enrollment/enroll`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ courseId }),
    });
    return this.handleResponse<Enrollment>(response);
  }

  async getMyEnrollments(): Promise<ApiResponse<Enrollment[]>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/enrollment/my-enrollments`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Enrollment[]>(response);
  }

  async getAllEnrollments(): Promise<ApiResponse<Enrollment[]>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/enrollment`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Enrollment[]>(response);
  }

  // Quiz
  async getQuizzes(): Promise<ApiResponse<Quiz[]>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/quiz`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Quiz[]>(response);
  }

  async getQuizById(id: number): Promise<ApiResponse<Quiz>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/quiz/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Quiz>(response);
  }

  async getQuizzesByLesson(lessonId: number): Promise<ApiResponse<Quiz[]>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/quiz/lesson/${lessonId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Quiz[]>(response);
  }

  async getQuizzesByCourse(courseId: number): Promise<ApiResponse<Quiz[]>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/quiz/course/${courseId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Quiz[]>(response);
  }

  async createQuiz(data: { 
    lessonId: number; 
    title: string; 
    description: string; 
    timeLimit?: number; 
    maxAttempts?: number; 
    passScore?: number; 
  }): Promise<ApiResponse<Quiz>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/quiz`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Quiz>(response);
  }

  // Quiz Results
  async submitQuiz(data: {
    quizId: number;
    answers: Record<number, string>;
    timeTaken?: number;
  }): Promise<ApiResponse<QuizResult>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/quiz-results/submit`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<QuizResult>(response);
  }

  async getMyQuizResults(quizId: number): Promise<ApiResponse<QuizResult[]>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/quiz-results/my-results/${quizId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<QuizResult[]>(response);
  }

  async getMyBestResult(quizId: number): Promise<ApiResponse<QuizResult>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/quiz-results/my-best-result/${quizId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<QuizResult>(response);
  }

  async getMyCourseResults(courseId: number): Promise<ApiResponse<QuizResult[]>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/quiz-results/my-course-results/${courseId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<QuizResult[]>(response);
  }

  async canTakeQuiz(quizId: number): Promise<ApiResponse<boolean>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/quiz-results/can-take/${quizId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<boolean>(response);
  }

  // Questions
  async getQuestionsByQuiz(quizId: number): Promise<ApiResponse<Question[]>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/question/quiz/${quizId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Question[]>(response);
  }

  async createQuestion(data: {
    quizId: number;
    questionText: string;
    questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";
    points: number;
    orderIndex: number;
  }): Promise<ApiResponse<Question>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/question`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Question>(response);
  }

  // Answer Options
  async getAnswerOptionsByQuestion(questionId: number): Promise<ApiResponse<AnswerOption[]>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/answerOption/question/${questionId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<AnswerOption[]>(response);
  }

  async createAnswerOption(data: {
    questionId: number;
    answerText: string;
    isCorrect: boolean;
    orderIndex: number;
  }): Promise<ApiResponse<AnswerOption>> {
    const response = await fetch(`${this.getServiceUrl('lms_service')}/api/answerOption`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<AnswerOption>(response);
  }

  // ===== GENERIC REQUEST METHOD =====
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Determine service based on endpoint
    let serviceUrl: string;
    if (endpoint.startsWith('/v1/auth/') || endpoint.includes('identity')) {
      serviceUrl = this.getServiceUrl('identity_service');
    } else {
      serviceUrl = this.getServiceUrl('lms_service');
    }

    const url = `${serviceUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();