import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useLanguageStore } from '../stores/language'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../modules/public/HomePage.vue'),
        meta: { public: true }
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../modules/public/AboutPage.vue'),
        meta: { public: true }
    },
    {
        path: '/programs',
        name: 'Programs',
        component: () => import('../modules/public/ProgramsPage.vue'),
        meta: { public: true }
    },
    {
        path: '/admissions',
        name: 'Admissions',
        component: () => import('../modules/public/AdmissionsPage.vue'),
        meta: { public: true }
    },
    {
        path: '/contact',
        name: 'Contact',
        component: () => import('../modules/public/ContactPage.vue'),
        meta: { public: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../modules/auth/Login.vue'),
        meta: { public: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../modules/auth/Register.vue'),
        meta: { public: true }
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () => import('../modules/auth/ForgotPassword.vue'),
        meta: { public: true }
    },
    {
        path: '/admin',
        component: () => import('../layouts/AdminLayout.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'teacher', 'accountant'] },
        children: [
            {
                path: '',
                name: 'AdminDashboard',
                component: () => import('../modules/admin/Dashboard.vue')
            },
            {
                path: 'students',
                name: 'Students',
                component: () => import('../modules/admin/Students/StudentList.vue')
            },
            {
                path: 'students/create',
                name: 'CreateStudent',
                component: () => import('../modules/admin/Students/StudentForm.vue')
            },
            {
                path: 'students/:id/edit',
                name: 'EditStudent',
                component: () => import('../modules/admin/Students/StudentForm.vue')
            },
            {
                path: 'students/:id',
                name: 'StudentDetails',
                component: () => import('../modules/admin/Students/StudentDetails.vue')
            },
            {
                path: 'teachers',
                name: 'Teachers',
                component: () => import('../modules/admin/Teachers/TeacherList.vue')
            },
            {
                path: 'teachers/create',
                name: 'CreateTeacher',
                component: () => import('../modules/admin/Teachers/TeacherForm.vue')
            },
            {
                path: 'teachers/:id/edit',
                name: 'EditTeacher',
                component: () => import('../modules/admin/Teachers/TeacherForm.vue')
            },
            {
                path: 'classes',
                name: 'Classes',
                component: () => import('../modules/admin/Classes/ClassList.vue')
            },
            {
                path: 'classes/create',
                name: 'CreateClass',
                component: () => import('../modules/admin/Classes/ClassForm.vue')
            },
            {
                path: 'classes/:id',
                name: 'EditClass',
                component: () => import('../modules/admin/Classes/ClassForm.vue')
            },
            {
                path: 'attendance',
                name: 'Attendance',
                component: () => import('../modules/admin/Attendance/AttendanceMarking.vue')
            },
            {
                path: 'attendance/report',
                name: 'AttendanceReport',
                component: () => import('../modules/admin/Attendance/AttendanceReport.vue')
            },
            {
                path: 'payments',
                name: 'Payments',
                component: () => import('../modules/admin/Payments/PaymentList.vue')
            },
            {
                path: 'payments/create',
                name: 'CreatePayment',
                component: () => import('../modules/admin/Payments/PaymentForm.vue')
            },
            {
                path: 'payments/approval',
                name: 'PaymentApproval',
                component: () => import('../modules/admin/Payments/PaymentApproval.vue')
            },
            {
                path: 'payments/:id',
                name: 'PaymentDetails',
                component: () => import('../modules/admin/Payments/PaymentForm.vue')
            },
            {
                path: 'payments/:id/edit',
                name: 'EditPayment',
                component: () => import('../modules/admin/Payments/PaymentForm.vue')
            },
            {
                path: 'crm',
                name: 'CRM',
                component: () => import('../modules/admin/CRM/LeadList.vue')
            },
            {
                path: 'crm/create',
                name: 'CreateLead',
                component: () => import('../modules/admin/CRM/LeadForm.vue')
            },
            {
                path: 'crm/:id',
                name: 'EditLead',
                component: () => import('../modules/admin/CRM/LeadForm.vue')
            },
            {
                path: 'crm/pipeline',
                name: 'LeadPipeline',
                component: () => import('../modules/admin/CRM/LeadPipeline.vue')
            },
            {
                path: 'reports',
                name: 'Reports',
                component: () => import('../modules/admin/Reports/ReportViewer.vue')
            },
            {
                path: 'parents',
                name: 'Parents',
                component: () => import('../modules/admin/Parents/ParentList.vue')
            },
            {
                path: 'parents/create',
                name: 'CreateParent',
                component: () => import('../modules/admin/Parents/ParentForm.vue')
            },
            {
                path: 'parents/:id',
                name: 'EditParent',
                component: () => import('../modules/admin/Parents/ParentForm.vue')
            },
            {
                path: 'exams',
                name: 'Exams',
                component: () => import('../modules/admin/Exams/ExamList.vue')
            },
            {
                path: 'exams/create',
                name: 'CreateExam',
                component: () => import('../modules/admin/Exams/ExamForm.vue')
            },
            {
                path: 'exams/:id/edit',
                name: 'EditExam',
                component: () => import('../modules/admin/Exams/ExamForm.vue')
            },
            {
                path: 'profile',
                name: 'AdminProfile',
                component: () => import('../modules/admin/Profile.vue')
            }
        ]
    },
    {
        path: '/super-admin',
        component: () => import('../layouts/SuperAdminLayout.vue'),
        meta: { requiresAuth: true, roles: ['super_admin'] },
        children: [
            {
                path: '',
                name: 'SuperAdminDashboard',
                component: () => import('../modules/super-admin/Dashboard.vue')
            },
            {
                path: 'schools',
                name: 'Schools',
                component: () => import('../modules/super-admin/Schools/SchoolList.vue')
            },
            {
                path: 'schools/create',
                name: 'CreateSchool',
                component: () => import('../modules/super-admin/Schools/SchoolForm.vue')
            },
            {
                path: 'schools/:id',
                name: 'SchoolDetails',
                component: () => import('../modules/super-admin/Schools/SchoolDetails.vue')
            },
            {
                path: 'users',
                name: 'UserManagement',
                component: () => import('../modules/super-admin/Users/UserManagement.vue')
            },
            {
                path: 'analytics',
                name: 'GlobalStats',
                component: () => import('../modules/super-admin/Analytics/GlobalStats.vue')
            },
            {
                path: 'profile',
                name: 'SuperAdminProfile',
                component: () => import('../modules/super-admin/Profile.vue')
            }
        ]
    },
    {
        path: '/teacher',
        component: () => import('../layouts/TeacherLayout.vue'),
        meta: { requiresAuth: true, roles: ['teacher'] },
        children: [
            {
                path: '',
                name: 'TeacherDashboard',
                component: () => import('../modules/teacher/Dashboard.vue')
            },
            {
                path: 'classes',
                name: 'TeacherClasses',
                component: () => import('../modules/teacher/Classes.vue')
            },
            {
                path: 'students',
                name: 'TeacherStudents',
                component: () => import('../modules/teacher/Students.vue')
            },
            {
                path: 'students/:id',
                name: 'TeacherStudentDetail',
                component: () => import('../modules/teacher/StudentDetail.vue')
            },
            {
                path: 'attendance',
                name: 'TeacherAttendance',
                component: () => import('../modules/teacher/Attendance.vue')
            },
            {
                path: 'grades',
                name: 'TeacherGrades',
                component: () => import('../modules/teacher/Grades.vue')
            },
            {
                path: 'exams',
                name: 'TeacherExams',
                component: () => import('../modules/teacher/Exams.vue')
            },
            {
                path: 'exams/create',
                name: 'TeacherCreateExam',
                component: () => import('../modules/teacher/ExamForm.vue')
            },
            {
                path: 'exams/:id/edit',
                name: 'TeacherEditExam',
                component: () => import('../modules/teacher/ExamForm.vue')
            },
            {
                path: 'grade-entry',
                name: 'GradeEntry',
                component: () => import('../modules/teacher/GradeEntry.vue')
            },
            {
                path: 'profile',
                name: 'TeacherProfile',
                component: () => import('../modules/admin/Profile.vue')
            }
        ]
    },
    {
        path: '/accountant',
        component: () => import('../layouts/AccountantLayout.vue'),
        meta: { requiresAuth: true, roles: ['accountant'] },
        children: [
            {
                path: '',
                name: 'AccountantDashboard',
                component: () => import('../modules/accountant/Dashboard.vue')
            },
            {
                path: 'payments',
                name: 'AccountantPayments',
                component: () => import('../modules/accountant/Payments.vue')
            },
            {
                path: 'reports',
                name: 'AccountantReports',
                component: () => import('../modules/accountant/Reports.vue')
            },
            {
                path: 'profile',
                name: 'AccountantProfile',
                component: () => import('../modules/admin/Profile.vue')
            }
        ]
    },
    {
        path: '/parent',
        component: () => import('../layouts/ParentLayout.vue'),
        meta: { requiresAuth: true, roles: ['parent'] },
        children: [
            {
                path: '',
                name: 'ParentDashboard',
                component: () => import('../modules/parent/Dashboard.vue')
            },
            {
                path: 'children',
                name: 'ParentChildren',
                component: () => import('../modules/parent/Children.vue')
            },
            {
                path: 'children/:id',
                name: 'ParentChildDetails',
                component: () => import('../modules/parent/ChildDetails.vue')
            },
            {
                path: 'payments',
                name: 'ParentPayments',
                component: () => import('../modules/parent/Payments.vue')
            },
            {
                path: 'attendance',
                name: 'ParentAttendance',
                component: () => import('../modules/parent/Attendance.vue')
            },
            {
                path: 'grades',
                name: 'ParentGrades',
                component: () => import('../modules/parent/Grades.vue')
            },
            {
                path: 'profile',
                name: 'ParentProfile',
                component: () => import('../modules/admin/Profile.vue')
            }
        ]
    },
    {
        path: '/student',
        component: () => import('../layouts/StudentLayout.vue'),
        meta: { requiresAuth: true, roles: ['student'] },
        children: [
            {
                path: '',
                name: 'StudentDashboard',
                component: () => import('../modules/student/Dashboard.vue')
            },
            {
                path: 'profile',
                name: 'StudentProfile',
                component: () => import('../modules/student/Profile.vue')
            },
            {
                path: 'attendance',
                name: 'StudentAttendance',
                component: () => import('../modules/student/Attendance.vue')
            },
            {
                path: 'grades',
                name: 'StudentGrades',
                component: () => import('../modules/student/Grades.vue')
            },
            {
                path: 'payments',
                name: 'StudentPayments',
                component: () => import('../modules/student/Payments.vue')
            },
            {
                path: 'schedule',
                name: 'StudentSchedule',
                component: () => import('../modules/student/Schedule.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

// Track if auth has been initialized
let authInitialized = false

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    // ✅ FIX: Only initialize auth once
    if (!authInitialized) {
        await authStore.initialize()
        authInitialized = true
    }

    // If already authenticated and trying to go to login, redirect to dashboard
    if (to.path === '/login' && authStore.isAuthenticated) {
        const role = authStore.role
        const redirectMap = {
            'super_admin': '/super-admin',
            'admin': '/admin',
            'teacher': '/teacher',
            'accountant': '/accountant',
            'parent': '/parent',
            'student': '/student'
        }
        const redirectPath = redirectMap[role] || '/'
        next(redirectPath)
        return
    }

    // Check if route requires authentication
    if (to.meta.requiresAuth) {
        if (!authStore.isAuthenticated) {
            next('/login')
            return
        }

        // Check if user has required role
        if (to.meta.roles && !to.meta.roles.includes(authStore.role)) {
            const role = authStore.role
            const redirectMap = {
                'super_admin': '/super-admin',
                'admin': '/admin',
                'teacher': '/teacher',
                'accountant': '/accountant',
                'parent': '/parent',
                'student': '/student'
            }
            const redirectPath = redirectMap[role] || '/'
            next(redirectPath)
            return
        }

        next()
    } else if (to.meta.public) {
        next()
    } else {
        next()
    }
})

export default router